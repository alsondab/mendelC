'use client'

import Image from 'next/image'
import { useState } from 'react'
import { toSlug } from '@/lib/utils'

interface CategoryImageProps {
  category: string
  className?: string
  alt?: string
}

export default function CategoryImage({
  category,
  className = '',
  alt,
}: CategoryImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(`/images/${toSlug(category)}.jpg`)

  const handleImageError = () => {
    if (!imageError) {
      // Essayer avec l'URL complète si l'image locale échoue
      setImageSrc(
        `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/images/${toSlug(category)}.jpg`
      )
      setImageError(true)
    } else {
      // Si les deux échouent, utiliser une image par défaut
      setImageSrc('/images/placeholder-category.jpg')
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageSrc}
        alt={alt || `${category} category`}
        width={200}
        height={200}
        className='w-full h-full object-cover rounded-lg'
        onError={handleImageError}
        priority
      />
      {imageError && imageSrc.includes('placeholder') && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg'>
          <span className='text-gray-500 text-sm font-medium text-center px-2'>
            {category}
          </span>
        </div>
      )}
    </div>
  )
}
