import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TenSec Check — 등기부등본 10초 해독기";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #001838 0%, #002452 100%)",
          padding: "60px",
        }}
      >
        {/* Shield icon (SVG inline) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "96px",
            height: "96px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "24px",
            marginBottom: "32px",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Service name */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "900",
            color: "white",
            letterSpacing: "-1.5px",
            marginBottom: "12px",
          }}
        >
          TenSec Check
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            color: "rgba(255,255,255,0.8)",
            fontWeight: "500",
            letterSpacing: "-0.5px",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          등기부등본 10초 해독기
        </div>

        {/* Feature badges */}
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          {["기기 내 처리 보장", "회원가입 없음", "평균 10초 분석"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: "16px",
                padding: "10px 24px",
                color: "white",
                fontSize: "20px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            fontSize: "20px",
            fontWeight: "500",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "1px",
          }}
        >
          tensec.kr
        </div>
      </div>
    ),
    { ...size }
  );
}
