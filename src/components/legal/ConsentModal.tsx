"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DISCLAIMER } from "@/types/document";

interface ConsentModalProps {
  onConsent: () => void;
  onClose: () => void;
}

export default function ConsentModal({ onConsent, onClose }: ConsentModalProps) {
  const [checked, setChecked] = useState(false);

  return (
    <Modal
      title="서비스 이용 전 확인사항"
      onClose={onClose}
      footer={
        <Button
          onClick={onConsent}
          disabled={!checked}
          fullWidth
          size="lg"
        >
          동의하고 분석 시작
        </Button>
      }
    >
      {/* Icon + 안내 */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            이 서비스는 참고용입니다
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            분석 결과는 법적 효력이 없으며 실제 계약 판단의 근거로 사용하실 수 없습니다.
          </p>
        </div>
      </div>

      {/* 전문 면책 조항 — 스크롤 영역 */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 max-h-40 overflow-y-auto mb-4">
        <p className="text-xs text-amber-900 leading-relaxed whitespace-pre-line">
          {DISCLAIMER}
        </p>
      </div>

      {/* 개인정보 안내 */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
        <p className="text-xs text-blue-800 leading-relaxed">
          🔒 <strong>PDF 파일은 내 기기에서만 읽힙니다.</strong>
          {" "}파일 자체는 서버로 전송되지 않으며, 추출된 텍스트만 AI 분석에 사용됩니다.
          분석 후 데이터는 저장되지 않습니다.
        </p>
      </div>

      {/* 동의 체크박스 */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-[var(--color-primary)] cursor-pointer flex-shrink-0"
        />
        <span className="text-sm text-[var(--color-text-primary)]">
          위 내용을 모두 확인하였으며, 분석 결과가{" "}
          <strong>법적 효력이 없는 참고용</strong>임을 이해하고 동의합니다.
        </span>
      </label>
    </Modal>
  );
}
