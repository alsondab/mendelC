'use client'

import React, { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/hooks/use-wishlist-store'
import useIsMounted from '@/hooks/use-is-mounted'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useWishlistSliderStore } from '@/hooks/use-wishlist-slider-store'
import { buttonVariants } from '@/lib/utils/animations'

export default function WishlistCount() {
  const { items: wishlistItems } = useWishlistStore()
  const isMounted = useIsMounted()
  const pathname = usePathname()
  const { toggle } = useWishlistSliderStore()
  const t = useTranslations()

  // ⚡ Optimization: Lazy load framer-motion pour réduire le bundle initial
  const [motionReady, setMotionReady] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [MotionButton, setMotionButton] = useState<any>(null)

  useEffect(() => {
    // Lazy load framer-motion après le premier rendu pour réduire TBT
    import('framer-motion').then((mod) => {
      setMotionButton(() => mod.motion.button)
      setMotionReady(true)
    })
  }, [])

  // Utiliser directement le store local
  const count = wishlistItems.length

  // Ne pas afficher les favoris dans la page admin
  if (pathname.includes('/admin')) {
    return null
  }

  // Fallback sans animation si framer-motion n'est pas encore chargé
  const ButtonComponent = motionReady && MotionButton ? MotionButton : 'button'
  const motionProps = motionReady
    ? {
        variants: buttonVariants,
        initial: 'rest',
        whileHover: 'hover',
        whileTap: 'tap',
      }
    : {}

  return (
    <ButtonComponent
      {...motionProps}
      onClick={toggle}
      className={cn(
        'relative flex items-center justify-center transition-all duration-200',
        'flex-row space-x-2 px-3 py-2 rounded-lg hover:bg-muted/80 cursor-pointer'
      )}
      aria-label={t('Header.Wishlist') || 'Favoris'}
    >
      <div className='relative'>
        <Heart className='h-5 w-5 text-foreground' />

        {/* Wishlist Badge - Toujours afficher si il y a des favoris */}
        {isMounted && count > 0 && (
          <span
            className={cn(
              'absolute -top-1 -right-1',
              'bg-amber-500 text-white',
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
    </ButtonComponent>
  )
}
