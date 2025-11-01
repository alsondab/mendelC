'use client'

import { AnimatedSkeleton } from '@/components/ui/animated-skeleton'

const shimmerBlock = 'rounded-lg bg-card/60 p-4 shadow-sm'

export default function LoadingPage() {
  return (
    <div className='min-h-screen bg-background px-4 py-6 md:py-10'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
        <AnimatedSkeleton className='h-1 w-full rounded-full' />

        <section className={shimmerBlock}>
          <div className='flex items-center justify-between gap-6'>
            <AnimatedSkeleton className='h-8 w-32' />
            <AnimatedSkeleton className='hidden h-10 flex-1 rounded-full md:block' />
            <div className='flex items-center gap-3'>
              <AnimatedSkeleton className='h-6 w-20' />
              <AnimatedSkeleton className='h-6 w-16' />
              <AnimatedSkeleton className='h-8 w-8 rounded-full' />
            </div>
          </div>
        </section>

        <section className={shimmerBlock}>
          <div className='flex flex-wrap items-center gap-4'>
            {Array.from({ length: 6 }).map((_, index) => (
              <AnimatedSkeleton
                key={index}
                className='h-6 w-24 rounded-full'
                stagger
              />
            ))}
          </div>
        </section>

        <section className={shimmerBlock}>
          <AnimatedSkeleton className='mb-4 h-64 w-full rounded-xl' />
          <div className='flex justify-center gap-2'>
            {Array.from({ length: 4 }).map((_, index) => (
              <AnimatedSkeleton key={index} className='h-2 w-10 rounded-full' />
            ))}
          </div>
        </section>

        <section className={shimmerBlock}>
          <AnimatedSkeleton className='mb-4 h-7 w-48 rounded-full' />
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className='space-y-3'>
                <AnimatedSkeleton className='h-32 w-full rounded-xl' />
                <AnimatedSkeleton className='h-4 w-3/4 rounded-full' />
              </div>
            ))}
          </div>
        </section>

        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <section key={sectionIndex} className={shimmerBlock}>
            <div className='mb-4 flex items-center justify-between'>
              <AnimatedSkeleton className='h-6 w-40 rounded-full' />
              <AnimatedSkeleton className='h-6 w-24 rounded-full' />
            </div>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
              {Array.from({ length: 5 }).map((_, cardIndex) => (
                <div key={cardIndex} className='space-y-3'>
                  <AnimatedSkeleton className='h-36 w-full rounded-xl' />
                  <AnimatedSkeleton className='h-4 w-2/3 rounded-full' />
                  <AnimatedSkeleton className='h-4 w-1/2 rounded-full' />
                  <AnimatedSkeleton className='h-6 w-20 rounded-full' />
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className={shimmerBlock}>
          <div className='grid gap-6 md:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className='space-y-3'>
                <AnimatedSkeleton className='h-5 w-24 rounded-full' />
                {Array.from({ length: 4 }).map((__, rowIndex) => (
                  <AnimatedSkeleton
                    key={rowIndex}
                    className='h-4 w-32 rounded-full'
                  />
                ))}
              </div>
            ))}
          </div>
          <div className='mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row'>
            <AnimatedSkeleton className='h-6 w-32 rounded-full' />
            <div className='flex gap-3'>
              <AnimatedSkeleton className='h-6 w-24 rounded-full' />
              <AnimatedSkeleton className='h-6 w-24 rounded-full' />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
