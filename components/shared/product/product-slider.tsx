'use client'

import * as React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import ProductCard from './product-card'
import { IProduct } from '@/lib/db/models/product.model'

export default function ProductSlider({
  title,
  products,
  hideDetails = false,
}: {
  title?: string
  products: IProduct[]
  hideDetails?: boolean
}) {
  return (
    <div className='w-full bg-background'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4'>
        <h2 className='text-lg sm:text-xl font-semibold text-foreground'>
          {title}
        </h2>
        <span className='text-sm text-muted-foreground'>
          {products.length} produits
        </span>
      </div>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
          dragFree: true,
          containScroll: 'trimSnaps',
          slidesToScroll: 1,
        }}
        className='w-full'
      >
        <CarouselContent className='-ml-2 md:-ml-4'>
          {products.map((product) => (
            <CarouselItem
              key={product.slug}
              className={
                hideDetails
                  ? 'pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6'
                  : 'pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5'
              }
            >
              <ProductCard
                hideDetails={hideDetails}
                hideAddToCart
                hideBorder
                product={product}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Boutons de navigation en bas */}
        <div className='flex justify-center items-center gap-2 mt-4'>
          <CarouselPrevious className='relative translate-y-0 left-0 right-auto h-8 w-8 sm:h-10 sm:w-10' />
          <CarouselNext className='relative translate-y-0 right-0 left-auto h-8 w-8 sm:h-10 sm:w-10' />
        </div>
      </Carousel>
    </div>
  )
}
