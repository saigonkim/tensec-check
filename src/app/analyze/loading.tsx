// 분석 결과 페이지 로딩 스켈레톤
// analyze/page.tsx가 hydrate되기 전 즉시 표시됨 (CLS 방지)
export default function AnalyzeLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-100 h-14" />

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-lg space-y-4">

          {/* Score card skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-6">
              {/* Traffic light skeleton */}
              <div className="bg-gray-200 rounded-2xl w-16 h-[116px]" />
              <div className="flex-1 space-y-3">
                <div className="h-10 w-24 bg-gray-200 rounded-lg" />
                <div className="h-3 w-48 bg-gray-200 rounded" />
                <div className="h-2.5 w-full bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>

          {/* CTA skeleton */}
          <div className="bg-gray-100 rounded-2xl h-32" />

          {/* Summary skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-4/5 bg-gray-200 rounded" />
          </div>

          {/* Risk items skeleton */}
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex gap-3">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-full bg-gray-200 rounded" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}

        </div>
      </main>
    </div>
  );
}
