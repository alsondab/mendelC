'use client'

import { useWishlistStore } from '@/hooks/use-wishlist-store'
import { useWishlistSliderStore } from '@/hooks/use-wishlist-slider-store'
import Link from 'next/link'
import React, { useEffect, useCallback } from 'react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Heart, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  slideFromRight,
  overlayVariants,
  buttonVariants as btnVariants,
} from '@/lib/utils/animations'
import { useToast } from '@/hooks/use-toast'
import useIsMounted from '@/hooks/use-is-mounted'
import WishlistItem from './wishlist/wishlist-item'
// ⚡ Optimization: Lazy load framer-motion pour réduire le First Load JS de ~37 KiB
import {
  AnimatedOverlay,
  AnimatedSlider,
  AnimatedButton,
  AnimatedPresenceWrapper,
} from './wishlist/wishlist-sidebar-animations'

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

  // ⚡ Optimization: useCallback pour éviter la recréation des fonctions à chaque render
  // Réduit le TBT (Total Blocking Time) en évitant les re-renders inutiles
  const handleRemoveItem = useCallback(
    (itemId: string) => {
      removeItem(itemId)
      toast({
        title: t('Wishlist.Removed'),
        description: t('Wishlist.RemovedDescription'),
      })
    },
    [removeItem, toast, t]
  )

  return (
    <AnimatedPresenceWrapper>
      {isOpen && (
        <>
          {/* Overlay */}
          <AnimatedOverlay
            variants={overlayVariants}
            onClick={close}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
          />

          {/* Slider */}
          <AnimatedSlider
            variants={slideFromRight}
            className="fixed right-0 top-0 bottom-16 md:bottom-0 z-[55] w-[280px] sm:w-[320px] md:w-[400px] bg-background border-l border-border shadow-2xl flex flex-col"
            role="dialog"
            aria-modal={true}
            aria-labelledby="wishlist-title"
          >
            {/* Header avec bouton de fermeture */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <Heart
                  className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 fill-red-500 flex-shrink-0"
                  aria-hidden="true"
                />
                <h2
                  id="wishlist-title"
                  className="text-sm sm:text-base font-bold text-foreground truncate"
                >
                  {t('Wishlist.Title')}
                </h2>
              </div>
              <AnimatedButton
                variants={btnVariants}
                onClick={close}
                className="p-1.5 sm:p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[44px] min-h-[44px]"
                aria-label={t('Common.Close')}
                type="button"
              >
                <X
                  className="h-4 w-4 sm:h-5 sm:w-5 text-foreground"
                  aria-hidden="true"
                />
              </AnimatedButton>
            </div>

            {/* Contenu */}
            {!isMounted || wishlist.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                <Heart
                  className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-3 sm:mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1.5 sm:mb-2 px-2">
                  {t('Wishlist.Empty.Title')}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 px-2 sm:px-4">
                  {t('Wishlist.Empty.Description')}
                </p>
                <Button
                  onClick={close}
                  asChild
                  size="sm"
                  className="min-h-[44px]"
                >
                  <Link href="/">{t('Common.Continue Shopping')}</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Liste des favoris */}
                <ScrollArea className="flex-1 px-3 sm:p-4 sidebar-scroll">
                  <div className="py-2 space-y-2">
                    {wishlist.map((item) => (
                      <WishlistItem
                        key={item._id}
                        item={item}
                        onRemove={handleRemoveItem}
                        onClose={close}
                      />
                    ))}
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="border-t border-border p-3 sm:p-4 flex-shrink-0">
                  <div className="text-center text-xs sm:text-sm text-muted-foreground mb-2">
                    {wishlist.length}{' '}
                    {wishlist.length === 1
                      ? t('Wishlist.Item')
                      : t('Wishlist.Items')}
                  </div>
                  <Button
                    onClick={close}
                    variant="outline"
                    className="w-full h-8 text-xs min-h-[32px] focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    asChild
                  >
                    <Link href="/">{t('Common.Continue Shopping')}</Link>
                  </Button>
                </div>
              </>
            )}
          </AnimatedSlider>
        </>
      )}
    </AnimatedPresenceWrapper>
  )
}
