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
      <div className='flex items-center justify-center mb-6'>
        <div className='flex flex-col items-center space-y-3'>
          <div className='flex items-center space-x-3'>
            <h2 className='text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-in-up'>
              {title}
            </h2>
            <div className='w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full animate-pulse'></div>
          </div>
          <div className='flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1 rounded-full border border-primary/20'>
            <div className='w-2 h-2 rounded-full bg-primary animate-pulse'></div>
            <span className='text-sm text-muted-foreground font-medium'>
              {products.length} produits
            </span>
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
          {products.map((product, index) => (
            <CarouselItem
              key={product.slug}
              className={
                hideDetails
                  ? 'pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6'
                  : 'pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5'
              }
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className='group hover:scale-105 transition-all duration-300 hover:shadow-lg rounded-lg overflow-hidden'>
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
        <CarouselPrevious className='left-0' />
        <CarouselNext className='right-0' />
      </Carousel>
    </div>
  )
}
