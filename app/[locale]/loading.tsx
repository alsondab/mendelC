'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar - Optimisé avec CSS au lieu de framer-motion */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[100] bg-border/20">
        <div
          className="h-full bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{
            background:
              'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
            filter: 'blur(0.5px)',
            animation:
              'progress-loading 1.2s cubic-bezier(0.43, 0.13, 0.23, 0.96) infinite',
          }}
        />
      </div>
      <style jsx>{`
        @keyframes progress-loading {
          0% {
            width: 0%;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 0;
          }
        }
      `}</style>

      {/* Header Skeleton */}
      <div className="border-b bg-card animate-in fade-in duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Skeleton */}
      <div className="border-b bg-card/50 animate-in fade-in duration-300 delay-100">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="space-y-4 animate-in fade-in duration-300 delay-200">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="flex justify-center gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-2 w-8 rounded-full" />
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-4 animate-in fade-in duration-300 delay-300">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${300 + i * 50}ms` }}
              >
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Sliders */}
        {[...Array(3)].map((_, sectionIndex) => (
          <div
            key={sectionIndex}
            className="space-y-4 animate-in fade-in duration-300"
            style={{ animationDelay: `${400 + sectionIndex * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
                  style={{
                    animationDelay: `${400 + sectionIndex * 100 + i * 50}ms`,
                  }}
                >
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Skeleton */}
      <div className="border-t bg-card mt-16 animate-in fade-in duration-300 delay-700">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="space-y-3 animate-in fade-in duration-300"
                style={{ animationDelay: `${700 + i * 100}ms` }}
              >
                <Skeleton className="h-5 w-24" />
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                    style={{ animationDelay: `${700 + i * 100 + j * 50}ms` }}
                  >
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t pt-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
