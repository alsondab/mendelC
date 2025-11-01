'use client'

import { useWishlistStore } from '@/hooks/use-wishlist-store'
import { useWishlistSliderStore } from '@/hooks/use-wishlist-slider-store'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Heart, X, ShoppingCart } from 'lucide-react'
import ProductPrice from './product/product-price'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { slideFromRight, overlayVariants, buttonVariants as btnVariants } from '@/lib/utils/animations'
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
            className="fixed right-0 top-0 bottom-0 z-[55] w-full max-w-[95vw] xs:max-w-sm sm:w-96 md:w-[420px] bg-background border-l border-border shadow-2xl flex flex-col safe-area-inset-bottom"
          >
            {/* Header avec bouton de fermeture */}
            <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-border flex-shrink-0 safe-area-inset-top">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 fill-red-500 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
                  {t('Wishlist.Title')}
                </h2>
              </div>
              <motion.button
                variants={btnVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={close}
                className="h-11 w-11 min-w-[44px] min-h-[44px] rounded-full hover:bg-muted transition-colors flex items-center justify-center flex-shrink-0"
                aria-label={t('Common.Close')}
              >
                <X className="h-5 w-5 text-foreground" />
              </motion.button>
            </div>

            {/* Contenu */}
            {!isMounted || wishlist.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                <Heart className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 px-2">
                  {t('Wishlist.Empty.Title')}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 px-2 sm:px-4">
                  {t('Wishlist.Empty.Description')}
                </p>
                <Button onClick={close} asChild className="min-h-[44px]">
                  <Link href="/">
                    {t('Common.Continue Shopping')}
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Liste des favoris - Scrollable */}
                <div className="flex-1 drawer-scroll px-3 sm:px-4 md:px-6 min-h-0">
                  <div className="py-4 space-y-4">
                    {wishlist.map((item) => (
                      <div key={item._id} className="space-y-3 pb-4 border-b last:border-0">
                        <div className="flex gap-3 sm:gap-4">
                          {/* Image - Aspect Square */}
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={close}
                            className="flex-shrink-0"
                          >
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 aspect-square bg-muted rounded-lg overflow-hidden">
                              {item.image && item.image.trim() !== '' ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="(max-width: 640px) 80px, 96px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <Heart className="h-6 w-6 text-muted-foreground" />
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
                              <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-2 hover:text-primary transition-colors mb-1 sm:mb-2">
                                {item.name}
                              </h3>
                            </Link>
                            <div className="mb-1 sm:mb-2">
                              <ProductPrice price={item.price} />
                            </div>
                            <div className="mb-2 text-sm">
                              {item.countInStock > 0 ? (
                                <span className="text-green-600">{t('Wishlist.InStock')}</span>
                              ) : (
                                <span className="text-red-600">{t('Wishlist.OutOfStock')}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              {item.countInStock > 0 && (
                                <Button
                                  variant="default"
                                  className="flex-1 h-11 min-h-[44px] text-sm"
                                  asChild
                                >
                                  <Link href={`/product/${item.slug}`} onClick={close}>
                                    <ShoppingCart className="h-4 w-4 mr-1" />
                                    <span>{t('Wishlist.View')}</span>
                                  </Link>
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                onClick={() => handleRemoveItem(item._id)}
                                className={cn(
                                  "h-11 min-h-[44px] px-3 sm:px-4",
                                  "text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                                )}
                                aria-label={t('Wishlist.Remove')}
                              >
                                <Heart className="h-4 w-4 fill-red-600 mr-1" />
                                <span className="hidden sm:inline">{t('Wishlist.Remove')}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer sticky */}
                <div className="sticky bottom-0 border-t border-border bg-background p-4 sm:p-6 flex-shrink-0 safe-area-inset-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                  <div className="text-center text-sm text-muted-foreground mb-3 sm:mb-4">
                    {wishlist.length} {wishlist.length === 1 ? t('Wishlist.Item') : t('Wishlist.Items')}
                  </div>
                  <Button
                    onClick={close}
                    variant="outline"
                    className="w-full h-11 min-h-[44px] text-sm"
                    asChild
                  >
                    <Link href="/">
                      {t('Common.Continue Shopping')}
                    </Link>
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

