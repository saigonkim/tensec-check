import type { TrafficLight } from "@/types/analysis";

export function trafficLight(score: number): TrafficLight {
  if (score >= 70) return "green";
  if (score >= 40) return "yellow";
  return "red";
}
