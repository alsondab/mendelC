import {
  Menu as MenuIcon,
  Star,
  Clock,
  Sparkles,
  TrendingUp,
  History,
  HelpCircle,
  Info,
  MessageCircle,
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
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface MenuProps {
  forAdmin?: boolean
  headerMenus?: Array<{ name: string; href: string }>
}

const Menu = ({ forAdmin = false, headerMenus = [] }: MenuProps) => {
  const t = useTranslations()
  return (
    <>
      {/* Desktop Menu */}
      <div className='hidden md:flex items-center space-x-2'>
        {!forAdmin && <CartButton />}
      </div>

      {/* Mobile Menu */}
      <div className='md:hidden'>
        <Sheet>
          <SheetTrigger className='flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium border border-border/50'>
            <MenuIcon className='h-4 w-4 text-foreground' />
            <span className='text-foreground'>Menu</span>
          </SheetTrigger>
          <SheetContent side='bottom' className='h-[90vh] rounded-t-xl'>
            <SheetHeader className='space-y-2'>
              <SheetTitle className='text-left text-lg'>Navigation</SheetTitle>
              <SheetDescription className='text-left text-sm'>
                Explorez nos catégories et services
              </SheetDescription>
            </SheetHeader>

            <div className='flex-1 overflow-y-auto py-4'>
              {/* Navigation Links */}
              {headerMenus.length > 0 && (
                <div className='space-y-3'>
                  <div className='grid grid-cols-2 gap-2'>
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
                          className='flex flex-col items-center space-y-2 px-3 py-4 rounded-lg hover:bg-muted/50 transition-colors text-sm border border-border/50'
                        >
                          <div className='text-muted-foreground'>
                            {getIcon(menu.name)}
                          </div>
                          <span className='text-foreground text-xs text-center leading-tight'>
                            {t('Header.' + menu.name)}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export default Menu
