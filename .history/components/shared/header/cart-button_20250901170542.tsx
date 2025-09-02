'use client'

import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import useIsMounted from '@/hooks/use-is-mounted'
import useShowSidebar from '@/hooks/use-cart-sidebar'
import { cn } from '@/lib/utils'
import useCartStore from '@/hooks/use-cart-store'
import { useLocale, useTranslations } from 'next-intl'
import { getDirection } from '@/i18n-config'

interface CartButtonProps {
  variant?: 'header' | 'floating'
}

export default function CartButton({ variant = 'header' }: CartButtonProps) {
  const isMounted = useIsMounted()
  const {
    cart: { items },
  } = useCartStore()
  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0)
  const showSidebar = useShowSidebar()
  const t = useTranslations()

  const locale = useLocale()

  if (variant === 'floating') {
    return (
      <Link href='/cart' className='floating-cart'>
        <ShoppingCartIcon className='h-6 w-6' />
        {isMounted && cartItemsCount > 0 && (
          <span className='floating-cart-badge'>
            {cartItemsCount > 99 ? '99+' : cartItemsCount}
          </span>
        )}
      </Link>
    )
  }

  return (
    <Link href='/cart' className='header-button'>
      <div className='flex items-center gap-2 text-sm relative'>
        <div className='relative'>
          <ShoppingCartIcon className='h-6 w-6' />
          {isMounted && cartItemsCount > 0 && (
            <span
              className={cn(
                `bg-destructive text-destructive-foreground px-1.5 rounded-full text-xs font-bold absolute ${
                  getDirection(locale) === 'rtl' ? 'right-[-4px]' : 'left-[-4px]'
                } top-[-6px] z-10`,
                cartItemsCount >= 10 && 'text-xs px-1'
              )}
            >
              {cartItemsCount > 99 ? '99+' : cartItemsCount}
            </span>
          )}
        </div>
        <span className='font-medium hidden sm:block'>{t('Header.Cart')}</span>

        {showSidebar && (
          <div
            className={cn(
              'absolute top-[20px] z-10 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-transparent border-b-background',
              getDirection(locale) === 'rtl'
                ? 'left-[-16px] rotate-[-270deg]'
                : 'right-[-16px] rotate-[-90deg]'
            )}
          />
        )}
      </div>
    </Link>
  )
}
