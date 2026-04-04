import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UploadSection from "@/components/upload/UploadSection";
import { ShieldCheck, Clock, EyeOff, Megaphone } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg">

          {/* Hero */}
          <div className="text-center mb-10 pt-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.25rem] bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-light)] mb-6 shadow-[0_8px_32px_rgba(27,58,107,0.2)]">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] leading-tight mb-4">
              등기부등본 10초 해독기
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
              앱 설치도, 광고도 없습니다.
              <br className="sm:hidden" />
              업로드 한 번으로 전세 사기 위험을 바로 확인하세요.
            </p>
          </div>

          {/* Upload Section (Client Component) */}
          <UploadSection />

          {/* Trust Badges */}
          <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: EyeOff, label: "기기 내 처리", sub: "서버 미전송" },
              { icon: Clock, label: "평균 10초", sub: "초고속 분석" },
              { icon: Megaphone, label: "완전 무료", sub: "광고/가입 없음" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="bg-white rounded-[1.25rem] px-2 py-4 sm:p-4 text-center shadow-[0_4px_24px_rgba(0,36,82,0.04)]"
              >
                <Icon className="w-5 h-5 mx-auto mb-2 text-[var(--color-primary-light)] opacity-90" />
                <p className="text-[11px] sm:text-xs font-bold tracking-tight text-[var(--color-text-primary)] leading-snug">
                  {label}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[var(--color-text-secondary)] mt-1 font-medium leading-snug tracking-tight">
                  {sub}
                </p>
              </div>
            ))}
          </div>

          {/* How it works — 간단 설명 (데스크탑에서 추가 공간 활용) */}
          <div className="mt-8 hidden sm:block">
            <p className="text-xs text-center text-[var(--color-text-secondary)] mb-4 font-medium">
              이용 방법
            </p>
            <div className="flex items-start gap-4">
              {[
                { step: "1", text: "대법원 인터넷등기소에서 등기부등본 PDF 발급" },
                { step: "2", text: "PDF를 위 영역에 드래그하거나 클릭하여 선택" },
                { step: "3", text: "AI가 위험 항목을 분석하고 안전 점수를 제공" },
              ].map(({ step, text }) => (
                <div key={step} className="flex-1 text-center">
                  <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">
                    {step}
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
