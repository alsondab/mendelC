'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Home, Search, ShoppingCart, User, Heart } from 'lucide-react'
import useCartStore from '@/hooks/use-cart-store'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function MobileBottomNav() {
  const t = useTranslations()
  const pathname = usePathname()
  const { cart } = useCartStore()

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: t('Header.Home'),
      isActive: pathname === '/',
    },
    {
      href: '/search',
      icon: Search,
      label: t('Header.Search'),
      isActive: pathname.includes('/search'),
    },
    {
      href: '/cart',
      icon: ShoppingCart,
      label: t('Header.Cart'),
      isActive: pathname.includes('/cart'),
      badge: cart.items.length > 0 ? cart.items.length : undefined,
    },
    {
      href: '/wishlist',
      icon: Heart,
      label: t('Header.Wishlist'),
      isActive: pathname.includes('/wishlist'),
    },
    {
      href: '/account',
      icon: User,
      label: t('Header.Account'),
      isActive: pathname.includes('/account'),
    },
  ]

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/40 md:hidden'>
      <div className='flex items-center justify-around h-16 px-2'>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors min-w-0 flex-1',
                item.isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <div className='relative'>
                <Icon className='h-5 w-5' />
                {item.badge && (
                  <span className='absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className='text-xs font-medium truncate max-w-full'>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
