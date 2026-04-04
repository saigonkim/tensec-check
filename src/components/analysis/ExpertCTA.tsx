import { PhoneCall, MessageCircle, UserCheck } from "lucide-react";
import type { TrafficLight } from "@/types/analysis";

interface CTAConfig {
  bg: string;
  border: string;
  title: string;
  desc: string;
  btnClass: string;
  urgent?: boolean;
}

const CTA_CONFIG: Record<TrafficLight, CTAConfig> = {
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    title: "⚠️ 위험 — 전문가 확인이 필수입니다",
    desc: "계약을 진행하기 전, 반드시 법무사나 공인중개사의 확인을 받으세요. 위험 항목이 발견된 매물은 전세금을 돌려받지 못할 위험이 있습니다.",
    btnClass: "bg-[var(--color-red)] text-white hover:bg-red-600 active:bg-red-700",
    urgent: true,
  },
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    title: "주의가 필요합니다",
    desc: "확인이 필요한 항목이 있습니다. 전문가 검토를 통해 안전하게 계약을 진행하세요.",
    btnClass: "bg-[var(--color-yellow)] text-white hover:bg-amber-500",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    title: "안전해 보입니다",
    desc: "큰 위험 항목은 없습니다. 최종 계약 전 전문가 확인을 받으면 더욱 안심할 수 있습니다.",
    btnClass: "bg-[var(--color-green)] text-white hover:bg-green-600",
  },
};

interface ExpertCTAProps {
  trafficLight: TrafficLight;
}

export function ExpertCTA({ trafficLight }: ExpertCTAProps) {
  const cfg = CTA_CONFIG[trafficLight];
  const kakaoChannel = process.env.NEXT_PUBLIC_KAKAO_CHANNEL;
  const expertEmail = process.env.NEXT_PUBLIC_EXPERT_EMAIL;

  const utmSuffix = `?utm_source=tenseccheck&utm_medium=cta&utm_campaign=${trafficLight}-result`;

  const hasLinks = !!(kakaoChannel || expertEmail);

  return (
    <div
      className={`rounded-2xl border p-5 ${cfg.bg} ${cfg.border} ${
        cfg.urgent ? "ring-2 ring-red-300 ring-offset-1" : ""
      }`}
    >
      <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-1.5">
        {cfg.title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
        {cfg.desc}
      </p>

      <div className="flex flex-col gap-2">
        {/* 카카오 채널 */}
        {kakaoChannel && (
          <a
            href={`${kakaoChannel}${utmSuffix}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors ${cfg.btnClass}`}
          >
            <MessageCircle className="w-4 h-4 flex-shrink-0" />
            카카오로 전문가 상담
          </a>
        )}

        {/* 이메일 문의 */}
        {expertEmail && (
          <a
            href={`mailto:${expertEmail}${utmSuffix}`}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium
              bg-white border border-gray-200 text-[var(--color-text-secondary)] hover:bg-gray-50 transition-colors"
          >
            <PhoneCall className="w-4 h-4 flex-shrink-0" />
            이메일로 문의하기
          </a>
        )}

        {/* 폴백: 연결 정보 없을 때 */}
        {!hasLinks && (
          <div className="flex items-start gap-2.5 bg-white rounded-xl border border-gray-200 p-3.5">
            <UserCheck className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              가까운 <strong className="text-[var(--color-text-primary)]">공인중개사 사무소</strong> 또는{" "}
              <strong className="text-[var(--color-text-primary)]">법무사 사무소</strong>를 방문하거나,
              대법원 인터넷등기소(iros.go.kr)의 상담 서비스를 이용하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
