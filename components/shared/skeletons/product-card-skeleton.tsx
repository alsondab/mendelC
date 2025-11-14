/**
 * ⚡ Optimization: Skeleton loader pour ProductCard avec dimensions fixes
 * Réduit le CLS (Cumulative Layout Shift) en réservant l'espace avant le chargement
 */
export function ProductCardSkeleton() {
  return (
    <div className="w-full h-full space-y-2 p-2 xs:p-3 sm:p-4">
      {/* Image skeleton - Dimensions fixes pour éviter CLS */}
      <div className="relative w-full h-32 xs:h-40 sm:h-48 lg:h-52 bg-muted rounded-lg animate-pulse" />

      {/* Content skeleton */}
      <div className="space-y-2">
        {/* Title skeleton */}
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />

        {/* Price skeleton */}
        <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />

        {/* Rating skeleton */}
        <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
      </div>
    </div>
  )
}
