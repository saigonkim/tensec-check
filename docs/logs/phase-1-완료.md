# Phase 1 완료 로그

**완료일**: 2026-04-04
**작업자**: Claude Code

---

## 완료된 항목

- [x] 1-1. 프로젝트 초기화 — Next.js 16.2.2, TypeScript, Tailwind 4, App Router
- [x] 1-2. 도메인 타입 정의 — `analysis.ts`, `api.ts`, `document.ts`
- [x] 1-3. 랜딩 페이지 — `page.tsx`, `layout.tsx`, `globals.css`, `Header`, `Footer`
- [x] 1-4. 클라이언트 PDF 추출 — `PdfExtractor.ts` (pdfjs-dist), `UploadSection.tsx`, `ConsentModal.tsx`
- [x] 1-5. Edge Runtime API Route — `/api/analyze/route.ts` (`export const runtime = "edge"`)
- [x] 1-6. Gemini 프롬프트 — `prompts.ts` (Function Declaration + 점수 계산 로직)
- [x] 1-7. 결과 페이지 — `/analyze/page.tsx` (신호등, 점수, 위험 항목, 체크리스트)
- [x] 부가: `/privacy/page.tsx`, `/api/health/route.ts`

---

## 주요 결정 사항

### Next.js 16 + Turbopack 대응
- Next.js 16은 Turbopack이 기본 번들러
- `webpack` config → `turbopack.resolveAlias`로 마이그레이션
- `canvas` 모듈을 빈 스텁(`src/lib/empty-module.ts`)으로 대체

### 클라이언트 PDF 추출 아키텍처 확정
- `pdfjs-dist`의 Worker를 CDN에서 로드 (번들 크기 최적화)
- PDF 파일 자체는 서버로 전송되지 않음 → "PDF는 내 기기에서만" 배지 사용
- 스캔본 감지: 추출 텍스트 < 100자 → 즉시 클라이언트 에러 표시

### Edge Runtime Gemini 호출
- `FunctionCallingMode.ANY`로 Function Calling 강제
- `gemini-2.0-flash` 모델 사용 (속도 우선)
- 점수 계산은 `calculateSafetyScore()` TypeScript 함수로 분리

---

## 발견된 이슈 및 해결

| 이슈 | 해결 |
|------|------|
| `create-next-app`이 기존 `.agent` 폴더로 설치 거부 | temp-init으로 초기화 후 파일 이동 |
| `next/dist/compiled/comment-json` 모듈 누락 | `node_modules` 완전 재설치 |
| Next.js 16 Turbopack webpack config 충돌 | `turbopack.resolveAlias`로 변경 |
| CSS `@import` 순서 경고 | Pretendard CDN import를 `@import tailwindcss` 앞으로 이동 |
| `FunctionCallingMode` 타입 에러 | SDK에서 직접 import |

---

## 현재 파일 구조

```
src/
├── app/
│   ├── layout.tsx, page.tsx, globals.css
│   ├── analyze/page.tsx
│   ├── privacy/page.tsx
│   └── api/
│       ├── analyze/route.ts   ← Edge Runtime
│       └── health/route.ts    ← Edge Runtime
├── components/
│   ├── layout/Header.tsx, Footer.tsx
│   ├── upload/PdfExtractor.ts, UploadSection.tsx
│   └── legal/ConsentModal.tsx
├── lib/
│   ├── ai/prompts.ts
│   └── empty-module.ts
└── types/
    ├── analysis.ts, api.ts, document.ts
```

---

## Phase 2 시작 전 필요 사항

1. **GEMINI_API_KEY 발급**: Google AI Studio에서 발급 후 `.env.local`에 설정
2. **실제 등기부등본 PDF로 테스트**: 대법원 인터넷등기소에서 텍스트형 PDF 발급
3. **`npm run dev`로 로컬 확인**: `localhost:3000`에서 업로드 플로우 검증

## 다음 단계 (Phase 2 우선 태스크)

1. `extractor.ts` — Gemini 응답의 세부 파싱 및 RiskItem ID 생성 개선
2. `ScoreGauge`, `TrafficLight` 시각적 컴포넌트 완성
3. `ConsentModal` 전문 면책 조항 + 스크롤 영역 완성
4. 로딩 단계 표시 UI (3단계 프로그레스)
5. 반응형 디자인 375px 기준 점검
