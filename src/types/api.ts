import type { RiskReport } from "./analysis";

export interface AnalyzeRequest {
  text: string; // 클라이언트에서 추출한 등기부등본 텍스트
  propertyPrice?: number; // 부동산 시세 (원, 선택 — 근저당 비율 계산용)
  consent: true; // 면책 동의 (필수)
}

export type AnalyzeResponse = RiskReport & {
  disclaimer: string;
};

export type AnalyzeErrorCode =
  | "SCANNED_PDF"
  | "INVALID_TEXT"
  | "NOT_REGISTRATION"
  | "API_ERROR"
  | "RATE_LIMIT"
  | "TIMEOUT";

export interface ErrorResponse {
  error: AnalyzeErrorCode;
  message: string; // 사용자 친화적 한국어 메시지
}
