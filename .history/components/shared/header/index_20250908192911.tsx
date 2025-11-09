import Image from 'next/image'
import Link from 'next/link'
import { getCategoryTree } from '@/lib/actions/category.actions'
import Menu from './menu'
import Search from './search'
import Sidebar from './sidebar'
import { getSetting } from '@/lib/actions/setting.actions'
import { auth } from '@/auth'
import {
  Sparkles,
  Star,
  TrendingUp,
  Award,
  HelpCircle,
  Truck,
  RotateCcw,
  MessageCircle,
  Info,
  Phone,
} from 'lucide-react'

export default async function Header() {
  const categories = await getCategoryTree()
  const { site } = await getSetting()
  const session = await auth()
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

      {/* Navigation Bar - Desktop Only */}
      <div className="hidden lg:block border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center h-10 xl:h-12">
            {/* Categories Sidebar */}
            <div className="flex items-center flex-shrink-0">
              <Sidebar />
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4 ml-4 text-sm">
              <Link
                href="/search?q=&sort=createdAt&order=desc"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                <span>Offre du jour</span>
              </Link>
              <Link
                href="/search?q=&sort=createdAt&order=desc"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Star className="h-4 w-4" />
                <span>Nouveautés</span>
              </Link>
              <Link
                href="/search?q=&sort=featured&order=desc"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Award className="h-4 w-4" />
                <span>Produits vedettes</span>
              </Link>
              <Link
                href="/search?q=&sort=sold&order=desc"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Meilleures ventes</span>
              </Link>
              <Link
                href="/service-client"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Service client</span>
              </Link>
              <Link
                href="/suivi-livraison"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Truck className="h-4 w-4" />
                <span>Suivi de livraison</span>
              </Link>
              <Link
                href="/politique-retour"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Politique de retour</span>
              </Link>
              <Link
                href="/centre-aide"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Centre d&apos;aide</span>
              </Link>
              <Link
                href="/questions-frequentes"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Info className="h-4 w-4" />
                <span>Questions fréquentes</span>
              </Link>
              <Link
                href="/a-propos"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Info className="h-4 w-4" />
                <span>À propos</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
