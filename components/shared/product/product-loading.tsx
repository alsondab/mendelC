'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function ProductPageSkeleton() {
  return (
    <div className='container mx-auto px-4 py-8 space-y-8'>
      {/* Breadcrumb */}
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-4 w-4' />
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-4 w-4' />
        <Skeleton className='h-4 w-24' />
      </div>

      {/* Product Main Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Product Images */}
        <div className='space-y-4'>
          <Skeleton className='h-96 w-full rounded-lg' />
          <div className='grid grid-cols-4 gap-2'>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className='h-20 w-full rounded-lg' />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-3/4' />
            <div className='flex items-center gap-2'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-5 w-16' />
            </div>
          </div>

          {/* Price */}
          <div className='space-y-2'>
            <Skeleton className='h-8 w-32' />
            <Skeleton className='h-5 w-20' />
          </div>

          {/* Options */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Skeleton className='h-5 w-16' />
              <div className='flex gap-2'>
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className='h-10 w-16 rounded-full' />
                ))}
              </div>
            </div>

            <div className='space-y-2'>
              <Skeleton className='h-5 w-16' />
              <div className='flex gap-2'>
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className='h-10 w-16 rounded-full' />
                ))}
              </div>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-10 w-32' />
            </div>

            <div className='flex gap-3'>
              <Skeleton className='h-12 w-32' />
              <Skeleton className='h-12 w-32' />
            </div>
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Skeleton className='h-5 w-24' />
            <div className='space-y-2'>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className='h-4 w-full' />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className='space-y-4'>
        <Skeleton className='h-6 w-32' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='flex justify-between py-2 border-b'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-32' />
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-10 w-32' />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Rating Summary */}
          <div className='space-y-4'>
            <div className='text-center space-y-2'>
              <Skeleton className='h-12 w-24 mx-auto' />
              <Skeleton className='h-5 w-32 mx-auto' />
            </div>
            <div className='space-y-2'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-16' />
                  <Skeleton className='h-2 flex-1' />
                  <Skeleton className='h-4 w-12' />
                </div>
              ))}
            </div>
          </div>

          {/* Review List */}
          <div className='lg:col-span-2 space-y-4'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='border rounded-lg p-4 space-y-3'>
                <div className='flex items-center justify-between'>
                  <Skeleton className='h-5 w-32' />
                  <Skeleton className='h-4 w-16' />
                </div>
                <Skeleton className='h-4 w-20' />
                <div className='space-y-2'>
                  {[...Array(2)].map((_, j) => (
                    <Skeleton key={j} className='h-4 w-full' />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className='space-y-4'>
        <Skeleton className='h-6 w-48' />
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='space-y-3'>
              <Skeleton className='h-40 w-full rounded-lg' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-6 w-20' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className='group relative bg-card rounded-lg border overflow-hidden transition-all hover:shadow-md'>
      {/* Image */}
      <div className='aspect-square overflow-hidden'>
        <Skeleton className='h-full w-full' />
      </div>

      {/* Content */}
      <div className='p-4 space-y-3'>
        {/* Title */}
        <Skeleton className='h-4 w-3/4' />

        {/* Rating */}
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-16' />
        </div>

        {/* Price */}
        <Skeleton className='h-6 w-24' />

        {/* Actions */}
        <div className='flex gap-2'>
          <Skeleton className='h-9 flex-1' />
          <Skeleton className='h-9 w-9' />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({
  columns = 4,
  rows = 2,
}: {
  columns?: number
  rows?: number
}) {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-6 w-48' />
      <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-4`}>
        {[...Array(columns * rows)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
