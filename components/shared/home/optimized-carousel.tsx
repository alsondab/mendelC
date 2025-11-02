'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ICarousel } from '@/types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

type AutoplayType = ReturnType<typeof import('embla-carousel-autoplay').default>

export function OptimizedHomeCarousel({ items }: { items: ICarousel[] }) {
  const [isCarouselReady, setIsCarouselReady] = React.useState(false)
  const autoplayRef = React.useRef<AutoplayType | null>(null)
  const t = useTranslations('Home')

  React.useEffect(() => {
    // Lazy load Autoplay plugin après le premier rendu
    const timer = setTimeout(() => {
      import('embla-carousel-autoplay').then((module) => {
        autoplayRef.current = module.default({
          delay: 3000,
          stopOnInteraction: true,
        })
        setIsCarouselReady(true)
      })
    }, 100) // Petit délai pour permettre au LCP de se charger d'abord

    return () => clearTimeout(timer)
  }, [])

  const firstItem = items[0]

  // Affiche la première image immédiatement pour le LCP
  if (!isCarouselReady) {
    return (
      <div className='w-full mx-auto'>
        {firstItem && (
          <Link href={firstItem.url}>
            <div className='flex aspect-[16/6] items-center justify-center p-6 relative -m-1'>
              {firstItem.image && firstItem.image.trim() !== '' ? (
                <Image
                  src={firstItem.image}
                  alt={firstItem.title}
                  fill
                  className='object-cover'
                  priority
                  quality={85}
                  sizes='(max-width: 768px) 100vw, 1200px'
                  fetchPriority='high'
                />
              ) : (
                <div className='w-full h-full bg-muted flex items-center justify-center'>
                  <span className='text-muted-foreground'>{t('No image')}</span>
                </div>
              )}
            </div>
          </Link>
        )}
      </div>
    )
  }

  // Une fois le carousel prêt, affiche le carousel complet
  return (
    <Carousel
      dir='ltr'
      plugins={autoplayRef.current ? [autoplayRef.current] : []}
      className='w-full mx-auto'
      onMouseEnter={() => autoplayRef.current?.stop?.()}
      onMouseLeave={() => autoplayRef.current?.reset?.()}
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={`${item.title}-${index}`}>
            <Link href={item.url}>
              <div className='flex aspect-[16/6] items-center justify-center p-6 relative -m-1'>
                {item.image && item.image.trim() !== '' ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className='object-cover'
                    priority={index === 0}
                    loading={index === 0 ? undefined : 'lazy'}
                    quality={index === 0 ? 85 : 70}
                    sizes='(max-width: 768px) 100vw, 1200px'
                    fetchPriority={index === 0 ? 'high' : 'low'}
                  />
                ) : (
                  <div className='w-full h-full bg-muted flex items-center justify-center'>
                    <span className='text-muted-foreground'>
                      {t('No image')}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
