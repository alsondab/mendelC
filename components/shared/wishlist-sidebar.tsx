'use client'

import { useWishlistStore } from '@/hooks/use-wishlist-store'
import { useWishlistSliderStore } from '@/hooks/use-wishlist-slider-store'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import Image from 'next/image'
import { Heart, X, ShoppingCart } from 'lucide-react'
import ProductPrice from './product/product-price'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import {
  slideFromRight,
  overlayVariants,
  buttonVariants as btnVariants,
} from '@/lib/utils/animations'
import { useToast } from '@/hooks/use-toast'
import useIsMounted from '@/hooks/use-is-mounted'

export default function WishlistSidebar() {
  const { items: wishlist, removeItem } = useWishlistStore()
  const { isOpen, close } = useWishlistSliderStore()
  const { toast } = useToast()
  const isMounted = useIsMounted()
  const t = useTranslations()

  // Fermer le slider avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, close])

  // Empêcher le scroll du body quand le slider est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
    toast({
      title: t('Wishlist.Removed'),
      description: t('Wishlist.RemovedDescription'),
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            variants={overlayVariants as any}
            initial='hidden'
            animate='visible'
            exit='exit'
            onClick={close}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]'
          />

          {/* Slider */}
          <motion.div
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            variants={slideFromRight as any}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='fixed right-0 top-0 bottom-16 md:bottom-0 z-[55] w-[280px] sm:w-[320px] md:w-[400px] bg-background border-l border-border shadow-2xl flex flex-col'
            role='dialog'
            aria-modal='true'
            aria-labelledby='wishlist-title'
          >
            {/* Header avec bouton de fermeture */}
            <div className='flex items-center justify-between p-3 sm:p-4 border-b border-border flex-shrink-0'>
              <div className='flex items-center gap-1.5 sm:gap-2 min-w-0'>
                <Heart
                  className='h-4 w-4 sm:h-5 sm:w-5 text-red-500 fill-red-500 flex-shrink-0'
                  aria-hidden='true'
                />
                <h2
                  id='wishlist-title'
                  className='text-sm sm:text-base font-bold text-foreground truncate'
                >
                  {t('Wishlist.Title')}
                </h2>
              </div>
              <motion.button
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                variants={btnVariants as any}
                initial='rest'
                whileHover='hover'
                whileTap='tap'
                onClick={close}
                className='p-1.5 sm:p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[44px] min-h-[44px]'
                aria-label={t('Common.Close')}
                type='button'
              >
                <X
                  className='h-4 w-4 sm:h-5 sm:w-5 text-foreground'
                  aria-hidden='true'
                />
              </motion.button>
            </div>

            {/* Contenu */}
            {!isMounted || wishlist.length === 0 ? (
              <div className='flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center'>
                <Heart
                  className='h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-3 sm:mb-4'
                  aria-hidden='true'
                />
                <h3 className='text-sm sm:text-base font-semibold text-foreground mb-1.5 sm:mb-2 px-2'>
                  {t('Wishlist.Empty.Title')}
                </h3>
                <p className='text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 px-2 sm:px-4'>
                  {t('Wishlist.Empty.Description')}
                </p>
                <Button
                  onClick={close}
                  asChild
                  size='sm'
                  className='min-h-[44px]'
                >
                  <Link href='/'>{t('Common.Continue Shopping')}</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Liste des favoris */}
                <ScrollArea className='flex-1 px-3 sm:p-4 sidebar-scroll'>
                  <div className='py-2 space-y-2'>
                    {wishlist.map((item) => (
                      <div
                        key={item._id}
                        className='space-y-1.5 pb-2 border-b last:border-0'
                      >
                        <div className='flex gap-2'>
                          {/* Image */}
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={close}
                            className='flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg'
                            aria-label={`${item.name} - ${t('Common.View')}`}
                          >
                            <div className='relative w-12 h-12 sm:w-14 sm:h-14 bg-muted rounded-lg overflow-hidden'>
                              {item.image && item.image.trim() !== '' ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes='(max-width: 640px) 48px, 56px'
                                  className='object-cover'
                                  loading='lazy'
                                  decoding='async'
                                />
                              ) : (
                                <div
                                  className='w-full h-full bg-muted flex items-center justify-center'
                                  aria-hidden='true'
                                >
                                  <Heart className='h-4 w-4 text-muted-foreground' />
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Détails */}
                          <div className='flex-1 min-w-0'>
                            <Link
                              href={`/product/${item.slug}`}
                              onClick={close}
                              className='block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded'
                            >
                              <h3 className='font-semibold text-xs text-foreground line-clamp-2 hover:text-primary transition-colors mb-0.5'>
                                {item.name}
                              </h3>
                            </Link>
                            <div className='mb-0.5'>
                              <ProductPrice price={item.price} />
                            </div>
                            <div className='mb-0.5 text-xs'>
                              {item.countInStock > 0 ? (
                                <span className='text-green-600'>
                                  {t('Wishlist.InStock')}
                                </span>
                              ) : (
                                <span className='text-red-600'>
                                  {t('Wishlist.OutOfStock')}
                                </span>
                              )}
                            </div>
                            <div className='flex items-center gap-1.5 mt-1.5'>
                              {item.countInStock > 0 && (
                                <Button
                                  size='sm'
                                  variant='default'
                                  className='flex-1 h-7 text-xs min-h-[32px] focus:ring-2 focus:ring-primary focus:ring-offset-2'
                                  asChild
                                >
                                  <Link
                                    href={`/product/${item.slug}`}
                                    onClick={close}
                                  >
                                    <ShoppingCart
                                      className='h-3.5 w-3.5 mr-1'
                                      aria-hidden='true'
                                    />
                                    <span className='hidden xs:inline'>
                                      {t('Wishlist.View')}
                                    </span>
                                  </Link>
                                </Button>
                              )}
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleRemoveItem(item._id)}
                                className={cn(
                                  'h-7 w-7 p-0 flex-1 sm:flex-initial min-h-[32px] min-w-[32px] focus:ring-2 focus:ring-destructive focus:ring-offset-2',
                                  'text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20'
                                )}
                                aria-label={`${t('Wishlist.Remove')} ${item.name}`}
                                type='button'
                              >
                                <Heart
                                  className='h-3.5 w-3.5 fill-red-600'
                                  aria-hidden='true'
                                />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className='border-t border-border p-3 sm:p-4 flex-shrink-0'>
                  <div className='text-center text-xs sm:text-sm text-muted-foreground mb-2'>
                    {wishlist.length}{' '}
                    {wishlist.length === 1
                      ? t('Wishlist.Item')
                      : t('Wishlist.Items')}
                  </div>
                  <Button
                    onClick={close}
                    variant='outline'
                    className='w-full h-8 text-xs min-h-[32px] focus:ring-2 focus:ring-primary focus:ring-offset-2'
                    asChild
                  >
                    <Link href='/'>{t('Common.Continue Shopping')}</Link>
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
