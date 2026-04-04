import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// /api/analyze 요청에만 Rate Limiting 적용
export const config = {
  matcher: "/api/analyze",
};

export async function proxy(request: NextRequest) {
  // Upstash 환경변수 미설정 시 Rate Limiting 비활성화 (로컬 개발 환경 대응)
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return NextResponse.next();
  }

  const { Redis } = await import("@upstash/redis");
  const { Ratelimit } = await import("@upstash/ratelimit");

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 d"), // 10회/일, 슬라이딩 윈도우
    prefix: "tensec:rl",
  });

  // Vercel은 x-forwarded-for 헤더에 실제 클라이언트 IP를 주입
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "anonymous";

  const { success, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return Response.json(
      {
        error: "RATE_LIMIT",
        message:
          "오늘 분석 한도(10회)를 초과했습니다. 내일 다시 이용해 주세요.",
      },
      { status: 429 }
    );
  }

  // 남은 횟수를 응답 헤더에 포함 (디버깅용)
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  return response;
}
