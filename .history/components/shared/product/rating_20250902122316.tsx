import React from 'react'
import { Star } from 'lucide-react'

export default function Rating({
  rating = 0,
  size = 'sm',
}: {
  rating: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
}) {
  const fullStars = Math.floor(rating)
  const partialStar = rating % 1
  const emptyStars = 5 - Math.ceil(rating)

  // Définir les tailles responsive
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-3 h-3 xs:w-4 xs:h-4',
    md: 'w-4 h-4 xs:w-5 xs:h-5',
    lg: 'w-5 h-5 xs:w-6 xs:h-6',
  }

  const starSize = sizeClasses[size]

  return (
    <div
      className='flex items-center gap-0.5'
      aria-label={`Rating: ${rating} out of 5 stars`}
    >
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={`${starSize} fill-primary text-primary`}
        />
      ))}
      {partialStar > 0 && (
        <div className='relative'>
          <Star className={`${starSize} text-primary`} />
          <div
            className='absolute top-0 left-0 overflow-hidden'
            style={{ width: `${partialStar * 100}%` }}
          >
            <Star className={`${starSize} fill-primary text-primary`} />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={`${starSize} text-primary`} />
      ))}
    </div>
  )
}
