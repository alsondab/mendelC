'use client'

import React from 'react'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useWishlistStore } from '@/hooks/use-wishlist-store'
import useIsMounted from '@/hooks/use-is-mounted'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export default function WishlistCount() {
  const { items: wishlistItems } = useWishlistStore()
  const isMounted = useIsMounted()
  const pathname = usePathname()
  const t = useTranslations()

  // Utiliser directement le store local
  const count = wishlistItems.length

  // Ne pas afficher les favoris dans la page admin
  if (pathname.includes('/admin')) {
    return null
  }

  // Toujours rediriger vers la page des favoris (comme le panier)
  const href = '/wishlist'

  return (
    <Link
      href={href}
      className={cn(
        'relative flex items-center justify-center transition-all duration-200',
        'flex-row space-x-2 px-3 py-2 rounded-lg hover:bg-muted/80'
      )}
    >
      <div className='relative'>
        <Heart className='h-5 w-5 text-foreground' />

        {/* Wishlist Badge - Toujours afficher si il y a des favoris */}
        {isMounted && count > 0 && (
          <span
            className={cn(
              'absolute -top-1 -right-1',
              'bg-orange-500 text-white',
              'rounded-full text-xs font-bold min-w-[20px] h-5',
              'flex items-center justify-center px-1',
              'animate-in zoom-in-50 duration-200'
            )}
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>

      {/* Wishlist Text - Desktop Only */}
      <span className='hidden md:block font-medium text-sm'>
        {t('Header.Wishlist')}
      </span>
    </Link>
  )
}
