import { CheckCircle2 } from "lucide-react";
import type { RiskItem } from "@/types/analysis";
import { RiskItemCard } from "./RiskItem";

interface RiskSummaryProps {
  items: RiskItem[];
}

export function RiskSummary({ items }: RiskSummaryProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[var(--color-green)]" />
        <p className="font-semibold text-sm text-[var(--color-text-primary)]">
          특별한 위험 항목이 없습니다
        </p>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          계약 전 전문가 확인은 항상 권장됩니다
        </p>
      </div>
    );
  }

  const highCount = items.filter((i) => i.severity === "HIGH").length;
  const mediumCount = items.filter((i) => i.severity === "MEDIUM").length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-semibold text-sm text-[var(--color-text-primary)]">
          발견된 위험 항목 ({items.length}건)
        </h2>
        <div className="flex gap-2 text-xs">
          {highCount > 0 && (
            <span className="text-red-600 font-medium">높음 {highCount}</span>
          )}
          {mediumCount > 0 && (
            <span className="text-yellow-600 font-medium">중간 {mediumCount}</span>
          )}
        </div>
      </div>
      {items.map((item) => (
        <RiskItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
