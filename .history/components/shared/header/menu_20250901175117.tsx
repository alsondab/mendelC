import { Menu as MenuIcon, Settings, Grid3X3 } from 'lucide-react'
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

const Menu = ({ forAdmin = false }: { forAdmin?: boolean }) => {
  const t = useTranslations()
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
      <div className='md:hidden'>
        <Sheet>
          <SheetTrigger className='flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium border border-border/50'>
            <Settings className='h-4 w-4 text-foreground' />
            <span>{t('Header.Settings')}</span>
          </SheetTrigger>
          <SheetContent
            side='bottom'
            className='h-[25vh] max-w-sm mx-auto rounded-t-xl'
          >
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
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export default Menu
