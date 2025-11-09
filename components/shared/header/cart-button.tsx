'use client'

import { ShoppingCartIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import useIsMounted from '@/hooks/use-is-mounted'
import { cn } from '@/lib/utils'
import useCartStore from '@/hooks/use-cart-store'
import { useTranslations } from 'next-intl'
import useCartSliderStore from '@/hooks/use-cart-slider-store'

export default function CartButton() {
  const isMounted = useIsMounted()
  const pathname = usePathname()
  const {
    cart: { items },
  } = useCartStore()
  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0)
  const { toggle } = useCartSliderStore()
  const t = useTranslations()

  // Ne pas afficher le panier dans la page admin
  if (pathname.includes('/admin')) {
    return null
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        'relative flex items-center justify-center transition-all duration-200',
        'flex-row space-x-2 px-3 py-2 rounded-lg hover:bg-muted/80 cursor-pointer',
        // ⚡ Optimization: CSS transitions au lieu de framer-motion pour réduire le bundle (~53 kB)
        'transform transition-transform hover:scale-105 active:scale-95'
      )}
      aria-label={t('Header.Cart') || 'Panier'}
    >
      <div className="relative">
        <ShoppingCartIcon className="h-5 w-5 text-foreground" />

        {/* Cart Badge */}
        {isMounted && cartItemsCount > 0 && (
          <span
            className={cn(
              'absolute -top-1 -right-1',
              'bg-destructive text-destructive-foreground',
              'rounded-full text-xs font-bold min-w-[20px] h-5',
              'flex items-center justify-center px-1',
              'animate-in zoom-in-50 duration-200'
            )}
          >
            {cartItemsCount > 99 ? '99+' : cartItemsCount}
          </span>
        )}
      </div>

      {/* Cart Text - Desktop Only */}
      <span className="hidden md:block font-medium text-sm">
        {t('Header.Cart')}
      </span>
    </button>
  )
}
