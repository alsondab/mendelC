import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { IProduct } from '@/lib/db/models/product.model'

import Rating from './rating'
import { formatNumber, generateId, round2 } from '@/lib/utils'
import ProductPrice from './product-price'
import ImageHover from './image-hover'
import AddToCart from './add-to-cart'
import WishlistButton from './wishlist-button'

const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = false,
}: {
  product: IProduct
  hideDetails?: boolean
  hideBorder?: boolean
  hideAddToCart?: boolean
}) => {
  const ProductImage = () => (
    <Link href={`/product/${product.slug}`}>
      <div className='relative h-32 xs:h-40 sm:h-48 lg:h-52'>
        {/* Badge de réduction en haut à gauche */}
        {/* Badge de réduction */}
        {product.listPrice > 0 && product.listPrice > product.price && (
          <div className='absolute top-1 left-1 sm:top-2 sm:left-2 z-10'>
            <span className='bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg'>
              -{Math.round(100 - (product.price / product.listPrice) * 100)}%
            </span>
          </div>
        )}

        {/* Bouton Wishlist */}
        <div className='absolute top-1 right-1 sm:top-2 sm:right-2 z-10'>
          <WishlistButton 
            productId={product._id} 
            product={{
              _id: product._id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              image: product.images[0] || '',
              countInStock: product.countInStock,
            }}
            size='sm' 
          />
        </div>

        {product.images.length > 1 &&
        product.images[0] &&
        product.images[1] &&
        product.images[0].trim() !== '' &&
        product.images[1].trim() !== '' ? (
          <ImageHover
            src={product.images[0]}
            hoverSrc={product.images[1]}
            alt={product.name}
          />
        ) : product.images[0] && product.images[0].trim() !== '' ? (
          <div className='relative h-32 xs:h-40 sm:h-48 lg:h-52'>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes='(max-width: 320px) 50vw, (max-width: 480px) 60vw, (max-width: 768px) 40vw, 20vw'
              className='object-contain'
            />
          </div>
        ) : (
          <div className='relative h-32 xs:h-40 sm:h-48 lg:h-52 bg-muted flex items-center justify-center'>
            <span className='text-muted-foreground text-xs sm:text-sm'>
              Aucune image
            </span>
          </div>
        )}
      </div>
    </Link>
  )
  const ProductDetails = () => (
    <div className='flex-1 space-y-1 sm:space-y-2'>
      <p className='font-bold text-xs sm:text-sm truncate'>{product.brand}</p>
      <Link
        href={`/product/${product.slug}`}
        className='overflow-hidden text-ellipsis text-xs sm:text-sm line-clamp-2 block'
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {product.name}
      </Link>
      <div className='flex gap-1 sm:gap-2 justify-center items-center'>
        <Rating rating={product.avgRating} size='xs' />
        <span className='text-xs'>({formatNumber(product.numReviews)})</span>
      </div>

      <ProductPrice
        isDeal={product.tags.includes('todays-deal')}
        price={product.price}
        listPrice={product.listPrice}
      />
    </div>
  )
  const AddButton = () => (
    <div className='w-full text-center'>
      <AddToCart
        minimal
        item={{
          clientId: generateId(),
          product: product._id,
          color: product.colors[0],
          countInStock: product.countInStock,
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: round2(product.price),
          quantity: 1,
          image: product.images[0],
        }}
      />
    </div>
  )

  return hideBorder ? (
    <div className='flex flex-col group'>
      <ProductImage />
      {!hideDetails && (
        <>
          <div className='p-2 xs:p-3 sm:p-4 flex-1 text-center space-y-2 xs:space-y-3'>
            <ProductDetails />
          </div>
          {!hideAddToCart && <AddButton />}
        </>
      )}
    </div>
  ) : (
    <Card className='flex flex-col group hover:shadow-lg transition-shadow duration-200'>
      <CardHeader className='p-2 xs:p-3 sm:p-4'>
        <ProductImage />
      </CardHeader>
      {!hideDetails && (
        <>
          <CardContent className='p-2 xs:p-3 sm:p-4 flex-1 text-center space-y-2 xs:space-y-3'>
            <ProductDetails />
          </CardContent>
          <CardFooter className='p-2 xs:p-3 sm:p-4 pt-0'>
            {!hideAddToCart && <AddButton />}
          </CardFooter>
        </>
      )}
    </Card>
  )
}

export default ProductCard
