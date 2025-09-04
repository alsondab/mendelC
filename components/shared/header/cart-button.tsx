'use client'

import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useIsMounted from '@/hooks/use-is-mounted'
import useShowSidebar from '@/hooks/use-cart-sidebar'
import { cn } from '@/lib/utils'
import useCartStore from '@/hooks/use-cart-store'
import { useLocale, useTranslations } from 'next-intl'
import { getDirection } from '@/i18n-config'

export default function CartButton() {
  const isMounted = useIsMounted()
  const pathname = usePathname()
  const {
    cart: { items },
  } = useCartStore()
  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0)
  const showSidebar = useShowSidebar()
  const t = useTranslations()
  const locale = useLocale()

  // Ne pas afficher le panier dans la page admin
  if (pathname.includes('/admin')) {
    return null
  }

  return (
    <Link
      href='/cart'
      className={cn(
        'relative flex items-center justify-center transition-all duration-200',
        'flex-row space-x-2 px-3 py-2 rounded-lg hover:bg-muted/80'
      )}
    >
      <div className='relative'>
        <ShoppingCart className='h-5 w-5 text-foreground' />

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
