import { EllipsisVertical } from 'lucide-react'
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
    <div className='flex justify-end'>
      {/* Desktop Menu */}
      <nav className='nav-menu'>
        <LanguageSwitcher />
        <ThemeSwitcher />
        <UserButton />
        {!forAdmin && <CartButton />}
      </nav>

      {/* Mobile Menu */}
      <nav className='nav-menu-mobile'>
        <Sheet>
          <SheetTrigger className='header-button'>
            <EllipsisVertical className='h-6 w-6' />
          </SheetTrigger>
          <SheetContent className='bg-gray-900 text-white border-l border-white/10'>
            <SheetHeader className='w-full'>
              <SheetTitle className='text-xl font-semibold'>
                {t('Header.Site Menu')}
              </SheetTitle>
              <SheetDescription className='text-white/60'>
                {t('Header.Navigation and Settings')}
              </SheetDescription>
            </SheetHeader>

            <div className='flex flex-col space-y-4 mt-6'>
              <LanguageSwitcher />
              <ThemeSwitcher />
              <UserButton />
              {!forAdmin && <CartButton />}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu
