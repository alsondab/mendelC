import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function CategoryListSkeleton() {
  return (
    <div className='space-y-4'>
      {/* Search and Filters Skeleton */}
      <Card>
        <CardHeader className='pb-3'>
          <Skeleton className='h-6 w-48' />
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <Skeleton className='h-10 flex-1' />
            <Skeleton className='h-10 w-24' />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table Skeleton */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-6 w-40' />
            <Skeleton className='h-4 w-32' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* Table Header */}
            <div className='grid grid-cols-8 gap-4 border-b pb-2'>
              <Skeleton className='h-4 w-8' />
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-20 hidden sm:block' />
              <Skeleton className='h-4 w-24 hidden md:block' />
              <Skeleton className='h-4 w-20 hidden lg:block' />
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-12' />
              <Skeleton className='h-4 w-16' />
            </div>

            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className='grid grid-cols-8 gap-4 py-2'>
                <Skeleton className='h-4 w-8' />
                <div className='space-y-1'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-3 w-24 sm:hidden' />
                </div>
                <Skeleton className='h-4 w-20 hidden sm:block' />
                <Skeleton className='h-4 w-24 hidden md:block' />
                <Skeleton className='h-4 w-20 hidden lg:block' />
                <Skeleton className='h-6 w-16' />
                <Skeleton className='h-6 w-12' />
                <Skeleton className='h-8 w-8' />
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className='mt-4 flex items-center justify-between'>
            <Skeleton className='h-4 w-24' />
            <div className='flex items-center gap-2'>
              <Skeleton className='h-8 w-20' />
              <Skeleton className='h-8 w-20' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
