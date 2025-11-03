'use client'

import { useState, useEffect } from 'react'
import { ShoppingCartIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import useIsMounted from '@/hooks/use-is-mounted'
import { cn } from '@/lib/utils'
import useCartStore from '@/hooks/use-cart-store'
import { useTranslations } from 'next-intl'
import useCartSliderStore from '@/hooks/use-cart-slider-store'
import { buttonVariants } from '@/lib/utils/animations'

export default function CartButton() {
  const isMounted = useIsMounted()
  const pathname = usePathname()
  const {
    cart: { items },
  } = useCartStore()
  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0)
  const { toggle } = useCartSliderStore()
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

  // Ne pas afficher le panier dans la page admin
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
      aria-label={t('Header.Cart') || 'Panier'}
    >
      <div className='relative'>
        <ShoppingCartIcon className='h-5 w-5 text-foreground' />

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
    </ButtonComponent>
  )
}
