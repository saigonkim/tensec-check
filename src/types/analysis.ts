export type RiskSeverity = "HIGH" | "MEDIUM" | "LOW";
export type TrafficLight = "red" | "yellow" | "green";
export type RegistrationSection = "갑구" | "을구" | "표제부";

export interface RiskItem {
  id: string;
  section: RegistrationSection;
  type: string; // "근저당권" | "압류" | "가압류" | "예고등기" | "임차권등기명령" 등
  severity: RiskSeverity;
  amount?: number; // 채권최고액 (원)
  creditor?: string; // 채권자명
  registrationDate?: string; // YYYY-MM-DD
  description: string; // AI 생성 쉬운 한국어 설명
  rawText?: string; // 원본 등기부 텍스트
}

export interface ScoreDeduction {
  reason: string;
  points: number;
}

export interface SafetyScore {
  total: number; // 0-100
  trafficLight: TrafficLight;
  deductions: ScoreDeduction[];
}

export interface RiskReport {
  propertyAddress?: string;
  ownerName?: string;
  items: RiskItem[];
  summary: string; // AI 종합 의견
  checklist: string[]; // 계약 전 확인 사항
  safetyScore: SafetyScore;
  totalMortgageAmount?: number; // 근저당 채권최고액 합계 (원)
  analysisTimestamp: string;
}
