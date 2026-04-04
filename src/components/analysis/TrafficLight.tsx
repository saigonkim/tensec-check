import type { TrafficLight } from "@/types/analysis";

const LABELS: Record<TrafficLight, string> = {
  green: "안전",
  yellow: "주의",
  red: "위험",
};

const ACTIVE_COLOR: Record<TrafficLight, { red: string; yellow: string; green: string }> = {
  red: {
    red: "bg-[var(--color-red)] shadow-[0_0_12px_var(--color-red)]",
    yellow: "bg-gray-200",
    green: "bg-gray-200",
  },
  yellow: {
    red: "bg-gray-200",
    yellow: "bg-[var(--color-yellow)] shadow-[0_0_12px_var(--color-yellow)]",
    green: "bg-gray-200",
  },
  green: {
    red: "bg-gray-200",
    yellow: "bg-gray-200",
    green: "bg-[var(--color-green)] shadow-[0_0_12px_var(--color-green)]",
  },
};

const LABEL_COLOR: Record<TrafficLight, string> = {
  green: "text-[var(--color-green)]",
  yellow: "text-[var(--color-yellow)]",
  red: "text-[var(--color-red)]",
};

interface TrafficLightDisplayProps {
  status: TrafficLight;
}

export function TrafficLightDisplay({ status }: TrafficLightDisplayProps) {
  const colors = ACTIVE_COLOR[status];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Housing */}
      <div className="bg-[var(--color-text-primary)] rounded-2xl p-3 flex flex-col gap-2.5 w-16 shadow-[0_4px_16px_rgba(0,36,82,0.15)]">
        <div className={`w-10 h-10 mx-auto rounded-full transition-all duration-500 ${colors.red}`} />
        <div className={`w-10 h-10 mx-auto rounded-full transition-all duration-500 ${colors.yellow}`} />
        <div className={`w-10 h-10 mx-auto rounded-full transition-all duration-500 ${colors.green}`} />
      </div>
      <span className={`text-sm font-bold ${LABEL_COLOR[status]}`}>
        {LABELS[status]}
      </span>
    </div>
  );
}
