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
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { ICarousel } from '@/types'

export function HomeCarousel({ items }: { items: ICarousel[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  const t = useTranslations('Home')

  return (
    <Carousel
      dir='ltr'
      plugins={[plugin.current]}
      className='w-full mx-auto '
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={`${item.title}-${index}`}>
            <Link href={item.url}>
              <div className='flex aspect-[16/6] items-center justify-center p-6 relative -m-1'>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className='object-cover'
                  priority
                />
                <div className='absolute w-2/3 xs:w-1/2 sm:w-2/5 md:w-1/3 left-2 xs:left-4 sm:left-8 md:left-16 lg:left-32 top-1/2 transform -translate-y-1/2'>
                  <h2
                    className={cn(
                      'text-sm xs:text-base sm:text-lg md:text-2xl lg:text-4xl xl:text-6xl font-bold mb-2 xs:mb-3 sm:mb-4 text-primary leading-tight'
                    )}
                  >
                    {t(`${item.title}`)}
                  </h2>
                  <Button
                    size='sm'
                    className='text-xs xs:text-sm sm:text-base hidden xs:inline-flex'
                  >
                    {t(`${item.buttonCaption}`)}
                  </Button>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='left-0 md:left-12' />
      <CarouselNext className='right-0 md:right-12' />
    </Carousel>
  )
}
