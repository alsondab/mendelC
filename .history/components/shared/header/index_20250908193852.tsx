import Image from 'next/image'
import Link from 'next/link'
import { getCategoryTree } from '@/lib/actions/category.actions'
import Menu from './menu'
import Search from './search'
import Sidebar from './sidebar'
import { getSetting } from '@/lib/actions/setting.actions'

export default async function Header() {
  const categories = await getCategoryTree()
  const { site } = await getSetting()
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 shadow-sm">
      {/* Main Header */}
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center min-w-0 flex-1">
            <Link
              href="/"
              className="flex items-center space-x-1 sm:space-x-2 hover:opacity-80 transition-opacity min-w-0"
            >
              {site.logo && site.logo.trim() !== '' ? (
                <Image
                  src={site.logo}
                  width={64}
                  height={64}
                  alt={`${site.name} logo`}
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-muted flex items-center justify-center rounded-lg flex-shrink-0">
                  <span className="text-muted-foreground text-xs font-bold">
                    {site.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="font-bold text-sm xs:text-lg sm:text-2xl lg:text-4xl text-foreground truncate">
                {site.name}
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-2xl mx-4 lg:mx-8">
            <Search categories={categories} siteName={site.name} />
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
            <Menu />
          </div>
        </div>
      </div>
    </header>
  )
}
