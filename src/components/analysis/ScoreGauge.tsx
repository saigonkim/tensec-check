import type { TrafficLight } from "@/types/analysis";

const COLOR: Record<TrafficLight, string> = {
  green: "bg-[var(--color-green)]",
  yellow: "bg-[var(--color-yellow)]",
  red: "bg-[var(--color-red)]",
};

const TRACK: Record<TrafficLight, string> = {
  green: "bg-[var(--color-green-bg)]",
  yellow: "bg-[var(--color-yellow-bg)]",
  red: "bg-[var(--color-red-bg)]",
};

interface ScoreGaugeProps {
  score: number;
  trafficLight: TrafficLight;
}

export function ScoreGauge({ score, trafficLight }: ScoreGaugeProps) {
  const pct = Math.min(100, Math.max(0, score));

  return (
    <div className="w-full">
      <div className={`w-full h-2.5 rounded-full ${TRACK[trafficLight]}`}>
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ease-out ${COLOR[trafficLight]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-[var(--color-text-secondary)]">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
}
