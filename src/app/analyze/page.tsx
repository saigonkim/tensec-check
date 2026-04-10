"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Share2, Copy, Check } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { TrafficLightDisplay } from "@/components/analysis/TrafficLight";
import { ScoreGauge } from "@/components/analysis/ScoreGauge";
import { RiskSummary } from "@/components/analysis/RiskSummary";
import { ExpertCTA } from "@/components/analysis/ExpertCTA";
import { DisclaimerBanner } from "@/components/legal/DisclaimerBanner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { AnalyzeResponse } from "@/types/api";
import type { TrafficLight } from "@/types/analysis";
import { CheckCircle2 } from "lucide-react";

const TL_LABEL: Record<TrafficLight, string> = {
  green: "안전",
  yellow: "주의",
  red: "위험",
};

function buildShareText(result: AnalyzeResponse): string {
  const tl = result.safetyScore.trafficLight;
  const lines = [
    `[TenSec Check] 등기부등본 분석 결과`,
    `안전 점수: ${result.safetyScore.total}점 / 100점 (${TL_LABEL[tl]})`,
  ];
  if (result.propertyAddress) lines.push(`주소: ${result.propertyAddress}`);
  if (result.summary) lines.push(`\n${result.summary}`);
  lines.push(`\n등기부등본 무료 분석 → tensec-check.vercel.app`);
  return lines.join("\n");
}

function ShareButton({ result }: { result: AnalyzeResponse }) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const text = buildShareText(result);

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "등기부등본 분석 결과 — TenSec Check",
          text,
        });
        return;
      } catch {
        // 취소 시 fallback으로 진행
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard 권한 없음 — 무시
    }
  }, [result]);

  return (
    <Button variant="secondary" size="md" onClick={handleShare} fullWidth>
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2 inline text-green-500" />
          복사됨
        </>
      ) : (
        <>
          {typeof navigator !== "undefined" && "share" in navigator ? (
            <Share2 className="w-4 h-4 mr-2 inline" />
          ) : (
            <Copy className="w-4 h-4 mr-2 inline" />
          )}
          결과 공유하기
        </>
      )}
    </Button>
  );
}

export default function AnalyzePage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("tensec_result");
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      setResult(JSON.parse(raw));
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!result) return null;

  const { safetyScore, propertyAddress, ownerName, summary, items, checklist } = result;
  const { deductions } = safetyScore;
  const tl = safetyScore.trafficLight;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-lg space-y-4">

          {/* Score Card */}
          <Card padding="lg">
            {/* 모바일(375px)에서도 깨지지 않도록 flex 방향 유지 */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <TrafficLightDisplay status={tl} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-4xl font-bold text-[var(--color-text-primary)]">
                  {safetyScore.total}
                  <span className="text-base font-normal text-[var(--color-text-secondary)] ml-1">
                    / 100
                  </span>
                </div>
                {propertyAddress && (
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 truncate">
                    {propertyAddress}
                  </p>
                )}
                {ownerName && (
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    소유자: {ownerName}
                  </p>
                )}
                <div className="mt-3">
                  <ScoreGauge score={safetyScore.total} trafficLight={tl} />
                </div>
              </div>
            </div>
          </Card>

          {/* Expert CTA */}
          <ExpertCTA trafficLight={tl} />

          {/* Summary */}
          {summary && (
            <Card>
              <h2 className="font-semibold text-sm text-[var(--color-text-primary)] mb-2">
                종합 의견
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {summary}
              </p>
            </Card>
          )}

          {/* Risk Items */}
          <RiskSummary items={items} />

          {/* Score Deductions */}
          {deductions.length > 0 && (
            <Card>
              <h2 className="font-semibold text-sm text-[var(--color-text-primary)] mb-3">
                점수 감점 내역
              </h2>
              <div className="space-y-1.5">
                {deductions.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">{d.reason}</span>
                    <span className="font-medium text-red-500">-{d.points}점</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Checklist */}
          {checklist.length > 0 && (
            <Card>
              <h2 className="font-semibold text-sm text-[var(--color-text-primary)] mb-3">
                계약 전 꼭 확인하세요
              </h2>
              <ul className="space-y-2">
                {checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-text-secondary)]">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Disclaimer Banner */}
          <DisclaimerBanner />

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <ShareButton result={result} />
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onClick={() => {
                sessionStorage.removeItem("tensec_result");
                router.push("/");
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2 inline" />
              다른 등기부등본 분석하기
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
