'use client'

import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import useIsMounted from '@/hooks/use-is-mounted'
import { cn } from '@/lib/utils'
import useCartStore from '@/hooks/use-cart-store'
import { useLocale, useTranslations } from 'next-intl'

export default function FloatingCartButton() {
  const isMounted = useIsMounted()
  const {
    cart: { items },
  } = useCartStore()
  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0)
  const t = useTranslations()
  const locale = useLocale()

  return (
    <Link
      href='/cart'
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'w-16 h-16 rounded-full bg-primary hover:bg-primary/90',
        'shadow-2xl hover:shadow-3xl',
        'flex items-center justify-center transition-all duration-200',
        'animate-in slide-in-from-bottom-2 duration-300',
        // Pulsing effect when cart has items
        cartItemsCount > 0 && 'animate-pulse'
      )}
    >
      <div className='relative'>
        <ShoppingCartIcon className='h-6 w-6 text-primary-foreground' />

        {/* Cart Badge */}
        {isMounted && cartItemsCount > 0 && (
          <span
            className={cn(
              'absolute -top-2 -right-2',
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
    </Link>
  )
}
