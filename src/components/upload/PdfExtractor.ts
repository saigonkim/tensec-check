"use client";

// pdfjs-dist는 클라이언트(브라우저)에서만 실행됩니다.
// PDF 파일은 서버로 전송되지 않고 브라우저 내에서 텍스트로 변환됩니다.

let pdfjsLib: typeof import("pdfjs-dist") | null = null;

async function getPdfjs() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
  return pdfjsLib;
}

export class PdfExtractError extends Error {
  constructor(
    public code: "SCANNED_PDF" | "INVALID_FILE" | "EXTRACTION_FAILED",
    message: string
  ) {
    super(message);
    this.name = "PdfExtractError";
  }
}

export async function extractTextFromPdf(file: File): Promise<string> {
  if (file.type !== "application/pdf") {
    throw new PdfExtractError("INVALID_FILE", "PDF 파일만 업로드할 수 있습니다.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new PdfExtractError("INVALID_FILE", "파일 크기는 10MB 이하여야 합니다.");
  }

  const pdfjs = await getPdfjs();
  const arrayBuffer = await file.arrayBuffer();

  let pdf: Awaited<ReturnType<typeof pdfjs.getDocument>["promise"]>;
  try {
    pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  } catch {
    throw new PdfExtractError("INVALID_FILE", "PDF 파일을 읽을 수 없습니다.");
  }

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    fullText += pageText + "\n";
  }

  const text = fullText.trim();

  if (text.length < 100) {
    throw new PdfExtractError(
      "SCANNED_PDF",
      "스캔된 이미지 형태의 PDF는 분석할 수 없습니다.\n대법원 인터넷등기소(iros.go.kr)에서 발급한 텍스트 형태의 등기부등본을 업로드해 주세요."
    );
  }

  return text;
}
