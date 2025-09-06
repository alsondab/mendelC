import Image from 'next/image'
import Link from 'next/link'
import { getCategoryTree } from '@/lib/actions/category.actions'
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
      <div className='container mx-auto px-2 sm:px-4'>
        <div className='flex items-center justify-between h-14 sm:h-16'>
          {/* Logo */}
          <div className='flex items-center min-w-0 flex-1'>
            <Link
              href='/'
              className='flex items-center space-x-1 sm:space-x-2 hover:opacity-80 transition-opacity min-w-0'
            >
              {site.logo && site.logo.trim() !== '' ? (
                <Image
                  src={site.logo}
                  width={64}
                  height={64}
                  alt={`${site.name} logo`}
                  className='w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex-shrink-0'
                />
              ) : (
                <div className='w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-muted flex items-center justify-center rounded-lg flex-shrink-0'>
                  <span className='text-muted-foreground text-xs font-bold'>
                    {site.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className='font-bold text-sm xs:text-lg sm:text-2xl lg:text-4xl text-foreground truncate'>
                {site.name}
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className='hidden lg:block flex-1 max-w-2xl mx-4 lg:mx-8'>
            <Search categories={categories} siteName={site.name} />
          </div>

          {/* Mobile Actions */}
          <div className='lg:hidden flex items-center space-x-1 sm:space-x-2 flex-shrink-0'>
            <Sidebar />
          </div>

          {/* Desktop Actions */}
          <div className='hidden lg:flex items-center space-x-2 flex-shrink-0'>
            <Menu />
          </div>
        </div>
      </div>

      {/* Navigation Bar - Desktop Only */}
      <div className='hidden lg:block border-t border-border/40 bg-muted/30'>
        <div className='container mx-auto px-2 sm:px-4'>
          <div className='flex items-center justify-between h-10 xl:h-12'>
            {/* Categories Sidebar */}
            <div className='flex items-center flex-shrink-0'>
              <Sidebar />
            </div>

            {/* Navigation Links */}
            <div className='flex items-center space-x-4 xl:space-x-6 overflow-x-auto navbar-scroll scrollbar-hide'>
              {data.headerMenus.map((menu) => {
                const getIcon = (name: string) => {
                  switch (name) {
                    case "Today's Deal":
                      return <Clock className='h-3 w-3 xl:h-4 xl:w-4' />
                    case 'New Arrivals':
                      return <Sparkles className='h-3 w-3 xl:h-4 xl:w-4' />
                    case 'Featured Products':
                      return <Star className='h-3 w-3 xl:h-4 xl:w-4' />
                    case 'Best Sellers':
                      return <TrendingUp className='h-3 w-3 xl:h-4 xl:w-4' />
                    case 'Browsing History':
                      return <History className='h-3 w-3 xl:h-4 xl:w-4' />
                    case 'Customer Service':
                      return <MessageCircle className='h-3 w-3 xl:h-4 xl:w-4' />
                    case 'About Us':
                      return <Info className='h-3 w-3 xl:h-4 xl:w-4' />
                    case 'Help':
                      return <HelpCircle className='h-3 w-3 xl:h-4 xl:w-4' />
                    default:
                      return null
                  }
                }

                return (
                  <Link
                    href={menu.href}
                    key={menu.href}
                    className='flex items-center space-x-1 xl:space-x-2 text-xs xl:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap px-2 py-1 rounded-md hover:bg-muted/50'
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
