# Phase 3-3 완료 로그

**작성일**: 2026-04-04
**작업자**: Claude Code
**상태**: 3-3 부분 완료 (GA4 연동 완료 / 파트너 연결·CTA 클릭 추적은 추후 진행)

---

## 완료 항목

- [x] GA4 스크립트 연동 (`layout.tsx`)
- [x] `.env.example` 업데이트 (GA4 ID, API 키 플레이스홀더 재확인)

## 추후 진행 항목

- [ ] 파트너 공인중개사/법무사 연결 로직 설계
- [ ] CTA 클릭 추적 이벤트 설정 (로컬호스트 화면 확인 후)

---

## 3-3 상세: GA4 연동

### layout.tsx — `next/script` 사용

```tsx
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;

// RootLayout 내부:
{GA_ID && (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      strategy="afterInteractive"
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
    </Script>
  </>
)}
```

**설계 포인트**:
- `strategy="afterInteractive"`: 페이지 hydration 후 로드 → LCP 등 Core Web Vitals 영향 최소화
- `GA_ID` 없으면 스크립트 자체 미삽입 → 로컬 개발 환경에서는 GA 비활성화
- App Router Server Component에서 직접 사용 가능 (`"use client"` 불필요 — `onLoad` 핸들러 미사용)
- `inline <Script>` 에는 `id="google-analytics"` 필수 (Next.js 최적화 추적용)

### .env.example 업데이트

```
GEMINI_API_KEY=your_gemini_api_key_here   ← 실제 키 → 플레이스홀더로 재교체
NEXT_PUBLIC_GA4_ID=                        ← 신규 (G-XXXXXXXXXX 형식)
```

### 적용 방법 (배포 시)

1. Google Analytics 콘솔 → 관리 → 데이터 스트림 → 측정 ID 복사 (`G-XXXXXXXXXX`)
2. Vercel 환경변수에 `NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX` 추가
3. 재배포 → GA 실시간 보기에서 pageview 확인

---

## 빌드 결과

TypeScript 오류 0건, 빌드 클린.
