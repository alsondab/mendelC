'use client'

import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useIsMounted from '@/hooks/use-is-mounted'
import { cn } from '@/lib/utils'
import useCartStore from '@/hooks/use-cart-store'
import { useLocale, useTranslations } from 'next-intl'

export default function FloatingCartButton() {
  const isMounted = useIsMounted()
  const pathname = usePathname()
  const {
    cart: { items },
  } = useCartStore()
  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0)
  const t = useTranslations()
  const locale = useLocale()

  // Ne pas afficher le panier flottant dans les pages admin
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <Link
      href='/cart'
      className={cn(
        'fixed bottom-4 right-4 z-50',
        'w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary hover:bg-primary/90',
        'shadow-lg hover:shadow-xl',
        'flex items-center justify-center transition-all duration-200',
        'animate-in slide-in-from-bottom-2 duration-300',
        // Only show on mobile
        'md:hidden',
        // Pulsing effect when cart has items
        cartItemsCount > 0 && 'animate-pulse'
      )}
    >
      <div className='relative'>
        <ShoppingCartIcon className='h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground' />

        {/* Cart Badge */}
        {isMounted && cartItemsCount > 0 && (
          <span
            className={cn(
              'absolute -top-1 -right-1 sm:-top-2 sm:-right-2',
              'bg-destructive text-destructive-foreground',
              'rounded-full text-xs font-bold min-w-[16px] h-4 sm:min-w-[20px] sm:h-5',
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
