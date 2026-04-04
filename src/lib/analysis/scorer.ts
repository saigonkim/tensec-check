import type { RiskItem, ScoreDeduction } from "@/types/analysis";

export function calculateSafetyScore(
  items: RiskItem[],
  totalMortgageAmount?: number,
  propertyPrice?: number
): { total: number; deductions: ScoreDeduction[] } {
  let score = 100;
  const deductions: ScoreDeduction[] = [];

  // 갑구 감점
  const seizures = items.filter((i) => i.section === "갑구" && i.type === "압류");
  const provisionals = items.filter((i) => i.section === "갑구" && i.type === "가압류");
  const cautionary = items.filter((i) => i.section === "갑구" && i.type === "예고등기");
  const auctions = items.filter(
    (i) => i.section === "갑구" && i.type.includes("경매")
  );
  const injunctions = items.filter(
    (i) => i.section === "갑구" && i.type === "가처분"
  );

  if (seizures.length > 0) {
    const pts = Math.min(seizures.length * 25, 50);
    score -= pts;
    deductions.push({ reason: `압류 ${seizures.length}건`, points: pts });
  }
  if (provisionals.length > 0) {
    const pts = Math.min(provisionals.length * 20, 40);
    score -= pts;
    deductions.push({ reason: `가압류 ${provisionals.length}건`, points: pts });
  }
  if (cautionary.length > 0) {
    score -= 30;
    deductions.push({ reason: "예고등기 존재", points: 30 });
  }
  if (auctions.length > 0) {
    score -= 10;
    deductions.push({ reason: "경매 이전 이력", points: 10 });
  }
  if (injunctions.length > 0) {
    const pts = Math.min(injunctions.length * 15, 30);
    score -= pts;
    deductions.push({ reason: `가처분 ${injunctions.length}건`, points: pts });
  }

  // 을구 감점 (근저당 비율)
  if (totalMortgageAmount && propertyPrice && propertyPrice > 0) {
    const ratio = (totalMortgageAmount / propertyPrice) * 100;
    if (ratio >= 80) {
      score -= 50;
      deductions.push({
        reason: `근저당 비율 ${ratio.toFixed(0)}% (매우 위험)`,
        points: 50,
      });
    } else if (ratio >= 70) {
      score -= 35;
      deductions.push({
        reason: `근저당 비율 ${ratio.toFixed(0)}%`,
        points: 35,
      });
    } else if (ratio >= 60) {
      score -= 20;
      deductions.push({
        reason: `근저당 비율 ${ratio.toFixed(0)}%`,
        points: 20,
      });
    }
  }

  // 을구 기타 감점
  const leaseOrders = items.filter(
    (i) => i.section === "을구" && i.type === "임차권등기명령"
  );
  if (leaseOrders.length > 0) {
    score -= 15;
    deductions.push({ reason: "임차권등기명령 이력", points: 15 });
  }

  return { total: Math.max(0, score), deductions };
}
