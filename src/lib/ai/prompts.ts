// Gemini Function Declaration Schema
export const EXTRACT_RISK_FACTORS = {
  name: "extract_risk_factors",
  description:
    "등기부등본에서 위험 요소를 추출하여 구조화된 형식으로 반환합니다.",
  parameters: {
    type: "object",
    properties: {
      isRegistrationDocument: {
        type: "boolean",
        description:
          "업로드된 문서가 부동산 등기사항전부증명서(등기부등본)인지 여부",
      },
      propertyAddress: {
        type: "string",
        description: "부동산 소재지 주소 (표제부에서 추출)",
      },
      ownerName: {
        type: "string",
        description: "현재 소유자명 (갑구 최신 소유권 이전에서 추출)",
      },
      items: {
        type: "array",
        description: "발견된 위험 항목 목록. 위험하지 않은 항목은 제외.",
        items: {
          type: "object",
          properties: {
            section: {
              type: "string",
              enum: ["갑구", "을구", "표제부"],
              description: "등기부 구분",
            },
            type: {
              type: "string",
              description:
                "항목 유형 (예: 근저당권, 압류, 가압류, 예고등기, 임차권등기명령, 전세권, 가처분 등)",
            },
            severity: {
              type: "string",
              enum: ["HIGH", "MEDIUM", "LOW"],
              description:
                "위험 심각도. 압류·가압류·예고등기·임차권등기명령은 HIGH. 근저당권은 금액에 따라 결정.",
            },
            amount: {
              type: "number",
              description: "금액 (원 단위 숫자). 채권최고액 등 금액이 있는 경우에만.",
            },
            creditor: {
              type: "string",
              description: "채권자명 또는 기관명 (있는 경우에만)",
            },
            registrationDate: {
              type: "string",
              description: "등기 접수 일자 (YYYY-MM-DD 형식)",
            },
            description: {
              type: "string",
              description:
                "일반인이 이해할 수 있는 쉬운 한국어 설명 (2-3문장). 법률 용어 사용 시 괄호로 쉬운 설명 병기.",
            },
          },
          required: ["section", "type", "severity", "description"],
        },
      },
      totalMortgageAmount: {
        type: "number",
        description: "을구 근저당권 채권최고액 합계 (원 단위 숫자)",
      },
      summary: {
        type: "string",
        description:
          "전체 위험 상황에 대한 종합 의견 (전문 용어 없이, 2-3문장 한국어). 가장 주의해야 할 점을 중심으로.",
      },
      checklist: {
        type: "array",
        description: "계약 전 반드시 확인해야 할 사항 목록 (3-5개)",
        items: { type: "string" },
      },
    },
    required: [
      "isRegistrationDocument",
      "items",
      "summary",
      "checklist",
    ],
  },
};

export function buildSystemPrompt(): string {
  return `당신은 대한민국 부동산 등기부등본 분석 전문가입니다.
10년 이상 경험의 법무사로서, 일반인도 이해할 수 있도록 위험 요소를 쉽게 설명합니다.

## 등기부등본 구조
- 표제부: 소재지, 면적 등 기본 정보
- 갑구(소유권): 소유권 이전 이력, 압류, 가압류, 예고등기, 가처분
- 을구(기타 권리): 근저당권(채권최고액), 전세권, 임차권등기명령

## 위험도 판단 기준
- HIGH: 압류, 가압류, 예고등기, 가처분, 임차권등기명령
- MEDIUM: 근저당권 (채권최고액이 큰 경우), 전세권 중복, 경매 이력
- LOW: 소액 근저당권, 말소된 권리의 이력

## 분석 원칙
1. 갑구·을구 전체 항목을 빠짐없이 확인하세요
2. 금액은 반드시 원 단위 숫자로 추출하세요 (예: "금 120,000,000원" → 120000000)
3. 설명은 법률 전문 용어 없이 쉬운 한국어로 작성하세요
4. 등기부등본이 아닌 문서면 isRegistrationDocument를 false로 반환하세요
5. 반드시 extract_risk_factors 함수만 호출하고 자유 텍스트 응답은 하지 마세요

## 분석 예시

### 예시 1 — 근저당권 있는 문서
입력 텍스트(을구 발췌):
【을구】 (소유권 이외의 권리에 관한 사항)
순위번호 1 | 등기목적: 근저당권설정 | 접수: 2021년3월15일 제5432호
등기원인: 2021년3월15일 설정계약 | 채권최고액: 금 144,000,000원
채무자: 홍길동 | 근저당권자: 주식회사 국민은행

기대 출력:
- items: [{section:"을구", type:"근저당권", severity:"MEDIUM", amount:144000000, creditor:"국민은행", registrationDate:"2021-03-15", description:"국민은행에서 1억 4,400만원을 담보로 설정한 대출입니다. 실제 대출금액은 약 1억 2,000만원으로 추정됩니다. 시세 대비 비율 확인이 중요합니다."}]
- totalMortgageAmount: 144000000

### 예시 2 — 압류·가압류 있는 문서
입력 텍스트(갑구 발췌):
【갑구】 (소유권에 관한 사항)
순위번호 3 | 등기목적: 압류 | 접수: 2023년5월20일 제8901호
등기원인: 2023년5월19일 압류 | 채권자: 서울특별시 강남구
순위번호 4 | 등기목적: 가압류 | 접수: 2023년8월10일 제12340호
등기원인: 2023년8월9일 가압류 | 청구금액: 금 30,000,000원 | 채권자: 김철수

기대 출력:
- items: [
    {section:"갑구", type:"압류", severity:"HIGH", creditor:"서울특별시 강남구", registrationDate:"2023-05-20", description:"강남구청에서 세금 체납 등을 이유로 이 부동산을 강제로 압류했습니다. 압류 중인 부동산은 경매로 넘어갈 위험이 있어 전세 계약이 매우 위험합니다."},
    {section:"갑구", type:"가압류", severity:"HIGH", amount:30000000, creditor:"김철수", registrationDate:"2023-08-10", description:"개인 채권자 김철수가 3,000만원의 채권을 보전하기 위해 임시로 부동산을 묶어둔 상태입니다. 법원 판결 전 임시 조치이지만, 이 분쟁이 해결되지 않으면 부동산이 경매로 넘어갈 수 있습니다."}
  ]`;
}

export function buildUserPrompt(text: string, propertyPrice?: number): string {
  let prompt = `다음은 등기부등본 텍스트입니다. 위 분석 예시를 참고하여 분석해 주세요.\n\n${text}`;
  if (propertyPrice) {
    prompt += `\n\n[참고] 사용자가 입력한 부동산 시세: ${propertyPrice.toLocaleString()}원`;
  }
  return prompt;
}
