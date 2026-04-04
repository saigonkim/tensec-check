"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import ConsentModal from "@/components/legal/ConsentModal";
import { extractTextFromPdf, PdfExtractError } from "./PdfExtractor";
import { ERROR_MESSAGES } from "@/types/document";
import type { AnalyzeRequest, AnalyzeResponse, ErrorResponse } from "@/types/api";

type UploadStatus =
  | "idle"
  | "consent"
  | "extracting"
  | "analyzing"
  | "redirecting"
  | "error";

type UploadState =
  | { status: "idle" }
  | { status: "consent"; file: File }
  | { status: "extracting"; file: File }
  | { status: "analyzing" }
  | { status: "redirecting" }
  | { status: "error"; message: string };

const STEPS: { status: UploadStatus; label: string; sub: string }[] = [
  {
    status: "extracting",
    label: "파일 읽는 중",
    sub: "PDF를 내 기기에서 안전하게 처리합니다",
  },
  {
    status: "analyzing",
    label: "AI 분석 중",
    sub: "등기부등본을 분석하고 있습니다 (10~30초)",
  },
  {
    status: "redirecting",
    label: "결과 준비 중",
    sub: "곧 결과 페이지로 이동합니다",
  },
];

const STEP_ORDER: UploadStatus[] = ["extracting", "analyzing", "redirecting"];

function LoadingSteps({ current }: { current: UploadStatus }) {
  const currentIdx = STEP_ORDER.indexOf(current);

  return (
    <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;

        return (
          <div key={step.status} className="flex items-center gap-3">
            {/* Step indicator */}
            <div className="flex-shrink-0 relative">
              {done ? (
                <CheckCircle2 className="w-5 h-5 text-[var(--color-green)]" />
              ) : active ? (
                <div className="w-5 h-5 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
              )}
            </div>
            {/* Step text */}
            <div>
              <p
                className={`text-sm font-medium leading-tight ${
                  active
                    ? "text-[var(--color-text-primary)]"
                    : done
                    ? "text-[var(--color-green)]"
                    : "text-gray-300"
                }`}
              >
                {step.label}
              </p>
              {active && (
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  {step.sub}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function UploadSection() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file.type !== "application/pdf") {
      setState({ status: "error", message: "PDF 파일만 업로드할 수 있습니다." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setState({ status: "error", message: "파일 크기는 10MB 이하여야 합니다." });
      return;
    }
    setState({ status: "consent", file });
  }, []);

  const handleConsent = useCallback(async () => {
    if (state.status !== "consent") return;
    const file = state.file;

    // Step 1: 클라이언트에서 PDF 텍스트 추출
    setState({ status: "extracting", file });
    let text: string;
    try {
      text = await extractTextFromPdf(file);
    } catch (err) {
      const message =
        err instanceof PdfExtractError
          ? err.message
          : "PDF 파일을 읽는 중 오류가 발생했습니다.";
      setState({ status: "error", message });
      return;
    }

    // Step 2: Edge API로 텍스트 전송 (30초 타임아웃)
    setState({ status: "analyzing" });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const body: AnalyzeRequest = { text, consent: true };
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const err: ErrorResponse = await res.json();
        const message =
          ERROR_MESSAGES[err.error] ?? err.message ?? "알 수 없는 오류가 발생했습니다.";
        setState({ status: "error", message });
        return;
      }

      // Step 3: 결과 저장 후 이동
      setState({ status: "redirecting" });
      const result: AnalyzeResponse = await res.json();
      sessionStorage.setItem("tensec_result", JSON.stringify(result));
      router.push("/analyze");
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof DOMException && err.name === "AbortError") {
        setState({ status: "error", message: ERROR_MESSAGES.TIMEOUT });
      } else {
        setState({
          status: "error",
          message: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        });
      }
    }
  }, [state, router]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);

  const isLoading =
    state.status === "extracting" ||
    state.status === "analyzing" ||
    state.status === "redirecting";

  return (
    <>
      {state.status === "consent" && (
        <ConsentModal
          onConsent={handleConsent}
          onClose={() => setState({ status: "idle" })}
        />
      )}

      {/* Drop Zone */}
      <div
        role="button"
        tabIndex={isLoading ? -1 : 0}
        aria-label="등기부등본 PDF 업로드. 클릭하거나 파일을 여기에 드래그하세요."
        aria-busy={isLoading}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (!isLoading && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`
          relative bg-white border-2 border-dashed rounded-2xl p-8 text-center
          transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
          ${isLoading ? "cursor-default opacity-90" : "cursor-pointer"}
          ${
            isDragging
              ? "border-[var(--color-primary)] bg-blue-50"
              : "border-gray-200 hover:border-[var(--color-primary-light)] hover:bg-gray-50"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
          disabled={isLoading}
        />

        {isLoading ? (
          <LoadingSteps current={state.status as UploadStatus} />
        ) : (
          <div className="flex flex-col items-center gap-3">
            {isDragging ? (
              <FileText className="w-10 h-10 text-[var(--color-primary)]" />
            ) : (
              <Upload className="w-10 h-10 text-gray-300" />
            )}
            <div>
              <p className="font-semibold text-[var(--color-text-primary)]">
                {isDragging ? "여기에 놓으세요" : "등기부등본 PDF를 업로드하세요"}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                드래그 앤 드롭 또는 클릭하여 선택
              </p>
              <p className="text-xs text-gray-400 mt-2">PDF 파일만 · 최대 10MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {state.status === "error" && (
        <div className="mt-4 flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl p-4">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700 whitespace-pre-line">{state.message}</p>
            <button
              onClick={() => setState({ status: "idle" })}
              className="text-xs text-red-500 underline mt-1.5"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}
    </>
  );
}
