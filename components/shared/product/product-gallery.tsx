'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import 'react-medium-image-zoom/dist/styles.css'

const Zoom = dynamic(() => import('react-medium-image-zoom'), {
  ssr: false,
  loading: () => (
    <div className='flex h-full items-center justify-center rounded-xl bg-muted'>
      <span className='text-sm text-muted-foreground'>Chargement…</span>
    </div>
  ),
})
export default function ProductGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(0)

  // Filtrer les images vides
  const validImages = useMemo(
    () => images.filter((image) => image && image.trim() !== ''),
    [images]
  )

  if (validImages.length === 0) {
    return (
      <div className='flex items-center justify-center h-[500px] bg-muted rounded-lg'>
        <span className='text-muted-foreground'>Aucune image disponible</span>
      </div>
    )
  }

  return (
    <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
      {/* Thumbnail images - hidden on mobile, visible on desktop */}
      <div className='hidden sm:flex flex-col gap-2 mt-8'>
        {validImages.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedImage(index)
            }}
            onMouseOver={() => {
              setSelectedImage(index)
            }}
            className={`bg-white rounded-lg overflow-hidden ${
              selectedImage === index
                ? 'ring-2 ring-blue-500'
                : 'ring-1 ring-gray-300'
            }`}
            aria-label={`Voir l’image ${index + 1}`}
          >
            {image && image.trim() !== '' ? (
              <Image src={image} alt={'product image'} width={48} height={48} />
            ) : (
              <div className='w-12 h-12 bg-muted flex items-center justify-center'>
                <span className='text-xs text-muted-foreground'>No img</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className='w-full'>
        <Zoom zoomMargin={24}>
          <div className='relative h-[250px] xs:h-[300px] sm:h-[400px] lg:h-[500px]'>
            <Image
              src={validImages[selectedImage]}
              alt={'product image'}
              fill
              sizes='(max-width: 475px) 100vw, (max-width: 768px) 80vw, (max-width: 1200px) 50vw, 600px'
              className='object-contain'
              priority={selectedImage === 0}
            />
          </div>
        </Zoom>

        {/* Mobile thumbnail strip */}
        <div className='flex gap-1.5 mt-2 sm:hidden overflow-x-auto pb-2 px-1'>
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(index)
              }}
              className={`flex-shrink-0 bg-white rounded-md overflow-hidden ${
                selectedImage === index
                  ? 'ring-2 ring-blue-500'
                  : 'ring-1 ring-gray-300'
              }`}
              aria-label={`Sélectionner l’image ${index + 1}`}
            >
              {image && image.trim() !== '' ? (
                <Image
                  src={image}
                  alt={'product image'}
                  width={50}
                  height={50}
                />
              ) : (
                <div className='w-12 h-12 bg-muted flex items-center justify-center'>
                  <span className='text-xs text-muted-foreground'>No img</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
