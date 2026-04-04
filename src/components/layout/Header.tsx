import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
          <span className="font-bold text-[var(--color-primary)] text-lg tracking-tight">
            TenSec Check
          </span>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] flex-shrink-0 ml-2">
          <span className="hidden sm:flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block flex-shrink-0" />
            <span className="whitespace-nowrap">PDF는 내 기기에서만</span>
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="whitespace-nowrap">광고 없음</span>
        </div>
      </div>
    </header>
  );
}
