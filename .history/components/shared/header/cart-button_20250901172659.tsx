'use client'

import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import useIsMounted from '@/hooks/use-is-mounted'
import useShowSidebar from '@/hooks/use-cart-sidebar'
import { cn } from '@/lib/utils'
import useCartStore from '@/hooks/use-cart-store'
import { useLocale, useTranslations } from 'next-intl'
import { getDirection } from '@/i18n-config'

export default function CartButton() {
  const isMounted = useIsMounted()
  const {
    cart: { items },
  } = useCartStore()
  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0)
  const showSidebar = useShowSidebar()
  const t = useTranslations()
  const locale = useLocale()

  return (
    <Link
      href='/cart'
      className={cn(
        'relative flex items-center justify-center transition-all duration-200',
        // Desktop styles
        'md:flex-row md:space-x-2 md:px-3 md:py-2 md:rounded-lg md:hover:bg-muted/80',
        // Mobile floating button styles
        'w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-3xl',
        'md:w-auto md:h-auto md:bg-transparent md:shadow-none',
        // Floating button specific styles
        'md:static fixed bottom-6 right-6 z-50',
        'animate-in slide-in-from-bottom-2 duration-300',
        // Pulsing effect when cart has items
        cartItemsCount > 0 && 'animate-pulse'
      )}
    >
      <div className='relative'>
        <ShoppingCartIcon
          className={cn(
            'text-primary-foreground md:text-foreground',
            'h-6 w-6 md:h-5 md:w-5'
          )}
        />

        {/* Cart Badge */}
        {isMounted && cartItemsCount > 0 && (
          <span
            className={cn(
              'absolute -top-2 -right-2 md:-top-1 md:-right-1',
              'bg-destructive text-destructive-foreground',
              'rounded-full text-xs font-bold min-w-[20px] h-5',
              'flex items-center justify-center px-1',
              'animate-in zoom-in-50 duration-200',
              getDirection(locale) === 'rtl' && 'md:-left-1'
            )}
          >
            {cartItemsCount > 99 ? '99+' : cartItemsCount}
          </span>
        )}
      </div>

      {/* Cart Text - Desktop Only */}
      <span className='hidden md:block font-medium text-sm'>
        {t('Header.Cart')}
      </span>

      {/* Sidebar Indicator */}
      {showSidebar && (
        <div
          className={cn(
            'absolute top-full mt-1 z-10',
            'w-0 h-0 border-l-[6px] border-r-[6px] border-b-[7px]',
            'border-transparent border-b-background',
            getDirection(locale) === 'rtl'
              ? 'left-4 rotate-[-270deg]'
              : 'right-4 rotate-[-90deg]'
          )}
        />
      )}
    </Link>
  )
}
