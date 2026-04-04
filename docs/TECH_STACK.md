# TenSec Check — 기술 스택 & 아키텍처

**Version**: 1.1 | **Last Updated**: 2026-04-04
**변경 이력**: v1.1 — Vercel Hobby 호환 아키텍처로 전환 (클라이언트 PDF 추출 + Edge Runtime)

---

## 1. 기술 스택 요약

| 영역 | 선택 | 비고 |
|------|------|------|
| **Framework** | Next.js 14 App Router | — |
| **Language** | TypeScript | 5+ |
| **Styling** | Tailwind CSS | 3+ |
| **AI API** | Google Gemini | gemini-2.0-flash (속도 우선) |
| **Gemini SDK** | @google/generative-ai | Edge Runtime 호환 (fetch 기반) |
| **PDF 파싱** | pdfjs-dist | **클라이언트 사이드** (브라우저에서 실행) |
| **API Runtime** | **Vercel Edge Runtime** | 25초 제한, Node.js 불필요 |
| **배포** | **Vercel Hobby** | 무료 플랜으로 MVP 검증 |
| **아이콘** | Lucide React | — |
| **Analytics** | Vercel Analytics | 무료 포함 |

> **Vercel Pro 업그레이드 시점**: MVP 검증 후 일 분석 횟수 급증 또는 Gemini 응답이 25초 초과하는 패턴 확인 시

---

## 2. 핵심 아키텍처 결정: Hobby 플랜 호환 전략

### 왜 이 조합인가?

**문제**: Vercel Hobby의 서버리스 함수 타임아웃 10초 — Gemini 응답(5-15초) + PDF 파싱을 서버에서 하면 초과 확실

**해결**: 작업을 두 단계로 분리

| 단계 | 실행 환경 | 작업 | 타임아웃 |
|------|----------|------|---------|
| 1단계 | 브라우저 (클라이언트) | PDF → 텍스트 추출 (pdfjs-dist) | 제한 없음 |
| 2단계 | Vercel Edge Runtime | 텍스트 → Gemini 분석 → JSON 반환 | 25초 |

**추가 이점**:
- PDF 파일이 서버로 전송되지 않음 → **개인정보 보호 강화** (설명문에 "PDF는 내 기기에서만 읽힙니다" 표시 가능)
- 서버 업로드 대역폭 절감 (PDF 대신 텍스트만 전송, 평균 5-50KB)
- gemini-2.0-flash 평균 응답 3-8초 → 25초 이내 충분히 완료

### Edge Runtime 제약 사항

Edge Runtime은 Node.js API를 사용할 수 없음. 이로 인한 제약:
- `pdf-parse` 사용 불가 (`Buffer`, `fs` 의존) → 클라이언트 pdfjs-dist로 대체
- `@google/generative-ai` SDK는 **내부적으로 fetch 사용** → Edge Runtime 호환 ✅
- Node.js `Buffer` 대신 Web API `Uint8Array`, `TextEncoder` 사용

---

## 3. 기술 결정 상세

### 3.1 PDF 파싱: pdfjs-dist (클라이언트)

**변경 이유**: `pdf-parse`는 Node.js 전용 → Edge Runtime 실행 불가

**pdfjs-dist 특징**:
- Mozilla Firefox 팀이 개발한 공식 PDF.js 라이브러리
- 순수 JavaScript, 브라우저에서 완전 실행
- 대법원 인터넷등기소 텍스트 PDF 지원

**Next.js 설정 (Worker 주의사항)**:
```typescript
// src/components/upload/PdfExtractor.ts (클라이언트 전용)
"use client";
import * as pdfjsLib from "pdfjs-dist";

// Worker를 CDN에서 로드 (bundle 크기 최적화)
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
  }

  if (fullText.trim().length < 100) {
    throw new Error("SCANNED_PDF");
  }

  return fullText;
}
```

**next.config.ts 설정**:
```typescript
// pdfjs-dist canvas 의존성 처리
const nextConfig = {
  webpack: (config: any) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};
```

**스캔본 PDF 처리**: 텍스트 추출 결과 100자 미만 → 클라이언트에서 즉시 오류 표시 (서버 요청 불필요)

### 3.2 AI: Google Gemini (gemini-2.0-flash 우선)

**모델 선택 기준**:
- `gemini-2.0-flash`: 평균 응답 3-8초, 비용 저렴 → **MVP 기본값**
- `gemini-1.5-pro`: 더 정확, 5-15초 → Pro 플랜 전환 후 고려

**Edge Runtime에서의 Gemini 호출**:
```typescript
// src/app/api/analyze/route.ts
export const runtime = "edge";  // Edge Runtime 선언

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  const { text, propertyPrice } = await request.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    tools: [{ functionDeclarations: [EXTRACT_RISK_FACTORS] }],
  });

  const result = await model.generateContent(buildPrompt(text, propertyPrice));
  const call = result.response.functionCalls()?.[0];

  if (!call) {
    return Response.json({ error: "AI_ERROR", message: "분석 결과를 생성하지 못했습니다." }, { status: 500 });
  }

  const rawReport = call.args as RawGeminiReport;
  const report = buildRiskReport(rawReport);  // extractor.ts
  const score = calculateSafetyScore(report.items);  // scorer.ts

  return Response.json({ ...report, safetyScore: score });
}
```

