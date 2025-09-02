import {
  Menu as MenuIcon,
  Settings,
  Grid3X3,
  Star,
  Clock,
  Sparkles,
  TrendingUp,
  History,
  HelpCircle,
  Info,
  MessageCircle,
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  FileText,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import CartButton from './cart-button'
import UserButton from './user-button'
import ThemeSwitcher from './theme-switcher'
import LanguageSwitcher from './language-switcher'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MenuProps {
  forAdmin?: boolean
  headerMenus?: Array<{ name: string; href: string }>
}

const Menu = ({ forAdmin = false, headerMenus = [] }: MenuProps) => {
  const t = useTranslations()
  const pathname = usePathname()

  // Admin navigation links
  const adminLinks = [
    { title: 'Overview', href: '/admin/overview', icon: BarChart3 },
    { title: 'Products', href: '/admin/products', icon: Package },
    { title: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { title: 'Users', href: '/admin/users', icon: Users },
    { title: 'Pages', href: '/admin/web-pages', icon: FileText },
    { title: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <>
      {/* Desktop Menu */}
      <div className='hidden md:flex items-center space-x-2'>
        <LanguageSwitcher />
        <ThemeSwitcher />
        <UserButton />
        {!forAdmin && <CartButton />}
      </div>

      {/* Mobile Menu */}
      <div className='md:hidden flex items-center space-x-2'>
        {/* Admin Grid Menu */}
        {forAdmin && (
          <Sheet>
            <SheetTrigger className='flex items-center space-x-1 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium border border-white/20'>
              <Grid3X3 className='h-4 w-4 text-white' />
              <span className='text-white text-xs'>Menu</span>
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
                  {adminLinks.map((item) => {
                    const IconComponent = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center space-y-2 p-4 rounded-lg border transition-all duration-200 ${
                          pathname.includes(item.href)
                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                            : 'bg-muted/50 hover:bg-muted border-border hover:shadow-sm'
                        }`}
                      >
                        <IconComponent className='h-6 w-6' />
                        <span className='text-sm font-medium text-center'>
                          {t('Admin.' + item.title)}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Settings Menu */}
        <Sheet>
          <SheetTrigger className='flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium border border-border/50'>
            <Settings className='h-4 w-4 text-foreground' />
            <span>{t('Header.Settings')}</span>
          </SheetTrigger>
          <SheetContent side='bottom' className='h-[80vh] rounded-t-xl'>
            <SheetHeader className='space-y-4'>
              <SheetTitle className='text-left'>
                {t('Header.Settings')}
              </SheetTitle>
              <SheetDescription className='text-left'>
                {t('Header.Navigation and settings')}
              </SheetDescription>
            </SheetHeader>

            <div className='flex flex-col space-y-4 mt-6'>
              <LanguageSwitcher />
              <ThemeSwitcher />
              <UserButton />
            </div>

            {/* Navigation Links */}
            {headerMenus.length > 0 && (
              <div className='mt-8 pt-6 border-t border-border/50'>
                <h3 className='text-sm font-semibold text-muted-foreground mb-4'>
                  Navigation
                </h3>
                <div className='grid grid-cols-1 gap-2'>
                  {headerMenus.map((menu) => {
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
                          return <MenuIcon className='h-4 w-4' />
                      }
                    }

                    return (
                      <Link
                        key={menu.href}
                        href={menu.href}
                        className='flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm'
                      >
                        <div className='text-muted-foreground'>
                          {getIcon(menu.name)}
                        </div>
                        <span className='text-foreground'>
                          {t('Header.' + menu.name)}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export default Menu
