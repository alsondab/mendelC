'use client'

import useCartStore from '@/hooks/use-cart-store'
import useCartSliderStore from '@/hooks/use-cart-slider-store'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Trash2, X, ShoppingCart, ArrowRight } from 'lucide-react'
import useSettingStore from '@/hooks/use-setting-store'
import ProductPrice from './product/product-price'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

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

  const [shouldRender, setShouldRender] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined
    let frame: number | undefined

    if (isOpen) {
      setShouldRender(true)
      frame = requestAnimationFrame(() => {
        setIsVisible(true)
      })
    } else if (shouldRender) {
      setIsVisible(false)
      timeout = setTimeout(() => {
        setShouldRender(false)
      }, 250)
    }

    return () => {
      if (frame) cancelAnimationFrame(frame)
      if (timeout) clearTimeout(timeout)
    }
  }, [isOpen, shouldRender])

  const handleCheckout = () => {
    close()
    router.push('/checkout')
  }

  if (!shouldRender) {
    return null
  }

  return (
    <>
      <div
        role='presentation'
        onClick={close}
        className={cn(
          'fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-out',
          isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />

      <aside
        className={cn(
          'fixed right-0 top-0 bottom-0 z-[56] flex w-full max-w-[95vw] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out safe-area-inset-bottom xs:max-w-sm sm:w-96 md:w-[420px]',
          isVisible ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header avec bouton de fermeture */}
        <div className='flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-border flex-shrink-0 safe-area-inset-top'>
          <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
            <ShoppingCart className='h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0' />
            <h2 className='text-lg sm:text-xl font-bold text-foreground truncate'>
              {t('Cart.Shopping Cart')}
            </h2>
          </div>
          <button
            onClick={close}
            className='flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors duration-200 hover:bg-muted'
            aria-label={t('Common.Close')}
          >
            <X className='h-5 w-5 text-foreground' />
          </button>
        </div>

        {/* Contenu */}
        {items.length === 0 ? (
          <div className='flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center'>
            <ShoppingCart className='h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground mb-4' />
            <h3 className='text-lg sm:text-xl font-semibold text-foreground mb-2 px-2'>
              {t('Cart.Your Shopping Cart is empty')}
            </h3>
            <p className='text-sm sm:text-base text-muted-foreground mb-6 px-2'>
              {t('Cart.Continue shopping on')}
            </p>
            <Button onClick={close} asChild className='min-h-[44px]'>
              <Link href='/'>{t('Common.Continue Shopping')}</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Liste des articles - Scrollable */}
            <div className='flex-1 drawer-scroll px-3 sm:px-4 md:px-6 min-h-0'>
              <div className='py-4 space-y-4'>
                {items.map((item) => (
                  <div
                    key={item.clientId}
                    className='space-y-3 pb-4 border-b last:border-0'
                  >
                    <div className='flex gap-3 sm:gap-4'>
                      {/* Image - Aspect Square */}
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={close}
                        className='flex-shrink-0'
                      >
                        <div className='relative w-20 h-20 sm:w-24 sm:h-24 aspect-square bg-muted rounded-lg overflow-hidden'>
                          {item.image && item.image.trim() !== '' ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes='(max-width: 640px) 80px, 96px'
                              className='object-cover'
                            />
                          ) : (
                            <div className='w-full h-full bg-muted flex items-center justify-center'>
                              <ShoppingCart className='h-6 w-6 text-muted-foreground' />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Détails */}
                      <div className='flex-1 min-w-0'>
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={close}
                          className='block'
                        >
                          <h3 className='font-semibold text-sm sm:text-base text-foreground line-clamp-2 hover:text-primary transition-colors'>
                            {item.name}
                          </h3>
                        </Link>
                        <div className='mt-1'>
                          <ProductPrice price={item.price} />
                        </div>
                        <div className='mt-2 flex items-center gap-2'>
                          <Select
                            value={item.quantity.toString()}
                            onValueChange={(value) => {
                              updateItem(item, Number(value))
                            }}
                          >
                            <SelectTrigger className='h-11 min-h-[44px] w-16 sm:w-20 text-sm'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({
                                length: Math.min(item.countInStock, 10),
                              }).map((_, i) => (
                                <SelectItem
                                  value={(i + 1).toString()}
                                  key={i + 1}
                                >
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant='outline'
                            onClick={() => removeItem(item)}
                            className='h-11 min-h-[44px] w-11 min-w-[44px] p-0'
                            aria-label={t('Cart.Delete')}
                          >
                            <Trash2 className='h-5 w-5' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer sticky avec total et checkout */}
            <div className='sticky bottom-0 border-t border-border bg-background p-4 sm:p-6 space-y-3 flex-shrink-0 safe-area-inset-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]'>
              <div className='flex items-center justify-between'>
                <span className='text-base sm:text-lg font-semibold text-foreground'>
                  {t('Cart.Subtotal')}
                </span>
                <span className='text-lg sm:text-xl font-bold text-primary'>
                  <ProductPrice price={itemsPrice} plain />
                </span>
              </div>
              <Separator />
              <div className='space-y-2'>
                <Button
                  onClick={handleCheckout}
                  size='lg'
                  className='w-full h-12 min-h-[44px] text-base font-semibold'
                >
                  <div className='flex items-center gap-2'>
                    <span>{t('Cart.Proceed to Checkout')}</span>
                    <ArrowRight className='h-4 w-4' />
                  </div>
                </Button>
                <Button
                  onClick={close}
                  variant='outline'
                  className='w-full h-11 min-h-[44px] text-sm'
                  asChild
                >
                  <Link href='/'>{t('Common.Continue Shopping')}</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
