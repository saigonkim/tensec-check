import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-white">
      <div className="max-w-2xl mx-auto px-4 py-6 text-center text-xs text-[var(--color-text-secondary)] space-y-1">
        <p>
          본 서비스는 정보 제공 목적이며, 법적 효력을 가진 권리분석이 아닙니다.
        </p>
        <p>
          <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--color-primary)]">
            개인정보처리방침
          </Link>
          {" · "}
          © {new Date().getFullYear()} TenSec Check
        </p>
      </div>
    </footer>
  );
}
