'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Home, Compass, ShoppingCart, User, Heart } from 'lucide-react'
import useCartStore from '@/hooks/use-cart-store'
import { useWishlistStore } from '@/hooks/use-wishlist-store'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import useCartSliderStore from '@/hooks/use-cart-slider-store'
import { useWishlistSliderStore } from '@/hooks/use-wishlist-slider-store'

export default function MobileBottomNav() {
  const t = useTranslations()
  const tCustom = useTranslations('FooterCustom')
  const pathname = usePathname()
  const { cart } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const { toggle: toggleCart } = useCartSliderStore()
  const { toggle: toggleWishlist } = useWishlistSliderStore()

  // Utiliser directement le store local
  const wishlistCount = wishlistItems.length

  // Ne pas afficher la navigation mobile dans les pages admin
  if (pathname.includes('/admin')) {
    return null
  }

  type NavItem = {
    href: string
    icon: typeof Home
    label: string
    isActive: boolean
    type: 'link' | 'button'
    badge?: number
    onClick?: () => void
  }

  const navItems: NavItem[] = [
    {
      href: '/',
      icon: Home,
      label: t('Header.Home'),
      isActive: pathname === '/',
      type: 'link',
    },
    {
      href: '/search',
      icon: Compass,
      label: tCustom('Browse'),
      isActive: pathname.includes('/search'),
      type: 'link',
    },
    {
      href: '/cart',
      icon: ShoppingCart,
      label: t('Header.Cart'),
      isActive: false, // Ne plus utiliser pathname car on ne redirige plus
      badge: cart.items.length > 0 ? cart.items.length : undefined,
      type: 'button',
      onClick: toggleCart,
    },
    {
      href: '/wishlist',
      icon: Heart,
      label: t('Header.Wishlist'),
      isActive: false, // Ne plus utiliser pathname car on ne redirige plus
      badge: wishlistCount > 0 ? wishlistCount : undefined,
      type: 'button',
      onClick: toggleWishlist,
    },
    {
      href: '/account',
      icon: User,
      label: t('Header.Account'),
      isActive: pathname.includes('/account'),
      type: 'link',
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-background border-t border-border/40 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const baseClassName = cn(
            'flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors min-w-0 flex-1',
            item.isActive
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )

          if (item.type === 'button') {
            return (
              <button
                key={item.href}
                onClick={item.onClick}
                className={baseClassName}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium truncate max-w-full">
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <Link key={item.href} href={item.href} className={baseClassName}>
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium truncate max-w-full">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
