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
          background: "linear-gradient(135deg, #1b3a6b 0%, #2e5ba8 100%)",
          padding: "60px",
        }}
      >
        {/* Shield icon (SVG inline) */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          style={{ marginBottom: "28px" }}
        >
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            fill="white"
            opacity="0.9"
          />
          <path
            d="M9 12l2 2 4-4"
            stroke="#1b3a6b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Service name */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: "800",
            color: "white",
            letterSpacing: "-1px",
            marginBottom: "16px",
          }}
        >
          TenSec Check
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.85)",
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          AI Property Registry Analyzer
        </div>

        {/* Divider */}
        <div
          style={{
            width: "60px",
            height: "3px",
            background: "rgba(255,255,255,0.4)",
            borderRadius: "2px",
            marginBottom: "28px",
          }}
        />

        {/* Feature badges */}
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          {["Free", "No Sign-up", "10 Seconds"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "100px",
                padding: "8px 20px",
                color: "white",
                fontSize: "18px",
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
            bottom: "40px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          tensec.kr
        </div>
      </div>
    ),
    { ...size }
  );
}
