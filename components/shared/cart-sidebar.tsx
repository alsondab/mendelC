'use client'

import useCartStore from '@/hooks/use-cart-store'
import useCartSliderStore from '@/hooks/use-cart-slider-store'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
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
import { motion, AnimatePresence } from 'framer-motion'
import { slideFromRight, overlayVariants, buttonVariants as btnVariants } from '@/lib/utils/animations'
import { useRouter } from 'next/navigation'

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
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={close}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
          />

          {/* Slider */}
          <motion.div
            variants={slideFromRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 bottom-16 md:bottom-0 z-[55] w-full max-w-[95vw] xs:max-w-sm sm:w-96 md:w-[420px] bg-background border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header avec bouton de fermeture */}
            <div className="flex items-center justify-between p-3 xs:p-4 sm:p-6 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0">
                <ShoppingCart className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h2 className="text-base xs:text-lg sm:text-xl font-bold text-foreground truncate">
                  {t('Cart.Shopping Cart')}
                </h2>
              </div>
              <motion.button
                variants={btnVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={close}
                className="p-1.5 xs:p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
                aria-label={t('Common.Close')}
              >
                <X className="h-4 w-4 xs:h-5 xs:w-5 text-foreground" />
              </motion.button>
            </div>

            {/* Contenu */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4 xs:p-6 text-center">
                <ShoppingCart className="h-12 w-12 xs:h-16 xs:w-16 sm:h-20 sm:w-20 text-muted-foreground mb-3 xs:mb-4" />
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-foreground mb-1.5 xs:mb-2 px-2">
                  {t('Cart.Your Shopping Cart is empty')}
                </h3>
                <p className="text-xs xs:text-sm sm:text-base text-muted-foreground mb-4 xs:mb-6 px-2">
                  {t('Cart.Continue shopping on')}
                </p>
                <Button onClick={close} asChild size="sm" className="xs:size-default">
                  <Link href="/">
                    {t('Common.Continue Shopping')}
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Liste des articles */}
                <ScrollArea className="flex-1 px-2 xs:px-4 sm:px-6">
                  <div className="py-3 xs:py-4 space-y-3 xs:space-y-4">
                    {items.map((item) => (
                      <div key={item.clientId} className="space-y-2 xs:space-y-3 pb-3 xs:pb-4 border-b last:border-0">
                        <div className="flex gap-2 xs:gap-3 sm:gap-4">
                          {/* Image */}
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={close}
                            className="flex-shrink-0"
                          >
                            <div className="relative w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 bg-muted rounded-lg overflow-hidden">
                              {item.image && item.image.trim() !== '' ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="(max-width: 640px) 80px, 96px"
                                  className="object-contain p-1 sm:p-2"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Détails */}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/product/${item.slug}`}
                              onClick={close}
                              className="block"
                            >
                              <h3 className="font-semibold text-xs xs:text-sm sm:text-base text-foreground line-clamp-2 hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <div className="mt-0.5 xs:mt-1">
                              <ProductPrice price={item.price} />
                            </div>
                            <div className="mt-1.5 xs:mt-2 flex items-center gap-1.5 xs:gap-2">
                              <Select
                                value={item.quantity.toString()}
                                onValueChange={(value) => {
                                  updateItem(item, Number(value))
                                }}
                              >
                                <SelectTrigger className="text-xs h-7 xs:h-8 w-12 xs:w-16">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: item.countInStock }).map(
                                    (_, i) => (
                                      <SelectItem value={(i + 1).toString()} key={i + 1}>
                                        {i + 1}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeItem(item)}
                                className="h-7 xs:h-8 px-1.5 xs:px-2"
                              >
                                <Trash2 className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Footer avec total et checkout */}
                <div className="border-t border-border p-3 xs:p-4 sm:p-6 space-y-3 xs:space-y-4 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm xs:text-base sm:text-lg font-semibold text-foreground">
                      {t('Cart.Subtotal')}
                    </span>
                    <span className="text-base xs:text-lg sm:text-xl font-bold text-primary">
                      <ProductPrice price={itemsPrice} plain />
                    </span>
                  </div>
                  <Separator />
                  <div className="space-y-1.5 xs:space-y-2">
                    <Button
                      onClick={handleCheckout}
                      size="lg"
                      className="w-full h-10 xs:h-11 sm:h-12 text-sm xs:text-base"
                    >
                      <div className="flex items-center gap-1.5 xs:gap-2">
                        <span>{t('Cart.Proceed to Checkout')}</span>
                        <ArrowRight className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                      </div>
                    </Button>
                    <Button
                      onClick={close}
                      variant="outline"
                      className="w-full h-9 xs:h-10 text-sm xs:text-base"
                      asChild
                    >
                      <Link href="/">
                        {t('Common.Continue Shopping')}
                      </Link>
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
