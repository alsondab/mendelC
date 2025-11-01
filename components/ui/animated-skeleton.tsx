'use client'

import { Skeleton } from './skeleton'
import { cn } from '@/lib/utils'

interface AnimatedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number
  stagger?: boolean
  className?: string
}

export function AnimatedSkeleton({
  count = 1,
  stagger = false,
  className,
  ...props
}: AnimatedSkeletonProps) {
  const baseClass = cn('animate-pulse bg-muted/60', className)

  if (count <= 1) {
    return <Skeleton className={baseClass} {...props} />
  }

  return (
    <div className={cn('space-y-2', stagger && 'space-y-3')}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className={baseClass}
          style={stagger ? { animationDelay: `${index * 50}ms` } : undefined}
          {...props}
        />
      ))}
    </div>
  )
}
