/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Image from 'next/image'
import { useState } from 'react'

const ImageHover = ({
  src,
  hoverSrc,
  alt,
}: {
  src: string
  hoverSrc: string
  alt: string
}) => {
  const [isHovered, setIsHovered] = useState(false)
  let hoverTimeout: any

  // Vérifier que les sources ne sont pas vides
  if (!src || !hoverSrc || src.trim() === '' || hoverSrc.trim() === '') {
    return (
      <div className='relative h-40 xs:h-48 sm:h-52 bg-muted flex items-center justify-center'>
        <span className='text-muted-foreground text-xs xs:text-sm'>
          Aucune image
        </span>
      </div>
    )
  }

  const handleMouseEnter = () => {
    hoverTimeout = setTimeout(() => setIsHovered(true), 1000) // 1 second delay
  }

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout)
    setIsHovered(false)
  }

  return (
    <div
      className='relative h-40 xs:h-48 sm:h-52'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={src}
        alt={alt}
        fill
        // ⚡ Optimization: Sizes précis pour correspondre aux dimensions réelles (266x280px max)
        sizes='(max-width: 320px) 160px, (max-width: 480px) 192px, (max-width: 768px) 208px, 280px'
        className={`object-contain transition-opacity duration-500 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}
        // ⚡ Optimization: Lazy loading pour les images produits
        loading='lazy'
        // ⚡ Optimization: Qualité réduite pour réduire la taille (économie ~15.5 KiB)
        quality={70}
      />
      <Image
        src={hoverSrc}
        alt={alt}
        fill
        // ⚡ Optimization: Sizes précis pour correspondre aux dimensions réelles
        sizes='(max-width: 320px) 160px, (max-width: 480px) 192px, (max-width: 768px) 208px, 280px'
        className={`absolute inset-0 object-contain transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        // ⚡ Optimization: Lazy loading pour les images hover (chargées après interaction)
        loading='lazy'
        // ⚡ Optimization: Qualité réduite pour réduire la taille
        quality={70}
      />
    </div>
  )
}

export default ImageHover
