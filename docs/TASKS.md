# TenSec Check — 개발 태스크

**규칙**: 각 Phase 완료 시 `docs/logs/phase-N-완료.md` 파일 작성 (날짜, 완료 항목, 변경 사항, 다음 단계)

> **아키텍처 핵심**: PDF 텍스트 추출은 브라우저(클라이언트)에서 수행, API는 Edge Runtime으로 동작 → Vercel Hobby 플랜 호환

---

## Phase 1: MVP 프로토타입 ✅

**목표**: 핵심 플로우(업로드 → 클라이언트 PDF 추출 → Edge AI 분석 → 결과)가 작동하는 최소 프로토타입

### 1-1. 프로젝트 초기화 ✅
- [x] `npx create-next-app@latest` — TypeScript, Tailwind, App Router, src/ 디렉토리
- [x] Pretendard 폰트 CDN 설정 (`globals.css`)
- [x] 환경변수 구조 설정 (`.env.local`, `.env.example`)
- [x] `docs/`, `.agent/skills/` 디렉토리 생성
- [x] `package.json` 주요 의존성 추가: `@google/generative-ai`, `pdfjs-dist`, `lucide-react`
- [x] `next.config.ts` webpack 설정: `config.resolve.alias.canvas = false` (pdfjs-dist 필수)

### 1-2. 도메인 타입 정의 (`src/types/`) ✅
- [x] `analysis.ts`: `RiskItem`, `RiskReport`, `SafetyScore`, `TrafficLight`, `ScoreDeduction` 타입
- [x] `api.ts`: API 요청/응답 타입 (`AnalyzeRequest`, `AnalyzeResponse`, `ErrorResponse`)
- [x] `document.ts`: 등기부등본 도메인 타입 (`RegistrationSection`, `RiskSeverity`)

### 1-3. 랜딩 페이지 기본 구조 ✅
- [x] `src/app/page.tsx`: 히어로 섹션 (슬로건 + 업로드 영역)
- [x] `src/app/layout.tsx`: 루트 레이아웃, 메타태그 기본 설정
- [x] `src/app/globals.css`: Tailwind 기본 + Pretendard + CSS 변수
- [x] `src/components/layout/Header.tsx`: 서비스명 + 신뢰 배지
- [x] `src/components/layout/Footer.tsx`: 면책 조항 한 줄 + 저작권

### 1-4. 클라이언트 PDF 추출 컴포넌트 ✅
- [x] `src/components/upload/PdfExtractor.ts` (클라이언트 전용): `pdfjs-dist` 래퍼
  - Worker CDN 설정: `GlobalWorkerOptions.workerSrc = CDN URL`
  - 텍스트 추출 함수: `extractTextFromPdf(file: File): Promise<string>`
  - 스캔본 감지: 추출 텍스트 < 100자 → `PdfExtractError` throw
- [x] `src/components/upload/UploadSection.tsx`: dragover / drop + 파일 선택
  - 상태: `idle | consent | extracting | analyzing | redirecting | error`
  - PDF 선택 후 즉시 PdfExtractor 호출 → 텍스트 추출 → API 호출
- [x] `src/components/legal/ConsentModal.tsx`: 면책 동의 모달

### 1-5. Edge Runtime API Route: `/api/analyze` ✅
- [x] `src/app/api/analyze/route.ts`:
  - `export const runtime = "edge"` 선언
  - `{ text, propertyPrice?, consent }` 파싱
  - 텍스트 길이 최소 검증 (100자 이상)
  - Gemini API Function Calling 호출
  - JSON 응답 반환
- [x] 에러 핸들링: 텍스트 오류 / 등기부등본 아님(422) / API 오류 / 타임아웃 각각 처리

### 1-6. Gemini 프롬프트 초안 ✅
- [x] `src/lib/ai/prompts.ts`: 시스템 프롬프트 + Function Declaration 스키마
  - 모델: `gemini-2.0-flash` (속도 우선)
  - `FunctionCallingMode.ANY` 강제 적용

### 1-7. 결과 페이지 기본 구현 ✅
- [x] `src/app/analyze/page.tsx`: 결과 페이지 (SSR-safe, sessionStorage에서 데이터 읽기)
- [x] 안전 점수 + 신호등 색상 표시
- [x] 위험 항목 텍스트 리스트
- [x] "다시 분석하기" 버튼

**✅ Phase 1 완료**: `docs/logs/phase-1-완료.md` 작성 완료

---

## Phase 2: 핵심 기능 완성 ✅

**목표**: 프로덕션 품질의 핵심 기능 구현 + 법적 요구사항 충족

### 2-1. 분석 엔진 강화 ✅
- [x] `src/lib/analysis/extractor.ts`: Gemini function call 응답 파싱 → `AnalyzeResponse` 구조화
- [x] `src/lib/analysis/scorer.ts`: 결정론적 감점 알고리즘 (0-100점)
  - 갑구: 압류 -25점/건(max -50), 가압류 -20점/건(max -40), 예고등기 -30점
  - 을구: 근저당 비율 60-70% → -20점, 70-80% → -35점, 80%+ → -50점, 임차권등기 -15점
