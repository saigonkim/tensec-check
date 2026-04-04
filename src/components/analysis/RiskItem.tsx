import { XCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import type { RiskItem } from "@/types/analysis";
import { SeverityBadge } from "@/components/ui/Badge";

const SEVERITY_STYLE = {
  HIGH: {
    bg: "bg-red-50",
    border: "border-red-100",
    text: "text-red-700",
    icon: XCircle,
  },
  MEDIUM: {
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    text: "text-yellow-700",
    icon: AlertCircle,
  },
  LOW: {
    bg: "bg-gray-50",
    border: "border-gray-100",
    text: "text-gray-600",
    icon: CheckCircle2,
  },
};

export function RiskItemCard({ item }: { item: RiskItem }) {
  const cfg = SEVERITY_STYLE[item.severity];
  const Icon = cfg.icon;

  return (
    <div className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.text}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-[var(--color-text-primary)]">
              {item.type}
            </span>
            <SeverityBadge severity={item.severity} />
            <span className="text-xs text-[var(--color-text-secondary)]">
              {item.section}
            </span>
          </div>
          {item.amount !== undefined && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              채권최고액: {item.amount.toLocaleString()}원
              {item.creditor && ` · ${item.creditor}`}
              {item.registrationDate && ` · ${item.registrationDate}`}
            </p>
          )}
          <p className="text-sm text-[var(--color-text-primary)] mt-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}
