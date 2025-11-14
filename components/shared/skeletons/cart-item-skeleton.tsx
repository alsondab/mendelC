/**
 * ⚡ Optimization: Skeleton loader pour CartItem avec dimensions fixes
 * Réduit le CLS (Cumulative Layout Shift) en réservant l'espace avant le chargement
 */
export function CartItemSkeleton() {
  return (
    <div className="space-y-1.5 pb-2 border-b last:border-0">
      <div className="flex gap-2">
        {/* Image skeleton - Dimensions fixes */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-muted rounded-lg animate-pulse flex-shrink-0" />

        {/* Content skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title skeleton */}
          <div className="h-3 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />

          {/* Price skeleton */}
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />

          {/* Actions skeleton */}
          <div className="flex items-center gap-1.5">
            <div className="h-7 w-20 bg-muted rounded animate-pulse" />
            <div className="h-7 w-7 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