- [x] `src/lib/analysis/classifier.ts`: 신호등 임계값 (0-39 빨강 / 40-69 노랑 / 70-100 초록)

### 2-2. Gemini 프롬프트 정교화 ✅
- [x] Few-shot 예시 2개 추가 (근저당권 패턴, 압류·가압류 복수 패턴)
- [x] Function Calling 구조화 출력 완성 (RiskReport 스키마 완전 적용)
- [x] 등기부등본이 아닌 문서 업로드 시 `isRegistrationDocument: false` 감지 → 422 응답

### 2-3. UI 컴포넌트 완성 ✅
- [x] `src/components/analysis/ScoreGauge.tsx`: 선형 프로그레스 바 (0-100)
- [x] `src/components/analysis/TrafficLight.tsx`: 신호등 3구 + 활성 색상 glow
- [x] `src/components/analysis/RiskItem.tsx`: SeverityBadge + 설명 카드
- [x] `src/components/analysis/RiskSummary.tsx`: HIGH/MEDIUM 집계 헤더 + 항목 리스트
- [x] `src/components/analysis/ExpertCTA.tsx`: 신호등별 CTA (red 강조 ring)
- [x] `src/components/ui/Badge.tsx`, `Button.tsx`, `Card.tsx`, `Modal.tsx`
- [x] `src/components/legal/ConsentModal.tsx`: 전문 면책 조항 + 스크롤 영역
- [x] `src/components/legal/DisclaimerBanner.tsx`: 결과 페이지 하단 상시 표시

### 2-4. UX 개선 ✅
- [x] 3단계 로딩 UI: "파일 읽는 중 → AI 분석 중 → 결과 준비 중" 스텝 표시 (`LoadingSteps`)
- [x] AbortController 30초 타임아웃 + `ERROR_MESSAGES` 매핑
- [x] 에러별 사용자 친화적 메시지 (스캔본 / API 오류 / 네트워크 오류 / 등기부등본 아님)
- [x] 결과 공유 기능: Web Share API + 클립보드 복사 fallback

### 2-5. 법적 요구사항 구현 ✅
- [x] 분석 전 ConsentModal 필수 동의 플로우 (동의 없이 API 호출 불가)
- [x] `/privacy` 페이지: 개인정보처리방침 (6개 섹션)
  - Google Gemini API 사용 명시 (전체 텍스트 전송 사실 포함)
  - GA4 쿠키(`_ga`, `_ga_*`) 사용 및 opt-out 방법 명시
- [x] DisclaimerBanner 결과 페이지 하단 고정

### 2-6. 전문가 연결 CTA ✅
- [x] `ExpertCTA.tsx` 신호등별 메시지 변형 (red/yellow/green 3종)
- [x] UTM 파라미터: `utm_source=tenseccheck&utm_medium=cta&utm_campaign={color}-result`
- [x] 빨간불: `ring-2 ring-red-300` 강조 박스
- [x] 환경변수 미설정 시 공인중개사/법무사 static 안내 fallback

### 2-7. 반응형 디자인 완성 ✅
- [x] 모바일 375px 기준 전체 플로우 최적화
- [x] `sm:` 브레이크포인트: 신뢰 배지 크기, 데스크탑 이용방법 3단계 가이드 표시
- [x] Header overflow 보호 (`flex-shrink-0`, `min-w-0`, `whitespace-nowrap`)

**✅ Phase 2 완료**: `docs/logs/phase-2-완료.md` 작성 완료

---

## Phase 3: 완성도 & 수익화

**목표**: 배포 가능한 프로덕션 서비스 + 수익화 기반 구축

### 3-1. SEO 최적화 ✅
- [x] `layout.tsx` 전체 메타데이터 완성: `metadataBase`, `title.template`, description, keywords 8개
- [x] OpenGraph (`locale: "ko_KR"`, url, siteName) + Twitter Card
- [x] `robots` 메타 + `alternates.canonical`
- [x] `src/app/sitemap.ts`: `/`(priority 1.0), `/privacy`(priority 0.4) — `/api/*`, `/analyze` 제외
- [x] `src/app/robots.ts`: `/api/`, `/analyze` disallow + sitemap URL 포함
- [x] `src/app/opengraph-image.tsx`: 동적 OG 이미지 (Edge Runtime, 1200×630, navy gradient)

### 3-2. 성능 최적화 ✅
- [x] `layout.tsx` Pretendard CDN preconnect + dns-prefetch
- [x] `src/app/analyze/loading.tsx`: pulse skeleton (CLS 방지)
- [x] `UploadSection.tsx` ARIA 접근성: `role="button"`, `tabIndex`, `aria-label`, `aria-busy`, `onKeyDown`
- [x] `route.ts` `generateContentStream` 적용 (Edge 25초 제한 내 연결 안정성 향상)
- [ ] Lighthouse 실측 90+ 확인 (배포 후)

