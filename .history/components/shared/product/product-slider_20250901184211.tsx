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
  isBestSelling = false,
}: {
  title?: string
  products: IProduct[]
  hideDetails?: boolean
  isBestSelling?: boolean
}) {
  return (
    <div className={`w-full ${isBestSelling ? 'bg-transparent' : 'bg-background'}`}>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          {isBestSelling && (
            <div className='relative'>
              <div className='w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce'>
                <span className='text-white text-sm font-bold'>🔥</span>
              </div>
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping'></div>
            </div>
          )}
          <h2 className={`text-2xl font-bold ${isBestSelling ? 'bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent' : 'text-foreground'}`}>
            {title}
          </h2>
        </div>
        <div className='flex items-center space-x-2'>
          <div className={`w-2 h-2 rounded-full ${isBestSelling ? 'bg-orange-500' : 'bg-primary'} animate-pulse`}></div>
          <span className='text-sm text-muted-foreground'>
            {products.length} produits
          </span>
        </div>
      </div>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full'
      >
        <CarouselContent className='-ml-2 md:-ml-4'>
          {products.map((product, index) => (
            <CarouselItem
              key={product.slug}
              className={`${
                hideDetails
                  ? 'pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6'
                  : 'pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5'
              } ${isBestSelling ? 'animate-fade-in-up' : ''}`}
              style={isBestSelling ? { animationDelay: `${index * 100}ms` } : {}}
            >
              <div className={`${isBestSelling ? 'group relative' : ''}`}>
                {isBestSelling && (
                  <div className='absolute -top-2 -right-2 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse'>
                    #{index + 1}
                  </div>
                )}
                <ProductCard
                  hideDetails={hideDetails}
                  hideAddToCart
                  hideBorder
                  product={product}
                />
                {isBestSelling && (
                  <div className='absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg'></div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={`${isBestSelling ? 'bg-orange-100 hover:bg-orange-200 border-orange-300' : ''} left-0`} />
        <CarouselNext className={`${isBestSelling ? 'bg-orange-100 hover:bg-orange-200 border-orange-300' : ''} right-0`} />
      </Carousel>
    </div>
  )
}
