'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import {
  Grid3X3,
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  FolderTree,
  Warehouse,
  Bell,
} from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { cn } from '@/lib/utils'
import { useTranslations, useLocale } from 'next-intl'
import AdminLogoutButton from '@/components/shared/admin/admin-logout-button'

const links = [
  {
    title: 'Overview',
    href: '/admin/overview',
    icon: BarChart3,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Stocks',
    href: '/admin/stock',
    icon: Warehouse,
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]
export function AdminNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('Admin')

  return (
    <nav
      className={cn(
        'flex items-center justify-center gap-1.5 md:gap-2 lg:gap-3 whitespace-nowrap',
        className
      )}
      {...props}
    >
      {links.map((item) => {
        const IconComponent = item.icon
        const pathnameStr = String(pathname)
        const href = `/${locale}${item.href}`
        return (
          <Link
            key={item.href}
            href={href}
            className={cn(
              'flex items-center space-x-1.5 px-2 py-1.5 md:px-2.5 md:py-2 rounded-md transition-colors text-xs sm:text-sm flex-shrink-0',
              pathnameStr.includes(item.href)
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{t(item.title)}</span>
          </Link>
        )
      })}
    </nav>
  )
}

// Composant séparé pour le menu grille mobile
export function AdminMobileMenu() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('Admin')
  const tHeader = useTranslations('Header')

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger className="flex items-center space-x-1 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium border border-white/20">
          <Grid3X3 className="h-4 w-4" />
          <span className="text-xs">{tHeader('Menu')}</span>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="h-[80vh] max-h-screen flex flex-col rounded-t-xl overflow-hidden"
        >
          {/* Header - Fixe en haut */}
          <SheetHeader className="flex-shrink-0 space-y-4 pb-4 border-b border-border">
            <SheetTitle className="text-left">{t('Admin Panel')}</SheetTitle>
            <SheetDescription className="text-left">
              {t('Navigation and administration')}
            </SheetDescription>
          </SheetHeader>

          {/* Contenu scrollable - Prend l'espace restant */}
          <div className="flex-1 overflow-y-auto overscroll-contain mt-6 pr-1">
            <div className="space-y-6 pb-4">
              {/* Navigation Grid */}
              <div className="grid grid-cols-2 gap-4">
                {links.map((item) => {
                  const IconComponent = item.icon
                  const pathnameStr = String(pathname)
                  const href = `/${locale}${item.href}`
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={href}
                        className={cn(
                          'flex flex-col items-center space-y-2 p-4 rounded-lg border transition-all duration-200',
                          pathnameStr.includes(item.href)
                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                            : 'bg-muted/50 hover:bg-muted border-border hover:shadow-sm'
                        )}
                      >
                        <IconComponent className="h-6 w-6 flex-shrink-0" />
                        <span className="text-sm font-medium text-center break-words">
                          {t(item.title)}
                        </span>
                      </Link>
                    </SheetClose>
                  )
                })}
              </div>

              {/* Logout Button in Mobile Menu */}
              <div className="pt-4 border-t border-border">
                <AdminLogoutButton />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
