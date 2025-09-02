import Image from 'next/image'
import Link from 'next/link'
import { getAllCategories } from '@/lib/actions/product.actions'
import Menu from './menu'
import Search from './search'
import data from '@/lib/data'
import Sidebar from './sidebar'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export default async function Header() {
  const categories = await getAllCategories()
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
              <span className='font-bold text-4xl hidden sm:block'>
                <span className='bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent'>
                  M
                </span>
                <span className='text-foreground'>endel</span>
                <span className='bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent'>
                  C
                </span>
                <span className='text-foreground'>orp</span>
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
              {data.headerMenus.map((menu) => (
                <Link
                  href={menu.href}
                  key={menu.href}
                  className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap'
                >
                  {t('Header.' + menu.name)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
