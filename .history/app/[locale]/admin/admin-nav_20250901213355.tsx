'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Settings,
  Grid3X3 
} from 'lucide-react'

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
    <nav
      className={cn(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4',
        className
      )}
      {...props}
    >
      {links.map((item) => {
        const Icon = item.icon
        const isActive = pathname.includes(item.href)
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 hover:bg-white/10 group',
              isActive 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            )}
          >
            <Icon className={cn(
              'h-5 w-5 mb-1 transition-transform duration-200',
              isActive ? 'scale-110' : 'group-hover:scale-105'
            )} />
            <span className={cn(
              'text-xs font-medium text-center leading-tight',
              isActive ? 'font-semibold' : 'font-normal'
            )}>
              {t(item.title)}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
