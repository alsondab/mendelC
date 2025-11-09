'use client'

import * as React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ICarousel } from '@/types'

export function HomeCarousel({ items }: { items: ICarousel[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  const t = useTranslations('Home')

  return (
    <Carousel
      dir="ltr"
      plugins={[plugin.current]}
      className="w-full mx-auto "
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={`${item.title}-${index}`}>
            <Link href={item.url}>
              <div className="flex aspect-[16/6] items-center justify-center p-6 relative -m-1">
                {item.image && item.image.trim() !== '' ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    // ⚡ Optimization: Priority uniquement pour la première image (LCP)
                    priority={index === 0}
                    // ⚡ Optimization: fetchPriority high pour LCP uniquement
                    fetchPriority={index === 0 ? 'high' : 'low'}
                    // ⚡ Optimization: Sizes optimisé pour le carousel (plein écran)
                    sizes="100vw"
                    // ⚡ Optimization: Lazy loading pour les images suivantes
                    loading={index === 0 ? 'eager' : 'lazy'}
                    // ⚡ Optimization: Qualité réduite pour les images non prioritaires
                    quality={index === 0 ? 90 : 75}
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">
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
