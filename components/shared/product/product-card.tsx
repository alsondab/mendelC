'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import type { Variants } from 'framer-motion'

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
  const [motionReady, setMotionReady] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [MotionDiv, setMotionDiv] = useState<any>(null)
  const [scale, setScale] = useState<Variants | null>(null)

  useEffect(() => {
    // Lazy load framer-motion après le premier rendu pour réduire TBT
    Promise.all([
      import('framer-motion').then((mod) => mod.motion),
      import('@/lib/utils/animations').then((mod) => mod.scale),
    ]).then(([motion, scaleAnim]) => {
      setMotionDiv(() => motion.div)
      setScale(scaleAnim)
      setMotionReady(true)
    })
  }, [])

  const ProductImage = () => (
    <Link href={`/product/${product.slug}`}>
      <div className='relative h-32 xs:h-40 sm:h-48 lg:h-52'>
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
              brand: product.brand || '',
              category: product.category || '',
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
              // ⚡ Optimization: Sizes optimisé pour responsive
              sizes='(max-width: 320px) 50vw, (max-width: 480px) 60vw, (max-width: 768px) 40vw, 20vw'
              className='object-contain'
              // ⚡ Optimization: Lazy loading pour toutes les images produits (hors écran initial)
              loading='lazy'
              // ⚡ Optimization: Qualité réduite pour réduire la taille (65 au lieu de 75)
              quality={65}
              // ⚡ Optimization: Décodage asynchrone pour améliorer le TBT
              decoding='async'
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

  // Fallback sans animation si framer-motion n'est pas encore chargé
  const CardWrapper = motionReady && MotionDiv ? MotionDiv : 'div'
  const motionProps =
    motionReady && scale
      ? {
          variants: scale,
          initial: 'hidden',
          whileInView: 'visible',
          viewport: { once: true, margin: '-50px' },
          whileHover: hideBorder ? { scale: 1.02 } : { scale: 1.02, y: -4 },
          whileTap: { scale: 0.98 },
          transition: { type: 'spring', stiffness: 300, damping: 30 },
        }
      : {}

  return hideBorder ? (
    <CardWrapper className='flex flex-col group' {...motionProps}>
      <ProductImage />
      {!hideDetails && (
        <>
          <div className='p-2 xs:p-3 sm:p-4 flex-1 text-center space-y-2 xs:space-y-3'>
            <ProductDetails />
          </div>
          {!hideAddToCart && <AddButton />}
        </>
      )}
    </CardWrapper>
  ) : (
    <CardWrapper {...motionProps}>
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
    </CardWrapper>
  )
}

export default ProductCard