**Function Calling과 스트리밍**:
- Function Calling은 완전한 응답을 한 번에 반환 (스트리밍 불가)
- MVP에서는 비스트리밍으로 시작, 로딩 UI로 UX 보완
- 필요 시 Phase 2에서 "가짜 스트리밍" 도입 (단계별 진행 메시지 → 최종 JSON)

### 3.3 배포: Vercel Hobby → Pro 전환 기준

| 상황 | 플랜 |
|------|------|
| MVP 검증 (현재) | **Hobby (무료)** |
| Gemini 응답 25초 초과 패턴 발생 | Pro 전환 검토 |
| 일 분석 횟수 100회+ 안정적 달성 | Pro 전환 (수익화로 충당) |

**Rate Limiting (Hobby 플랜용)**:
- Vercel Hobby: Edge Middleware에서 IP 기반 간단 제한 가능
- KV 없이 구현: `X-Forwarded-For` 헤더 + Vercel의 기본 DDoS 보호 활용
- MVP에서는 소프트 리밋 (클라이언트 localStorage 기반) + 추후 서버사이드 추가

---

## 4. API 아키텍처

### 4.1 전체 흐름 (v1.1 — Hobby 호환)

```
[브라우저]
    |
    | 1. 면책 동의 모달 확인
    | 2. PDF 파일 선택
    | 3. pdfjs-dist로 텍스트 추출 (브라우저 내, 1-5초)
    |    └─ 스캔본 감지 → 즉시 오류 표시 (서버 요청 없음)
    | 4. POST /api/analyze
    |    Body: { text: string, propertyPrice?: number }
    |    (PDF 파일 자체는 서버에 전송되지 않음)
    |
[Next.js Edge Runtime — Vercel Hobby]
    |
    ├── 5. 요청 검증 (text 길이, consent)
    ├── 6. Gemini API 호출 (gemini-2.0-flash, Function Calling)
    ├── 7. Function Call 응답 파싱 (extractor.ts)
    ├── 8. 점수 계산 (scorer.ts — 순수 TypeScript)
    ├── 9. 신호등 분류 (classifier.ts)
    └── 10. JSON 응답 반환

[브라우저]
    |
    └── 11. sessionStorage에 결과 저장
        12. /analyze 페이지로 이동
        13. 결과 UI 렌더링
```

### 4.2 API 엔드포인트

| 엔드포인트 | 메서드 | Runtime | 설명 |
|-----------|--------|---------|------|
| `/api/analyze` | POST | **Edge** | 텍스트 분석 (PDF 아님) |
| `/api/health` | GET | Edge | 서비스 상태 확인 |

### 4.3 요청/응답 형식

**요청** (`POST /api/analyze`):
```typescript
// Content-Type: application/json
{
  text: string;           // 클라이언트에서 추출한 등기부등본 텍스트
  propertyPrice?: number; // 부동산 시세 (원, 선택 — 근저당 비율 계산용)
  consent: true;          // 면책 동의 확인 (필수)
}
```

**성공 응답** (`200 OK`):
```typescript
{
  score: number;                        // 0-100
  trafficLight: "red" | "yellow" | "green";
  items: RiskItem[];                    // 위험 항목 배열
  summary: string;                      // AI 종합 의견 (한국어)
  checklist: string[];                  // 계약 전 확인 사항
  propertyAddress?: string;
  totalMortgageAmount?: number;
  deductions: ScoreDeduction[];         // 감점 내역 (투명성)
  disclaimer: string;                   // 면책 조항 재확인
}
```

**에러 응답** (`4xx/5xx`):
```typescript
{
  error: "SCANNED_PDF" | "INVALID_TEXT" | "NOT_REGISTRATION" | "API_ERROR" | "RATE_LIMIT" | "TIMEOUT";
  message: string;  // 사용자 친화적 한국어 메시지
}
```

---

## 5. 프로젝트 구조

