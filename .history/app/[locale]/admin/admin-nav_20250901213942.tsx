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
  FileText,
  Settings,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

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
    title: 'Pages',
    href: '/admin/web-pages',
    icon: FileText,
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
  const t = useTranslations('Admin')

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={cn(
          'hidden md:flex items-center flex-wrap overflow-hidden gap-2 md:gap-4',
          className
        )}
        {...props}
      >
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-3 py-2 rounded-lg transition-colors',
              pathname.includes(item.href)
                ? 'bg-white/10 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            )}
          >
            {t(item.title)}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Grid */}
      <div className='md:hidden'>
        <Sheet>
          <SheetTrigger className='flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium border border-white/20'>
            <Grid3X3 className='h-4 w-4 text-white' />
            <span className='text-white'>Menu</span>
          </SheetTrigger>
          <SheetContent side='bottom' className='h-[80vh] rounded-t-xl'>
            <SheetHeader className='space-y-4'>
              <SheetTitle className='text-left'>
                Panneau d'administration
              </SheetTitle>
              <SheetDescription className='text-left'>
                Navigation et administration
              </SheetDescription>
            </SheetHeader>

            {/* Navigation Grid */}
            <div className='mt-6'>
              <div className='grid grid-cols-2 gap-4'>
                {links.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex flex-col items-center space-y-2 p-4 rounded-lg border transition-all duration-200',
                        pathname.includes(item.href)
                          ? 'bg-primary text-primary-foreground border-primary shadow-md'
                          : 'bg-muted/50 hover:bg-muted border-border hover:shadow-sm'
                      )}
                    >
                      <IconComponent className='h-6 w-6' />
                      <span className='text-sm font-medium text-center'>
                        {t(item.title)}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
