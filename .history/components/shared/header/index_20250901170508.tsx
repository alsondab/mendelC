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
    <header className='nav-container sticky top-0 z-40'>
      <div className='nav-content'>
        {/* Main Navigation Bar */}
        <div className='flex items-center justify-between py-4'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/' className='nav-logo'>
              <Image
                src={site.logo}
                width={40}
                height={40}
                alt={`${site.name} logo`}
                className='rounded-lg'
              />
              <span className='font-bold text-xl hidden sm:block'>{site.name}</span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className='hidden lg:block flex-1 max-w-2xl mx-8'>
            <Search />
          </div>

          {/* Desktop Menu */}
          <div className='nav-menu'>
            <Menu />
          </div>

          {/* Mobile Menu */}
          <div className='nav-menu-mobile'>
            <Menu />
          </div>
        </div>

        {/* Mobile Search */}
        <div className='lg:hidden pb-4'>
          <Search />
        </div>

        {/* Secondary Navigation */}
        <div className='flex items-center justify-between py-3 border-t border-white/10'>
          {/* Categories Sidebar */}
          <div className='flex items-center'>
            <Sidebar categories={categories} />
          </div>

          {/* Navigation Links */}
          <div className='hidden sm:flex items-center space-x-1 overflow-hidden max-h-[42px]'>
            {data.headerMenus.map((menu) => (
              <Link
                href={menu.href}
                key={menu.href}
                className='header-button text-sm font-medium'
              >
                {t('Header.' + menu.name)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
