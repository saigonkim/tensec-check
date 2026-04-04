import { AlertTriangle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="flex items-start gap-2.5 bg-[#fff9ed] rounded-xl p-4 shadow-[0_2px_12px_rgba(0,36,82,0.03)]">
      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-amber-900 leading-relaxed font-medium">
        본 서비스는 참고용 정보 제공 서비스입니다. 법적 효력이 없으며 실제 계약 전 반드시
        공인중개사 또는 법률 전문가의 확인을 받으시기 바랍니다.
      </p>
    </div>
  );
}
