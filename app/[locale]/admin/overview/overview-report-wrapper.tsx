'use client'

import dynamic from 'next/dynamic'

// ⚡ Optimization: Lazy load OverviewReport (contient Recharts ~53KB) pour réduire le First Load JS
// Wrapper client pour permettre ssr: false (Recharts nécessite client-side)
const OverviewReport = dynamic(() => import('./overview-report'), {
  ssr: false, // ⚡ Optimization: Pas de SSR nécessaire pour Recharts (client-side seulement)
  loading: () => (
    <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
      <div>
        <h1 className="h1-bold text-xl sm:text-2xl">Dashboard</h1>
      </div>
      {/* First Row */}
      <div className="grid gap-2 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-32 sm:h-36 w-full bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
      {/* Second Row */}
      <div>
        <div className="h-[20rem] sm:h-[30rem] w-full bg-muted animate-pulse rounded-lg" />
      </div>
      {/* Third Row */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="h-48 sm:h-60 w-full bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    </div>
  ),
})

export default function OverviewReportWrapper() {
  return <OverviewReport />
}
