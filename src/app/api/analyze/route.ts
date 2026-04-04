export const runtime = "edge";

import { GoogleGenerativeAI, FunctionCallingMode } from "@google/generative-ai";
import { EXTRACT_RISK_FACTORS, buildSystemPrompt, buildUserPrompt } from "@/lib/ai/prompts";
import { extractAnalysisResult } from "@/lib/analysis/extractor";
import type { AnalyzeRequest, ErrorResponse } from "@/types/api";

export async function POST(request: Request) {
  let body: AnalyzeRequest;
  try {
    body = await request.json();
  } catch {
    return errorResponse("INVALID_TEXT", "요청 형식이 올바르지 않습니다.", 400);
  }

  const { text, propertyPrice, consent } = body;

  if (!consent) {
    return errorResponse("INVALID_TEXT", "서비스 이용 동의가 필요합니다.", 400);
  }

  if (!text || text.trim().length < 100) {
    return errorResponse(
      "INVALID_TEXT",
      "텍스트가 너무 짧습니다. 등기부등본 PDF를 다시 확인해 주세요.",
      400
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return errorResponse("API_ERROR", "서비스 설정 오류가 발생했습니다.", 500);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: buildSystemPrompt(),
    tools: [{ functionDeclarations: [EXTRACT_RISK_FACTORS as any] }],
    toolConfig: { functionCallingConfig: { mode: FunctionCallingMode.ANY } },
  });

  // generateContentStream: Edge Runtime에서 청크 수신으로 연결 유지
  // Function Calling 응답은 스트림 완료 후 stream.response로 취합
  let geminiResponse;
  try {
    const stream = await model.generateContentStream(buildUserPrompt(text, propertyPrice));
    geminiResponse = await stream.response;
  } catch (err) {
    console.error("Gemini API error:", err);
    return errorResponse(
      "API_ERROR",
      "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      500
    );
  }

  const functionCall = geminiResponse.functionCalls()?.[0];
  if (!functionCall || functionCall.name !== "extract_risk_factors") {
    return errorResponse(
      "API_ERROR",
      "분석 결과를 생성하지 못했습니다. 다시 시도해 주세요.",
      500
    );
  }

  const raw = functionCall.args as any;

  if (!raw.isRegistrationDocument) {
    return errorResponse(
      "NOT_REGISTRATION",
      "업로드한 문서가 등기부등본이 아닌 것 같습니다. 부동산 등기사항전부증명서를 업로드해 주세요.",
      422
    );
  }

  return Response.json(extractAnalysisResult(raw, propertyPrice));
}

function errorResponse(
  code: ErrorResponse["error"],
  message: string,
  status: number
) {
  const body: ErrorResponse = { error: code, message };
  return Response.json(body, { status });
}
