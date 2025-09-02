/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Image from 'next/image'
import { useState } from 'react'

const ImageHover = ({
  src,
  hoverSrc,
  alt,
  className = '',
}: {
  src: string
  hoverSrc: string
  alt: string
  className?: string
}) => {
  const [isHovered, setIsHovered] = useState(false)
  let hoverTimeout: any
  const handleMouseEnter = () => {
    hoverTimeout = setTimeout(() => setIsHovered(true), 1000) // 1 second delay
  }

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout)
    setIsHovered(false)
  }

  return (
    <div
      className='relative w-full h-full'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes='80vw'
        className={`object-cover transition-opacity duration-500 ${className} ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <Image
        src={hoverSrc}
        alt={alt}
        fill
        sizes='80vw'
        className={`absolute inset-0 object-cover transition-opacity duration-500 ${className} ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}

export default ImageHover
