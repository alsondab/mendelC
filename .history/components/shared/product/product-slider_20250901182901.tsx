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
  isTodaysDeals = false,
}: {
  title?: string
  products: IProduct[]
  hideDetails?: boolean
  isTodaysDeals?: boolean
}) {
  if (isTodaysDeals) {
    return (
      <div className='w-full bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>🔥</span>
            </div>
            <div>
              <h2 className='text-2xl font-bold text-foreground'>{title}</h2>
              <p className='text-sm text-muted-foreground'>
                Offres limitées dans le temps
              </p>
            </div>
          </div>
        </div>

        <Carousel
          opts={{
            align: 'start',
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-2 md:-ml-4'>
            {products.map((product) => (
              <CarouselItem
                key={product.slug}
                className='pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5'
              >
                <div className='group relative bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-orange-200/50 dark:border-orange-800/50'>
                  {/* Badge de réduction */}
                  <div className='absolute top-2 left-2 z-10'>
                    <span className='bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg'>
                      {Math.round(
                        ((product.listPrice - product.price) /
                          product.listPrice) *
                          100
                      )}
                      % OFF
                    </span>
                  </div>

                  <ProductCard
                    hideDetails={hideDetails}
                    hideAddToCart
                    hideBorder
                    product={product}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='left-2 md:left-4 bg-white/90 dark:bg-gray-900/90 border-orange-200 dark:border-orange-800 hover:bg-white dark:hover:bg-gray-900' />
          <CarouselNext className='right-2 md:right-4 bg-white/90 dark:bg-gray-900/90 border-orange-200 dark:border-orange-800 hover:bg-white dark:hover:bg-gray-900' />
        </Carousel>
      </div>
    )
  }

  return (
    <div className='w-full bg-background'>
      <h2 className='h2-bold mb-5'>{title}</h2>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full'
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.slug}
              className={
                hideDetails
                  ? 'md:basis-1/4 lg:basis-1/6'
                  : 'md:basis-1/3 lg:basis-1/5'
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
        <CarouselPrevious className='left-0' />
        <CarouselNext className='right-0' />
      </Carousel>
    </div>
  )
}
