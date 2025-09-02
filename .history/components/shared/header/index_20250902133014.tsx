import Image from 'next/image'
import Link from 'next/link'
import { getAllCategories } from '@/lib/actions/product.actions'
import Menu from './menu'
import Search from './search'
import data from '@/lib/data'
import Sidebar from './sidebar'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'
import {
  Clock,
  Sparkles,
  Star,
  TrendingUp,
  History,
  MessageCircle,
  Info,
  HelpCircle,
} from 'lucide-react'

export default async function Header() {
  const categories = await getCategoryTree()
  const { site } = await getSetting()
  const t = await getTranslations()
  return (
    <header className='sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 shadow-sm'>
      {/* Main Header */}
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link
              href='/'
              className='flex items-center space-x-2 hover:opacity-80 transition-opacity'
            >
              <Image
                src={site.logo}
                width={64}
                height={64}
                alt={`${site.name} logo`}
                className='w-16 h-16'
              />
              <span className='font-bold text-4xl text-foreground hidden sm:block'>
                {site.name}
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className='hidden lg:block flex-1 max-w-2xl mx-8'>
            <Search categories={categories} siteName={site.name} />
          </div>

          {/* Mobile Actions */}
          <div className='lg:hidden flex items-center space-x-2'>
            <Sidebar categories={categories} />
            <Search categories={categories} siteName={site.name} />
            <Menu headerMenus={data.headerMenus} />
          </div>

          {/* Desktop Actions */}
          <div className='hidden lg:flex items-center space-x-2'>
            <Menu />
          </div>
        </div>
      </div>

      {/* Navigation Bar - Desktop Only */}
      <div className='hidden lg:block border-t border-border/40 bg-muted/30'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between h-12'>
            {/* Categories Sidebar */}
            <div className='flex items-center'>
              <Sidebar categories={categories} />
            </div>

            {/* Navigation Links */}
            <div className='flex items-center space-x-6 overflow-x-auto navbar-scroll'>
              {data.headerMenus.map((menu) => {
                const getIcon = (name: string) => {
                  switch (name) {
                    case "Today's Deal":
                      return <Clock className='h-4 w-4' />
                    case 'New Arrivals':
                      return <Sparkles className='h-4 w-4' />
                    case 'Featured Products':
                      return <Star className='h-4 w-4' />
                    case 'Best Sellers':
                      return <TrendingUp className='h-4 w-4' />
                    case 'Browsing History':
                      return <History className='h-4 w-4' />
                    case 'Customer Service':
                      return <MessageCircle className='h-4 w-4' />
                    case 'About Us':
                      return <Info className='h-4 w-4' />
                    case 'Help':
                      return <HelpCircle className='h-4 w-4' />
                    default:
                      return null
                  }
                }

                return (
                  <Link
                    href={menu.href}
                    key={menu.href}
                    className='flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap'
                  >
                    {getIcon(menu.name)}
                    <span>{t('Header.' + menu.name)}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
