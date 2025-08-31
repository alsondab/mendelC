'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function SearchPageSkeleton() {
  return (
    <div className='container mx-auto px-4 py-8 space-y-6'>
      {/* Header */}
      <div className='space-y-4'>
        <Skeleton className='h-8 w-64' />
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-4' />
          <Skeleton className='h-4 w-20' />
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
        {/* Sidebar Filters */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Department Filter */}
          <div className='bg-card rounded-lg border p-4 space-y-4'>
            <Skeleton className='h-5 w-24' />
            <div className='space-y-2'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-4' />
                  <Skeleton className='h-4 w-20' />
                </div>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className='bg-card rounded-lg border p-4 space-y-4'>
            <Skeleton className='h-5 w-20' />
            <div className='space-y-3'>
              <Skeleton className='h-10 w-full' />
              <div className='flex gap-2'>
                <Skeleton className='h-10 flex-1' />
                <Skeleton className='h-10 flex-1' />
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className='bg-card rounded-lg border p-4 space-y-4'>
            <Skeleton className='h-5 w-24' />
            <div className='space-y-2'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-4 w-16' />
                </div>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div className='bg-card rounded-lg border p-4 space-y-4'>
            <Skeleton className='h-5 w-16' />
            <div className='flex flex-wrap gap-2'>
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className='h-8 w-20 rounded-full' />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='lg:col-span-3 space-y-6'>
          {/* Sort and Results Count */}
          <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
            <Skeleton className='h-4 w-32' />
            <div className='flex gap-3'>
              <Skeleton className='h-10 w-40' />
              <Skeleton className='h-10 w-32' />
            </div>
          </div>

          {/* Products Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className='bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow'
              >
                {/* Product Image */}
                <div className='aspect-square overflow-hidden'>
                  <Skeleton className='h-full w-full' />
                </div>

                {/* Product Info */}
                <div className='p-4 space-y-3'>
                  <Skeleton className='h-4 w-3/4' />
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-4 w-16' />
                  </div>
                  <Skeleton className='h-6 w-24' />
                  <div className='flex gap-2'>
                    <Skeleton className='h-9 flex-1' />
                    <Skeleton className='h-9 w-9' />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-center'>
            <div className='flex gap-2'>
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className='h-10 w-10' />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CategoryPageSkeleton() {
  return (
    <div className='container mx-auto px-4 py-8 space-y-8'>
      {/* Category Header */}
      <div className='text-center space-y-4'>
        <Skeleton className='h-12 w-64 mx-auto' />
        <Skeleton className='h-5 w-96 mx-auto' />
      </div>

      {/* Category Description */}
      <div className='max-w-3xl mx-auto text-center space-y-4'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4 mx-auto' />
        <Skeleton className='h-4 w-1/2 mx-auto' />
      </div>

      {/* Featured Products */}
      <div className='space-y-6'>
        <div className='text-center'>
          <Skeleton className='h-8 w-48 mx-auto' />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className='bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow'
            >
              <div className='aspect-square overflow-hidden'>
                <Skeleton className='h-full w-full' />
              </div>
              <div className='p-4 space-y-3'>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-6 w-24' />
                <Skeleton className='h-9 w-full' />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      <div className='space-y-6'>
        <div className='text-center'>
          <Skeleton className='h-8 w-40 mx-auto' />
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          {[...Array(12)].map((_, i) => (
            <div key={i} className='text-center space-y-3'>
              <Skeleton className='h-20 w-20 mx-auto rounded-lg' />
              <Skeleton className='h-4 w-16 mx-auto' />
            </div>
          ))}
        </div>
      </div>

      {/* Category Stats */}
      <div className='bg-card rounded-lg border p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='space-y-2'>
              <Skeleton className='h-8 w-16 mx-auto' />
              <Skeleton className='h-5 w-24 mx-auto' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SearchResultsSkeleton({
  productsCount = 12,
}: {
  productsCount?: number
}) {
  return (
    <div className='space-y-6'>
      {/* Results Header */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-4 w-32' />
        </div>
        <div className='flex gap-3'>
          <Skeleton className='h-10 w-40' />
          <Skeleton className='h-10 w-32' />
        </div>
      </div>

      {/* Products Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {[...Array(productsCount)].map((_, i) => (
          <div
            key={i}
            className='bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow'
          >
            <div className='aspect-square overflow-hidden'>
              <Skeleton className='h-full w-full' />
            </div>
            <div className='p-4 space-y-3'>
              <Skeleton className='h-4 w-3/4' />
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-16' />
              </div>
              <Skeleton className='h-6 w-24' />
              <div className='flex gap-2'>
                <Skeleton className='h-9 flex-1' />
                <Skeleton className='h-9 w-9' />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More or Pagination */}
      <div className='flex justify-center'>
        <Skeleton className='h-10 w-32' />
      </div>
    </div>
  )
}