```
tensec-check/
├── docs/
│   ├── PRD.md
│   ├── TASKS.md
│   ├── TECH_STACK.md
│   └── logs/
│
├── .agent/
│   └── skills/
│       └── 등기부등본-분석.md
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # 랜딩 + 업로드
│   │   ├── globals.css
│   │   ├── analyze/page.tsx      # 결과 페이지
│   │   ├── privacy/page.tsx
│   │   └── api/
│   │       ├── analyze/
│   │       │   └── route.ts      # Edge Runtime, POST — Gemini 분석
│   │       └── health/
│   │           └── route.ts      # Edge Runtime, GET
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── upload/
│   │   │   ├── DropZone.tsx      # 드래그앤드롭 + 클라이언트 PDF 추출 트리거
│   │   │   └── PdfExtractor.ts  # pdfjs-dist 래퍼 (클라이언트 전용)
│   │   ├── analysis/
│   │   │   ├── ScoreGauge.tsx
│   │   │   ├── TrafficLight.tsx
│   │   │   ├── RiskItem.tsx
│   │   │   ├── RiskSummary.tsx
│   │   │   └── ExpertCTA.tsx
│   │   ├── legal/
│   │   │   ├── ConsentModal.tsx
│   │   │   └── DisclaimerBanner.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   │
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── gemini.ts         # Gemini 클라이언트 (Edge 호환)
│   │   │   └── prompts.ts        # 시스템 프롬프트 + Function Declaration
│   │   ├── analysis/
│   │   │   ├── extractor.ts      # Gemini 응답 → RiskReport
│   │   │   ├── scorer.ts         # 0-100 점수 (순수 TypeScript, Edge 호환)
│   │   │   └── classifier.ts     # 신호등 분류
│   │   └── utils/
│   │       └── validation.ts     # 텍스트 유효성 검사
│   │
│   └── types/
│       ├── analysis.ts
│       ├── api.ts
│       └── document.ts
│
├── public/
│   ├── og-image.png
│   └── logo.svg
│
├── .env.local                    # GEMINI_API_KEY
├── .env.example
├── next.config.ts                # canvas: false (pdfjs-dist 설정)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

> **제거된 파일**: `src/lib/pdf/parser.ts` (서버 pdf-parse → 클라이언트 PdfExtractor.ts로 이동)

---

## 6. 핵심 타입 정의

```typescript
// src/types/analysis.ts

export type RiskSeverity = "HIGH" | "MEDIUM" | "LOW";
export type TrafficLight = "red" | "yellow" | "green";
export type RegistrationSection = "갑구" | "을구" | "표제부";

export interface RiskItem {
  id: string;
  section: RegistrationSection;
  type: string;
  severity: RiskSeverity;
  amount?: number;
  creditor?: string;
  registrationDate?: string;
  description: string;        // AI 생성 쉬운 설명
  rawText?: string;
}

export interface ScoreDeduction {
  reason: string;
  points: number;
}

export interface SafetyScore {
  total: number;              // 0-100
  trafficLight: TrafficLight;
  deductions: ScoreDeduction[];
}

export interface RiskReport {
  propertyAddress?: string;
  ownerName?: string;
  items: RiskItem[];
  summary: string;
  checklist: string[];
  safetyScore: SafetyScore;
  totalMortgageAmount?: number;
  analysisTimestamp: string;
}

// API 응답 타입 (클라이언트 수신)
export type AnalyzeResponse = RiskReport & { disclaimer: string };
```

---

## 7. 보안 고려사항

| 위험 | 대응 |
|------|------|
| GEMINI_API_KEY 노출 | Edge Runtime 서버사이드 전용, `.env.local` 미커밋 |
| PDF 개인정보 유출 | **PDF 자체를 서버로 전송하지 않음** (클라이언트 추출) |
| API 비용 폭주 | MVP: 클라이언트 소프트 제한 / Phase 3: 서버사이드 Rate Limit |
| XSS | React 기본 이스케이프, AI 텍스트 신뢰하지 않음 |
| 텍스트 조작 | 서버에서 텍스트 길이·내용 기본 검증 |

---

## 8. 환경변수

```bash
# .env.example
GEMINI_API_KEY=              # Google AI Studio에서 발급 (필수)
NEXT_PUBLIC_EXPERT_EMAIL=    # 전문가 연결 이메일 (선택)
NEXT_PUBLIC_KAKAO_CHANNEL=   # 카카오톡 채널 URL (선택)

# Phase 3 추가 예정
# KV_REST_API_URL=           # Vercel KV (서버사이드 Rate Limit)
# KV_REST_API_TOKEN=
```

---

## 9. 주요 리스크 & 대응

| 리스크 | 확률 | 영향 | 대응 |
|--------|------|------|------|
| Gemini 25초 초과 | 낮음 | 높음 | gemini-2.0-flash 우선 사용, 초과 시 Pro 전환 |
| pdfjs-dist 번들 크기 (~400KB) | 중간 | 낮음 | 동적 import로 lazy 로드 |
| 스캔본 PDF | 높음 | 중간 | 클라이언트에서 즉시 감지 (서버 부하 없음) |
| 법적 책임 | 중간 | 매우 높음 | 강력한 면책 조항 + 필수 동의 |
| Gemini 환각 | 중간 | 높음 | 텍스트 추출만 AI, 점수 계산은 TypeScript |
| 등기부등본 포맷 다양성 | 중간 | 중간 | 실제 문서 5종+ 테스트, few-shot 프롬프트 |
| Edge Runtime Function Calling 미지원 | 낮음 | 높음 | `@google/generative-ai`는 Edge 호환 확인됨 |

---

## 10. Pro 플랜 전환 체크리스트

다음 조건 중 하나라도 해당되면 Vercel Pro 업그레이드 검토:

- [ ] Gemini 응답 시간이 20초 이상 반복적으로 발생
- [ ] 일 분석 횟수가 100회를 꾸준히 초과
- [ ] gemini-1.5-pro 모델로 정확도 개선이 필요한 시점
- [ ] 서버사이드 Rate Limiting (Vercel KV) 구축 필요
- [ ] 파트너 공인중개사와 수익화 계약 체결로 비용 충당 가능 시
