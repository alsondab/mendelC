import { Skeleton } from '@/components/ui/skeleton'

export default async function LoadingPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header Skeleton */}
      <div className='border-b bg-card'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <Skeleton className='h-8 w-32' />

            {/* Search Bar */}
            <div className='hidden md:flex flex-1 max-w-2xl mx-8'>
              <Skeleton className='h-10 w-full rounded-full' />
            </div>

            {/* Right Side Actions */}
            <div className='flex items-center gap-4'>
              <Skeleton className='h-6 w-20' />
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-8 w-8 rounded-full' />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Skeleton */}
      <div className='border-b bg-card/50'>
        <div className='container mx-auto px-4 py-2'>
          <div className='flex items-center gap-6'>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className='h-6 w-20' />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className='container mx-auto px-4 py-8 space-y-8'>
        {/* Hero Section */}
        <div className='space-y-4'>
          <Skeleton className='h-64 w-full rounded-lg' />
          <div className='flex justify-center gap-2'>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className='h-2 w-8 rounded-full' />
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className='space-y-4'>
          <Skeleton className='h-8 w-48' />
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[...Array(8)].map((_, i) => (
              <div key={i} className='space-y-3'>
                <Skeleton className='h-32 w-full rounded-lg' />
                <Skeleton className='h-4 w-3/4' />
              </div>
            ))}
          </div>
        </div>

        {/* Product Sliders */}
        {[...Array(3)].map((_, sectionIndex) => (
          <div key={sectionIndex} className='space-y-4'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-6 w-40' />
              <Skeleton className='h-6 w-20' />
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='space-y-3'>
                  <Skeleton className='h-40 w-full rounded-lg' />
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-4 w-1/2' />
                  <Skeleton className='h-6 w-20' />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Loading Message */}
        <div className='flex flex-col items-center justify-center py-12 space-y-4'>
          <div className='relative'>
            <div className='w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin'></div>
            <div
              className='absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/40 rounded-full animate-spin'
              style={{ animationDelay: '-0.5s' }}
            ></div>
          </div>
          <div className='text-center space-y-2'>
            <Skeleton className='h-6 w-32 mx-auto' />
            <Skeleton className='h-4 w-48 mx-auto' />
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className='border-t bg-card mt-16'>
        <div className='container mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='space-y-3'>
                <Skeleton className='h-5 w-24' />
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className='h-4 w-32' />
                ))}
              </div>
            ))}
          </div>
          <div className='border-t pt-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-4'>
            <Skeleton className='h-6 w-32' />
            <div className='flex gap-4'>
              <Skeleton className='h-6 w-20' />
              <Skeleton className='h-6 w-20' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
