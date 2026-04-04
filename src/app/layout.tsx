import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://tensec-check.vercel.app";
const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#154c8a",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "TenSec Check — 등기부등본 10초 해독기",
    template: "%s — TenSec Check",
  },
  description:
    "전세 계약 전 등기부등본을 AI로 분석하세요. 근저당권·압류·가압류 등 위험 항목을 10초 만에 확인하고 0~100점 안전 점수를 받아보세요. 앱 설치 없이 무료로 이용 가능합니다.",
  keywords: [
    "전세 사기 확인",
    "등기부등본 분석",
    "근저당 위험 확인",
    "전세 안전 점수",
    "등기부 AI 분석",
    "전세 사기 예방",
    "부동산 등기 분석",
    "등기사항전부증명서",
  ],
  authors: [{ name: "TenSec Check" }],
  creator: "TenSec Check",
  openGraph: {
    title: "TenSec Check — 등기부등본 10초 해독기",
    description:
      "전세 계약 전 등기부등본을 AI로 분석하세요. 위험 항목을 10초 만에 확인하고 안전 점수를 받아보세요.",
    url: BASE_URL,
    siteName: "TenSec Check",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TenSec Check — 등기부등본 10초 해독기",
    description: "전세 계약 전 AI가 등기부등본 위험 항목을 분석해 드립니다.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        {/* Pretendard CDN preconnect — font 로딩 속도 개선 */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
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
    </html>
  );
}
