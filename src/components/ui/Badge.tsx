import type { RiskSeverity } from "@/types/analysis";

const SEVERITY_STYLES: Record<RiskSeverity, string> = {
  HIGH: "bg-red-50 text-red-700 border border-red-100",
  MEDIUM: "bg-yellow-50 text-yellow-700 border border-yellow-100",
  LOW: "bg-gray-50 text-gray-600 border border-gray-200",
};

const SEVERITY_LABELS: Record<RiskSeverity, string> = {
  HIGH: "위험도 높음",
  MEDIUM: "위험도 중간",
  LOW: "위험도 낮음",
};

export function SeverityBadge({ severity }: { severity: RiskSeverity }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${SEVERITY_STYLES[severity]}`}
    >
      {SEVERITY_LABELS[severity]}
    </span>
  );
}
