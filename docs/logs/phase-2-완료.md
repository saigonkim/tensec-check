# Phase 2 완료 로그

**완료일**: 2026-04-04
**작업자**: Claude Code

---

## 완료된 항목

- [x] 2-1. 분석 엔진 강화
- [x] 2-2. Gemini 프롬프트 정교화
- [x] 2-3. UI 컴포넌트 완성
- [x] 2-4. UX 개선
- [x] 2-5. 법적 요구사항 구현
- [x] 2-6. 전문가 연결 CTA
- [x] 2-7. 반응형 디자인 완성

---

## 2-4 상세: UX 개선

### UploadSection — 3단계 로딩 UI
기존 2단계(extracting | analyzing) → 3단계로 확장:
```
① 파일 읽는 중 (extracting)  → ② AI 분석 중 (analyzing)  → ③ 결과 준비 중 (redirecting)
```
- 각 단계를 스피너/체크/비활성 아이콘으로 구분하는 `LoadingSteps` 컴포넌트 추가
- 현재 단계의 sub 텍스트만 표시해 불필요한 정보를 줄임

### UploadSection — 30초 타임아웃
`AbortController`로 fetch에 30초 타임아웃 적용:
- 초과 시 `ERROR_MESSAGES.TIMEOUT` 메시지 표시 ("분석 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.")
- `DOMException.name === "AbortError"` 감지로 타임아웃 vs 네트워크 오류 구분

### UploadSection — 에러 메시지 개선
서버 에러 코드(`err.error`)를 `ERROR_MESSAGES` 맵으로 직접 매핑:
- `NOT_REGISTRATION`, `SCANNED_PDF`, `API_ERROR`, `RATE_LIMIT`, `TIMEOUT` 각각 다른 메시지

### analyze/page.tsx — 결과 공유 기능
`ShareButton` 컴포넌트 추가:
- `navigator.share` 지원 시 → 네이티브 공유 시트 (모바일)
- 미지원 시 → 클립보드에 텍스트 복사 + "복사됨" 피드백 (2초)
- 공유 텍스트: 점수 / 신호등 레이블 / 주소 / 종합 의견 / 서비스 URL

---

## 2-5 상세: 법적 요구사항 구현

### /privacy 페이지 확장
6개 섹션으로 확장:
1. 수집하는 개인정보 (없음, 서버 접속 로그만)
2. PDF 파일 처리 방식 (클라이언트에서만 변환, 텍스트만 전송)
3. AI 분석 서비스 (**Google Gemini API 사용 명시**, 모델 학습 미사용 고지)
4. 분석 결과 저장 (sessionStorage, 탭 닫으면 삭제)
5. 쿠키 및 트래킹 (없음)
6. 문의처

### ConsentModal (2-3에서 완성)
- 스크롤 가능한 면책 조항 전문
- 개인정보 안내 (🔒 PDF는 내 기기에서만)
- 필수 체크박스 동의 플로우

### DisclaimerBanner (2-3에서 완성)
- 결과 페이지 하단 상시 표시

---

## 2-6 상세: 전문가 연결 CTA

### ExpertCTA 개선
| 항목 | 내용 |
|------|------|
| UTM 파라미터 | `utm_source=tenseccheck&utm_medium=cta&utm_campaign={red\|yellow\|green}-result` |
| 빨간불 강조 | `ring-2 ring-red-300` 링 추가로 카드 시각적 강조 |
| 환경변수 폴백 | `KAKAO_CHANNEL`/`EXPERT_EMAIL` 미설정 시 대법원 상담 서비스 안내 문구 표시 |
| 버튼 변형 | red: 빨간 버튼 / yellow: 앰버 버튼 / green: 그린 버튼 + 각각 hover 색상 |

---

## 2-7 상세: 반응형 디자인

### 적용 기준
| 브레이크포인트 | 적용 내용 |
|--------------|-----------|
| 375px (기본) | 트러스트 뱃지 텍스트 `text-[10px]`, 카드 패딩 `p-2.5` |
| sm (640px+) | 뱃지 `text-xs`, 패딩 `p-3`, 히어로 타이틀 `text-3xl`, "이용 방법" 3단계 표시 |

### 주요 변경
- **랜딩 페이지**: 히어로 텍스트 `sm:text-3xl`, 배지 패딩 `sm:p-3`, 데스크탑에서 "이용 방법 3단계" 표시
- **Header**: `flex-shrink-0` + `min-w-0` 추가로 좁은 화면에서 텍스트 잘림 방지, `whitespace-nowrap`
- **결과 페이지 Score Card**: `gap-4 sm:gap-6`, `min-w-0` 추가로 375px에서 레이아웃 보호
- **드래그앤드롭**: 모바일에서 탭하여 선택하는 방식은 기존 hidden `input[type=file]` click으로 완전 지원

---

## 발견된 이슈 및 해결

| 이슈 | 해결 |
|------|------|
| `navigator.share`가 서버 렌더링 중 존재하지 않음 | `typeof navigator !== "undefined"` 가드 추가 |
| ExpertCTA env var 없을 때 버튼 영역 공백 | 폴백 안내 카드 추가 |
| 빨간불 CTA가 시각적으로 구분 안 됨 | `ring-2 ring-red-300` Tailwind 링 효과 추가 |

---

## 최종 파일 구조

```
src/
├── app/
│   ├── page.tsx               ← 반응형 + 이용 방법 3단계 (sm:)
│   ├── analyze/page.tsx       ← 공유 버튼 + sm: gap 조정
│   └── privacy/page.tsx       ← 6개 섹션 확장 (Google Gemini 고지)
├── components/
│   ├── layout/
│   │   └── Header.tsx         ← flex-shrink-0, whitespace-nowrap
│   ├── upload/
│   │   └── UploadSection.tsx  ← 3단계 로딩, 30초 타임아웃, 에러 매핑
│   └── analysis/
│       └── ExpertCTA.tsx      ← 폴백, 빨간불 ring 강조, UTM
```

---

## Phase 3 시작 전 필요 사항

1. `.env.local`에 `GEMINI_API_KEY` 설정 → 실제 등기부등본으로 E2E 테스트
2. `NEXT_PUBLIC_KAKAO_CHANNEL` / `NEXT_PUBLIC_EXPERT_EMAIL` 설정 (전문가 연결 CTA)
3. 실제 375px 기기(또는 Chrome DevTools)에서 UI 흐름 확인

## 다음 단계 (Phase 3)

1. **SEO**: 메타태그, sitemap.xml, robots.txt, OG 이미지
2. **성능**: Gemini 스트리밍 응답, Lighthouse 90+
3. **배포**: Vercel 배포, Rate Limiting (IP당 5회/일)
4. **모니터링**: Vercel Analytics, API 비용 알림
5. **최종 QA**: 실제 등기부등본 5종 + 엣지 케이스 테스트
