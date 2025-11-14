'use client'

import useCartStore from '@/hooks/use-cart-store'
import useCartSliderStore from '@/hooks/use-cart-slider-store'
import Link from 'next/link'
import React, { useEffect, useCallback } from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { X, ShoppingCart, ArrowRight } from 'lucide-react'
import useSettingStore from '@/hooks/use-setting-store'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { round2 } from '@/lib/utils'
import {
  slideFromRight,
  overlayVariants,
  buttonVariants as btnVariants,
} from '@/lib/utils/animations'
import CartItem from './cart/cart-item'
// ⚡ Optimization: Lazy load framer-motion pour réduire le First Load JS de ~37 KiB
// Les composants d'animation utilisent dynamic() pour lazy-load framer-motion
import {
  AnimatedOverlay,
  AnimatedSlider,
  AnimatedButton,
  AnimatedPresenceWrapper,
} from './cart/cart-sidebar-animations'

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
      availableCurrencies,
    },
  } = useSettingStore()

  const t = useTranslations()
  const { getCurrency } = useSettingStore()
  const currency = getCurrency()

  // ⚡ Optimization: useCallback pour éviter la recréation des fonctions à chaque render
  // Réduit le TBT (Total Blocking Time) en évitant les re-renders inutiles
  const handleUpdateItem = useCallback(
    (item: Parameters<typeof updateItem>[0], quantity: number) => {
      updateItem(item, quantity)
    },
    [updateItem]
  )

  const handleRemoveItem = useCallback(
    (item: Parameters<typeof removeItem>[0]) => {
      removeItem(item)
    },
    [removeItem]
  )

  // Les prix sont maintenant stockés directement en CFA dans le panier
  // itemsPrice est déjà en CFA
  // Fonction pour formater les prix selon la devise choisie
  const formatPrice = (priceCFA: number) => {
    // Si la devise choisie est XOF (CFA), afficher directement
    if (currency.code === 'XOF') {
      return `${Math.round(priceCFA).toLocaleString('fr-FR')} CFA`
    }

    // Sinon, convertir depuis CFA vers la devise choisie
    const cfaCurrency = availableCurrencies.find((c) => c.code === 'XOF')
    if (!cfaCurrency) {
      return `${Math.round(priceCFA).toLocaleString('fr-FR')} CFA`
    }

    // Convertir depuis CFA vers la devise choisie
    const convertedPrice = round2(
      (priceCFA / cfaCurrency.convertRate) * currency.convertRate
    )

    // Formater selon la devise
    if (currency.code === 'EUR') {
      return `€${convertedPrice.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    }
    if (currency.code === 'USD') {
      return `$${convertedPrice.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    }

    return `${convertedPrice.toLocaleString('fr-FR')} ${currency.symbol}`
  }

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
            aria-labelledby="cart-title"
          >
            {/* Header avec bouton de fermeture */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <ShoppingCart
                  className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0"
                  aria-hidden="true"
                />
                <h2
                  id="cart-title"
                  className="text-sm sm:text-base font-bold text-foreground truncate"
                >
                  {t('Cart.Shopping Cart')}
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
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                <ShoppingCart
                  className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-3 sm:mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1.5 sm:mb-2 px-2">
                  {t('Cart.Your Shopping Cart is empty')}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 px-2">
                  {t('Cart.Continue shopping on')}
                </p>
                <Button
                  onClick={close}
                  asChild
                  size="sm"
                  className="min-h-[44px]"
                >
                  <Link href="/search">{t('Common.Continue Shopping')}</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Liste des articles */}
                <ScrollArea className="flex-1 px-3 sm:p-4 sidebar-scroll">
                  <div className="py-2 space-y-2">
                    {items.map((item) => (
                      <CartItem
                        key={item.clientId}
                        item={item}
                        onUpdateQuantity={handleUpdateItem}
                        onRemove={handleRemoveItem}
                        onClose={close}
                      />
                    ))}
                  </div>
                </ScrollArea>

                {/* Footer avec total et checkout */}
                <div className="border-t border-border p-3 sm:p-4 space-y-2 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-semibold text-foreground">
                      {t('Cart.Subtotal')}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-primary">
                      {formatPrice(itemsPrice)}
                    </span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Button
                      onClick={handleCheckout}
                      size="sm"
                      className="w-full h-9 text-sm font-medium min-h-[36px] focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label={t('Cart.Proceed to Checkout')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{t('Cart.Proceed to Checkout')}</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </div>
                    </Button>
                    <Button
                      onClick={close}
                      variant="outline"
                      className="w-full h-8 text-xs min-h-[32px] focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      asChild
                    >
                      <Link href="/search">
                        {t('Common.Continue Shopping')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </AnimatedSlider>
        </>
      )}
    </AnimatedPresenceWrapper>
  )
}
