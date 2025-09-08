'use client'

import { Menu as MenuIcon } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import CartButton from './cart-button'
import WishlistCount from './wishlist-count'
import LanguageSwitcher from './language-switcher'
import { useSession } from 'next-auth/react'

interface MenuProps {
  forAdmin?: boolean
}

const Menu = ({ forAdmin = false }: MenuProps) => {
  const { data: session } = useSession()

  return (
    <>
      {/* Desktop Menu */}
      <div className='hidden md:flex items-center space-x-2'>
        {!forAdmin && <CartButton />}
        {!forAdmin && session && <WishlistCount />}
        <LanguageSwitcher />
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
              {/* Menu content removed */}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export default Menu
