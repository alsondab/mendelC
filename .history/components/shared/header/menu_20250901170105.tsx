import { EllipsisVertical, Menu as MenuIcon } from 'lucide-react'
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
    <div className='flex items-center gap-2'>
      {/* Desktop Actions */}
      <nav className='hidden md:flex items-center gap-2'>
        <LanguageSwitcher />
        <ThemeSwitcher />
        <UserButton />
        {!forAdmin && <CartButton />}
      </nav>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger className='md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 w-10 hover:bg-accent hover:text-accent-foreground'>
          <MenuIcon className='h-5 w-5' />
          <span className='sr-only'>Toggle menu</span>
        </SheetTrigger>
        <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
          <SheetHeader>
            <SheetTitle>{t('Header.Site Menu')}</SheetTitle>
            <SheetDescription>
              Accédez à toutes les fonctionnalités du site
            </SheetDescription>
          </SheetHeader>
          <div className='flex flex-col gap-4 mt-6'>
            <LanguageSwitcher />
            <ThemeSwitcher />
            <UserButton />
            {!forAdmin && <CartButton />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Menu
