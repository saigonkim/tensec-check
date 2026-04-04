# Phase 3-5 완료 로그

**작성일**: 2026-04-05
**작업자**: Claude Code + 사용자
**상태**: 완료

---

## 완료 항목

- [x] Vercel Analytics 활성화 (`@vercel/analytics`)
- [x] Vercel Speed Insights 활성화 (`@vercel/speed-insights`)
- [x] Gemini API 비용 한도 설정 (Google AI Studio — 사용자 직접 설정)
- [x] 에러 로깅: Vercel 기본 로그 사용 (Sentry 미사용)

---

## 상세 내용

### Vercel Analytics + Speed Insights (`layout.tsx`)

```tsx
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// body 내부에 삽입
<Analytics />
<SpeedInsights />
```

- Hobby 플랜 기본 포함 — 별도 대시보드 설정 불필요
- **Analytics**: 페이지뷰, 방문자 수, 유입 경로 등 트래픽 데이터
- **Speed Insights**: LCP, FID, CLS 등 Core Web Vitals 실사용자 측정(RUM)
- Vercel 대시보드 → Analytics / Speed Insights 탭에서 확인 가능

### Gemini API 비용 관리

- Google AI Studio에서 지출 한도(Spending Limit) 직접 설정 완료
- 추가 코드 작업 불필요

### 에러 로깅

- Vercel 대시보드 → Logs 탭에서 Edge Function 실행 로그 확인
- `console.error` 출력이 Vercel 로그에 자동 수집됨 (Sentry 미사용)

---

## UI/UX 개선 (Gemini 협업, Phase 3.5)

별도 로그 파일: `docs/logs/ui-improvement.md` 참조

주요 변경 사항:
- Corporate Blue (`#154C8A`) 기반 디자인 시스템 재구축
- No-Line Rule: Border → Shadow + Tonal Layering
- 모바일 '이용 방법' 섹션 노출 개선
- OG 이미지: CJK 폰트 문제로 영문 전환 + canonical URL 고정

---

## 다음 단계 (3-6 최종 QA)

- [ ] 실제 등기부등본 PDF 5종 이상 업로드 테스트
- [ ] 엣지 케이스: 스캔본 / 암호화 / 등기부등본 아닌 PDF
- [ ] 모바일 실기기 테스트 (iOS Safari, Android Chrome)
- [ ] Lighthouse 실측 (Performance / Accessibility / SEO / Best Practices)
- [ ] Rate Limiting 동작 확인 (11회째 요청 시 429 응답)