### 3-3. 수익화 인프라
- [x] GA4 스크립트 연동: `layout.tsx`에 `next/script strategy="afterInteractive"` 추가
  - `NEXT_PUBLIC_GA4_ID` 환경변수로 조건부 활성화 (미설정 시 비활성화)
- [ ] CTA 클릭 추적 이벤트 설정 — **추후** (로컬호스트 화면 확인 후)
- [ ] 파트너 공인중개사/법무사 연결 로직 설계 — **추후**

### 3-4. 배포 & 인프라
- [ ] **Vercel Hobby 플랜** 배포
  - Edge Runtime 25초 제한 → `generateContentStream`으로 이미 대응
  - 도메인: Vercel 기본 제공 URL 사용 (`*.vercel.app`)
- [ ] 환경변수 프로덕션 설정: `GEMINI_API_KEY`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_GA4_ID`
- [ ] `src/app/api/health/route.ts` 헬스 체크 엔드포인트 확인
- [ ] Rate Limiting: **IP당 10회/일** 제한 — Vercel KV + `@upstash/ratelimit` 사용
  - Vercel KV: Hobby 플랜 무료 티어 포함 (Vercel 대시보드 → Storage → KV 생성)
  - `@upstash/ratelimit` 라이브러리: sliding window 알고리즘
  - `src/middleware.ts`: `/api/analyze` 요청에만 적용, IP 추출 → KV 조회 → 초과 시 429 응답
  - 429 응답 시 클라이언트 에러 메시지: "오늘 분석 횟수(10회)를 초과했습니다. 내일 다시 이용해 주세요."
  - 환경변수 추가: `KV_REST_API_URL`, `KV_REST_API_TOKEN` (Vercel KV 자동 주입)

### 3-5. 모니터링
- [ ] Vercel Analytics 대시보드 활성화 (Hobby 플랜 기본 제공)
- [ ] **에러 로깅: Vercel 기본 로그만 사용** (Sentry 미사용)
- [ ] Gemini API 비용 알림: Google Cloud Console → 예산 알림 설정

### 3-6. 최종 QA
- [ ] 실제 등기부등본 PDF 5종 이상 업로드 테스트
- [ ] 엣지 케이스: 스캔본 PDF → 오류 메시지 확인
- [ ] 엣지 케이스: 암호화 PDF → 오류 메시지 확인
- [ ] 엣지 케이스: 등기부등본이 아닌 PDF → AI 안내 메시지 확인
- [ ] 모바일 실기기 테스트 (iOS Safari, Android Chrome)
- [ ] 법적 플로우 최종 확인 (동의 없이 분석 불가)
- [ ] Lighthouse 실측 (Performance / Accessibility / SEO / Best Practices)

**완료 시**: `docs/logs/phase-3-완료.md` 작성

---

## Phase 4: 기능 확장 (미정, 수요 확인 후)

### 4-1. 수익화 모델

> **배경**: Phase 3에서 IP당 10회/일 무료 제공. 초과 사용 수요를 유료 전환으로 연결.

- [ ] **무제한 이용권** (1회성 결제)
  - 결제 후 발급되는 토큰을 KV에 저장, Rate Limit 우회 처리
  - 결제 수단: 토스페이먼츠 또는 카카오페이 (간편결제)
- [ ] **구독 플랜** (월정액)
  - 월 N회 제한 또는 무제한 분석
  - 카카오 간편 로그인 + 히스토리 저장 선행 필요
- [ ] **파트너 공인중개사/법무사 연결 수수료**
  - 빨간불/노란불 결과 → 전문가 연결 CTA → 상담 성사 시 수수료
  - UTM 추적 기반 전환율 측정 (3-3에서 GA4 연동 완료)
- [ ] **리포트 PDF 다운로드** (유료)
  - 분석 결과를 서식화된 PDF로 저장 (계약 전 보관용)

### 4-2. 기능 확장

- [ ] OCR 지원 — 스캔본 이미지 PDF 분석
- [ ] 특약사항 독소 조항 분석
- [ ] 건축물대장, 토지대장 분석
- [ ] 공유 가능한 결과 링크 (암호화)
- [ ] 사용자 지정 도메인 연결 (수요 확인 후)

---

## 로그 파일 형식 예시

```markdown
# Phase N 완료 로그

**완료일**: YYYY-MM-DD
**작업자**: [Claude Code / 사용자]

## 완료된 항목
- [x] 항목 1
- [x] 항목 2

## 주요 결정 사항
- ...

## 발견된 이슈 및 해결
- ...

## 다음 단계 (Phase N+1)
- 우선 시작할 태스크: ...
- 주의 사항: ...
```
