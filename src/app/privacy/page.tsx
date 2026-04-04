import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "개인정보처리방침 — TenSec Check",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 p-6 space-y-6 text-sm text-[var(--color-text-secondary)] leading-relaxed">

          <div>
            <h1 className="text-lg font-bold text-[var(--color-text-primary)]">
              개인정보처리방침
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Privacy Policy · 최종 수정일: 2026년 4월 4일
            </p>
          </div>

          <section>
            <h2 className="font-semibold text-[var(--color-text-primary)] mb-2">
              1. 수집하는 개인정보
            </h2>
            <p>
              본 서비스는 회원가입이 없으며 별도의 개인정보를 수집하지 않습니다.
              서버 접속 로그(IP, 접속 시각)는 Vercel 인프라가 자동으로 보관하며,
              이는 서비스 운영 및 보안 목적으로만 사용됩니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-text-primary)] mb-2">
              2. PDF 파일 처리 방식
            </h2>
            <p>
              업로드하신 PDF 파일은 <strong className="text-[var(--color-text-primary)]">사용자의 기기(브라우저) 내에서만</strong> 텍스트로
              변환됩니다. 파일 자체는 서버로 전송되지 않으며,
              추출된 텍스트만 AI 분석 목적으로 전송됩니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-text-primary)] mb-2">
              3. AI 분석 서비스 (Google Gemini)
            </h2>
            <p>
              등기부등본에서 추출된 텍스트는 Google의 Gemini AI API로 전송되어 분석됩니다.
              Google은 해당 데이터를 모델 학습에 사용하지 않도록 API 약관에서 보장합니다.
              자세한 내용은{" "}
              <a
                href="https://ai.google.dev/gemini-api/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[var(--color-primary)]"
              >
                Google Gemini API 이용약관
              </a>
              을 참고하세요.
            </p>
            <p className="mt-2">
              <strong className="text-[var(--color-text-primary)]">주의:</strong>{" "}
              등기부등본에 포함된 소유자명, 주소 등 개인정보가 Google 서버로 전송됩니다.
              이를 원하지 않으시면 서비스 이용을 삼가해 주세요.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-text-primary)] mb-2">
              4. 분석 결과 저장
            </h2>
            <p>
              분석 결과는 브라우저의 세션 스토리지(sessionStorage)에만 임시 저장되며,
              탭을 닫으면 즉시 삭제됩니다. 서버에는 분석 결과가 저장되지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-text-primary)] mb-2">
              5. 쿠키 및 서비스 분석 (Google Analytics 4)
            </h2>
            <p>
              본 서비스는 방문자 통계 및 서비스 개선을 위해{" "}
              <strong className="text-[var(--color-text-primary)]">Google Analytics 4 (GA4)</strong>를 사용합니다.
              GA4는 <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">_ga</code>,{" "}
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">_ga_*</code> 쿠키를 통해
              페이지 방문 횟수, 유입 경로, 기능 사용 패턴 등을 수집합니다.
            </p>
            <p className="mt-2">
              수집 데이터는 개인을 특정하지 않는 집계 통계로만 활용되며,
              광고 목적으로 사용되지 않습니다. GA4 데이터 처리에 대한 자세한 내용은{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[var(--color-primary)]"
              >
                Google 개인정보처리방침
              </a>
              을 참고하세요.
            </p>
            <p className="mt-2">
              쿠키 수집을 원하지 않으시면 브라우저 설정에서 쿠키를 차단하거나,{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[var(--color-primary)]"
              >
                Google Analytics 차단 브라우저 부가기능
              </a>
              을 설치할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-text-primary)] mb-2">
              6. 문의
            </h2>
            <p>
              개인정보 처리 방식에 대한 문의는 서비스 내 문의 채널을 통해 연락해 주세요.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
