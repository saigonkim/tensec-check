# Phase 3 진행 로그 (3-1, 3-2 완료)

**작성일**: 2026-04-04
**작업자**: Claude Code
**상태**: 진행 중 (3-1, 3-2 완료 / 3-3 ~ 3-6 미완료)

---

## 완료된 항목

- [x] 3-1. SEO 최적화
- [x] 3-2. 성능 최적화

---

## 3-1 상세: SEO 최적화

### layout.tsx — 전체 메타데이터 완성

| 추가 항목 | 내용 |
|----------|------|
| `metadataBase` | `NEXT_PUBLIC_BASE_URL` env var (기본값: `https://tensec.kr`) |
| `title.template` | `"%s — TenSec Check"` — 하위 페이지 제목 자동 suffix |
| `description` | 80자 키워드 포함 설명 |
| `keywords` | "전세 사기 확인", "등기부등본 분석", "근저당 위험 확인" 등 8개 |
| `openGraph` | `locale: "ko_KR"`, `type: "website"`, url, siteName |
| `twitter` | `card: "summary_large_image"` |
| `robots` | `index: true`, `follow: true` |
| `alternates.canonical` | 기본 canonical URL |
| `viewport` | `themeColor: "#1b3a6b"` (모바일 주소창 브랜드 색상) |

### app/sitemap.ts — 자동 sitemap.xml
- `NEXT_PUBLIC_BASE_URL` 기반 URL
- `/` (changeFrequency: weekly, priority: 1.0)
- `/privacy` (changeFrequency: monthly, priority: 0.4)
- `/api/*`, `/analyze` 제외 (개인 결과 페이지는 크롤링 불필요)

### app/robots.ts — robots.txt
- 전체 허용 (`allow: "/"`)
- `/api/`, `/analyze` 차단 (API 엔드포인트 + 개인 결과)
- sitemap URL 포함

### app/opengraph-image.tsx — 동적 OG 이미지
- `next/og`의 `ImageResponse` 사용 (Edge Runtime)
- 1200×630px, navy gradient 배경
- 서비스명 "TenSec Check" + "AI Property Registry Analyzer"
- "Free · No Sign-up · 10 Seconds" 배지 3개
- 한국어 폰트 의존성 없이 영문으로 구성 (소셜 플랫폼 범용 호환)

### .env.example 업데이트
- `GEMINI_API_KEY` 플레이스홀더로 교체 (기존에 API 키처럼 보이는 값이 있었음 — 보안 위험 제거)
- `NEXT_PUBLIC_BASE_URL` 항목 추가

---

## 3-2 상세: 성능 최적화

### layout.tsx — preconnect
```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" />
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
```
Pretendard 폰트 CDN 연결을 페이지 로드 초기에 시작 → TTFB 개선

### app/analyze/loading.tsx — 로딩 스켈레톤
- analyze 페이지 진입 시 즉시 표시되는 pulse skeleton
- Score Card / CTA / Summary / Risk Items 레이아웃 모양 유지
- CLS(Cumulative Layout Shift) 방지 — 실제 콘텐츠와 동일한 공간 예약

### UploadSection.tsx — 접근성 (Lighthouse Accessibility)
- 드롭존 div에 `role="button"`, `tabIndex={0}` 추가 → 키보드 접근 가능
- `aria-label`: "등기부등본 PDF 업로드. 클릭하거나 파일을 여기에 드래그하세요."
- `aria-busy={isLoading}` — 스크린 리더에 로딩 상태 전달
- `onKeyDown` — Enter/Space 키로 파일 선택 가능
- `focus-visible:ring-2` — 키보드 포커스 시 시각적 표시

### app/api/analyze/route.ts — Gemini 스트리밍
```typescript
// 변경 전
geminiResult = await model.generateContent(prompt);

// 변경 후
const stream = await model.generateContentStream(prompt);
geminiResponse = await stream.response;
```

**이유**: Edge Runtime은 응답 없이 대기 시 타임아웃이 발생. `generateContentStream`으로 Gemini에서 청크를 받으며 연결을 유지하면 타임아웃 위험이 줄어듦.

**참고**: Function Calling 응답은 스트림 완료 후에만 취합되므로 클라이언트에는 여전히 최종 JSON이 한 번에 전달됨. 체감 속도 개선은 아니지만 Edge 25초 제한 내 안정성이 향상됨.

---

## 빌드 결과

```
Route (app)
┌ ○ /                    (Static)
├ ○ /analyze             (Static)
├ ƒ /api/analyze         (Edge Dynamic)
├ ƒ /api/health          (Edge Dynamic)
├ ƒ /opengraph-image     (Edge Dynamic)  ← 신규
├ ○ /privacy             (Static)
├ ○ /robots.txt          (Static)        ← 신규
└ ○ /sitemap.xml         (Static)        ← 신규
```

TypeScript 오류 0건, 빌드 클린.

---

## Lighthouse 90+ 달성을 위한 잔여 체크리스트

(배포 후 실제 Lighthouse 측정이 필요한 항목들)

- [ ] 실제 Lighthouse 측정 (Performance / Accessibility / SEO / Best Practices)
- [ ] 색상 대비 확인 (텍스트 색 `#64748b`가 AA 기준 충족 여부)
- [ ] 히어로 h1 이후 h2 계층 구조 일관성 확인
- [ ] GA4 스크립트 추가 시 `next/script strategy="afterInteractive"` 사용 필수

---

## 미완료 항목 (이후 작업)

- [ ] 3-3. 수익화 인프라 (GA4 연동, CTA 클릭 추적, A/B 설계)
- [ ] 3-4. 배포 & 인프라 (Vercel 배포, Rate Limiting, 도메인)
- [ ] 3-5. 모니터링 (Vercel Analytics, Gemini API 비용 알림)
- [ ] 3-6. 최종 QA (실제 등기부등본 5종 테스트)
