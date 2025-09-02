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
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      {/* Top Bar - Logo, Search, Actions */}
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between gap-4'>
          {/* Logo */}
          <div className='flex items-center gap-2'>
            <Link
              href='/'
              className='flex items-center gap-2 transition-opacity hover:opacity-80'
            >
              <Image
                src={site.logo}
                width={32}
                height={32}
                alt={`${site.name} logo`}
                className='h-8 w-8'
              />
              <span className='hidden sm:block font-bold text-lg text-foreground'>
                {site.name}
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className='hidden md:flex flex-1 max-w-2xl mx-8'>
            <Search />
          </div>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            <Menu />
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className='md:hidden pb-4'>
          <Search />
        </div>
      </div>

      {/* Navigation Bar */}
      <div className='border-t bg-muted/50'>
        <div className='container mx-auto px-4'>
          <div className='flex h-12 items-center justify-between'>
            {/* Categories Sidebar */}
            <div className='flex items-center'>
              <Sidebar categories={categories} />
            </div>

            {/* Navigation Links */}
            <nav className='hidden lg:flex items-center gap-6'>
              {data.headerMenus.map((menu) => (
                <Link
                  href={menu.href}
                  key={menu.href}
                  className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                >
                  {t('Header.' + menu.name)}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Indicator */}
            <div className='lg:hidden'>
              <span className='text-xs text-muted-foreground'>
                Menu disponible dans le tiroir
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
