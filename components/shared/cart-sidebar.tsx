'use client'

import useCartStore from '@/hooks/use-cart-store'
import useCartSliderStore from '@/hooks/use-cart-slider-store'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import Image from 'next/image'
import { Trash2, X, ShoppingCart, ArrowRight, Plus, Minus } from 'lucide-react'
import useSettingStore from '@/hooks/use-setting-store'
import ProductPrice from './product/product-price'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import {
  slideFromRight,
  overlayVariants,
  buttonVariants as btnVariants,
} from '@/lib/utils/animations'
import { useRouter } from 'next/navigation'
import { round2 } from '@/lib/utils'

export default function CartSidebar() {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore()
  const { isOpen, close } = useCartSliderStore()
  const router = useRouter()
  const {
    setting: {
      common: {},
    },
  } = useSettingStore()

  const t = useTranslations()

  // Calculer le prix localement pour une mise à jour instantanée
  const calculatedItemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )
  const displayPrice = itemsPrice > 0 ? itemsPrice : calculatedItemsPrice

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

  const handleCheckout = () => {
    close()
    router.push('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            onClick={close}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]'
          />

          {/* Slider */}
          <motion.div
            variants={slideFromRight}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='fixed right-0 top-0 bottom-16 md:bottom-0 z-[55] w-[280px] sm:w-[320px] md:w-[400px] bg-background border-l border-border shadow-2xl flex flex-col'
            role='dialog'
            aria-modal='true'
            aria-labelledby='cart-title'
          >
            {/* Header avec bouton de fermeture */}
            <div className='flex items-center justify-between p-3 sm:p-4 border-b border-border flex-shrink-0'>
              <div className='flex items-center gap-1.5 sm:gap-2 min-w-0'>
                <ShoppingCart
                  className='h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0'
                  aria-hidden='true'
                />
                <h2
                  id='cart-title'
                  className='text-sm sm:text-base font-bold text-foreground truncate'
                >
                  {t('Cart.Shopping Cart')}
                </h2>
              </div>
              <motion.button
                variants={btnVariants}
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
            {items.length === 0 ? (
              <div className='flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center'>
                <ShoppingCart
                  className='h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-3 sm:mb-4'
                  aria-hidden='true'
                />
                <h3 className='text-sm sm:text-base font-semibold text-foreground mb-1.5 sm:mb-2 px-2'>
                  {t('Cart.Your Shopping Cart is empty')}
                </h3>
                <p className='text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 px-2'>
                  {t('Cart.Continue shopping on')}
                </p>
                <Button
                  onClick={close}
                  asChild
                  size='sm'
                  className='min-h-[44px]'
                >
                  <Link href='/search'>{t('Common.Continue Shopping')}</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Liste des articles */}
                <ScrollArea className='flex-1 px-3 sm:p-4 sidebar-scroll'>
                  <div className='py-2 space-y-2'>
                    {items.map((item) => (
                      <div
                        key={item.clientId}
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
                                  className='object-contain p-1'
                                  loading='lazy'
                                  decoding='async'
                                />
                              ) : (
                                <div
                                  className='w-full h-full bg-muted flex items-center justify-center'
                                  aria-hidden='true'
                                >
                                  <ShoppingCart className='h-4 w-4 text-muted-foreground' />
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
                            <div className='mt-0.5'>
                              <ProductPrice price={item.price} />
                            </div>
                            <div className='mt-1 flex items-center gap-1.5'>
                              <div className='flex items-center border border-border rounded-md overflow-hidden'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      updateItem(item, item.quantity - 1)
                                    }
                                  }}
                                  disabled={item.quantity <= 1}
                                  className='h-7 w-7 p-0 min-h-[32px] min-w-[32px] rounded-none hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed'
                                  aria-label={t('Cart.Decrease quantity')}
                                  type='button'
                                >
                                  <Minus
                                    className='h-3.5 w-3.5'
                                    aria-hidden='true'
                                  />
                                </Button>
                                <span className='min-w-[32px] text-xs font-medium text-center px-2 py-1.5'>
                                  {item.quantity}
                                </span>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => {
                                    if (item.quantity < item.countInStock) {
                                      updateItem(item, item.quantity + 1)
                                    }
                                  }}
                                  disabled={item.quantity >= item.countInStock}
                                  className='h-7 w-7 p-0 min-h-[32px] min-w-[32px] rounded-none hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed'
                                  aria-label={t('Cart.Increase quantity')}
                                  type='button'
                                >
                                  <Plus
                                    className='h-3.5 w-3.5'
                                    aria-hidden='true'
                                  />
                                </Button>
                              </div>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => removeItem(item)}
                                className='h-7 w-7 p-0 min-h-[32px] min-w-[32px] hover:bg-destructive/10 hover:text-destructive focus:ring-2 focus:ring-destructive'
                                aria-label={`${t('Cart.Delete')} ${item.name}`}
                                type='button'
                              >
                                <Trash2
                                  className='h-3.5 w-3.5'
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

                {/* Footer avec total et checkout */}
                <div className='border-t border-border p-3 sm:p-4 space-y-2 flex-shrink-0'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm sm:text-base font-semibold text-foreground'>
                      {t('Cart.Subtotal')}
                    </span>
                    <span className='text-base sm:text-lg font-bold text-primary'>
                      <ProductPrice price={displayPrice} plain />
                    </span>
                  </div>
                  <Separator />
                  <div className='space-y-2'>
                    <Button
                      onClick={handleCheckout}
                      size='sm'
                      className='w-full h-9 text-sm font-medium min-h-[36px] focus:ring-2 focus:ring-primary focus:ring-offset-2'
                      aria-label={t('Cart.Proceed to Checkout')}
                    >
                      <div className='flex items-center gap-1.5'>
                        <span>{t('Cart.Proceed to Checkout')}</span>
                        <ArrowRight className='h-4 w-4' aria-hidden='true' />
                      </div>
                    </Button>
                    <Button
                      onClick={close}
                      variant='outline'
                      className='w-full h-8 text-xs min-h-[32px] focus:ring-2 focus:ring-primary focus:ring-offset-2'
                      asChild
                    >
                      <Link href='/search'>{t('Common.Continue Shopping')}</Link>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
