import type { RiskItem } from "@/types/analysis";
import type { AnalyzeResponse } from "@/types/api";
import { DISCLAIMER } from "@/types/document";
import { calculateSafetyScore } from "./scorer";
import { trafficLight } from "./classifier";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractAnalysisResult(raw: any, propertyPrice?: number): AnalyzeResponse {
  const items: RiskItem[] = (raw.items ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any, idx: number) => ({
      ...item,
      id: `item-${idx}`,
    })
  );

  const { total, deductions } = calculateSafetyScore(
    items,
    raw.totalMortgageAmount,
    propertyPrice
  );

  return {
    propertyAddress: raw.propertyAddress,
    ownerName: raw.ownerName,
    items,
    summary: raw.summary ?? "",
    checklist: raw.checklist ?? [],
    safetyScore: {
      total,
      trafficLight: trafficLight(total),
      deductions,
    },
    totalMortgageAmount: raw.totalMortgageAmount,
    analysisTimestamp: new Date().toISOString(),
    disclaimer: DISCLAIMER,
  };
}
