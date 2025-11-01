import { auth } from '@/auth'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOut } from '@/lib/actions/user.actions'
import { cn } from '@/lib/utils'
import {
  ChevronDownIcon,
  User,
  Settings,
  Shield,
  Package,
  Home,
  UserCircle,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function UserButton() {
  const t = await getTranslations()
  const session = await auth()
  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger
          className='flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-muted/80 transition-colors'
          asChild
        >
          <div className='flex items-center space-x-1.5 sm:space-x-2'>
            <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
              <User className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary' />
            </div>
            <div className='flex flex-col text-[10px] xs:text-xs text-left min-w-0 flex-1'>
              <span className='text-foreground truncate'>
                {t('Header.Hello')},{' '}
                {session ? session.user.name : t('Header.sign in')}
              </span>
              <span className='font-bold text-muted-foreground truncate'>
                {t('Header.Account & Orders')}
              </span>
            </div>
            <ChevronDownIcon className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0' />
          </div>
        </DropdownMenuTrigger>
        {session ? (
          <DropdownMenuContent
            className='w-56 sm:w-64 md:w-72 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40'
            align='end'
            forceMount
          >
            {/* Header - infos utilisateur */}
            <DropdownMenuLabel className='font-normal border-b border-border/50 pb-2 sticky top-0 bg-popover z-10'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none truncate'>
                  {session.user.name}
                </p>
                <p className='text-xs leading-none text-muted-foreground truncate'>
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>

            {/* Section Compte principal */}
            <DropdownMenuGroup className='py-1'>
              <Link className='w-full' href='/account'>
                <DropdownMenuItem className='flex items-center space-x-2 cursor-pointer'>
                  <UserCircle className='h-4 w-4 flex-shrink-0' />
                  <span className='truncate'>{t('Header.Your account')}</span>
                </DropdownMenuItem>
              </Link>
              <Link className='w-full' href='/account/orders'>
                <DropdownMenuItem className='flex items-center space-x-2 cursor-pointer'>
                  <Package className='h-4 w-4 flex-shrink-0' />
                  <span className='truncate'>{t('Header.Your orders')}</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Section Gestion */}
            <DropdownMenuGroup className='py-1'>
              <Link className='w-full' href='/account/addresses'>
                <DropdownMenuItem className='flex items-center space-x-2 cursor-pointer'>
                  <Home className='h-4 w-4 flex-shrink-0' />
                  <span className='truncate'>
                    {t('Header.Addresses') || 'Adresses'}
                  </span>
                </DropdownMenuItem>
              </Link>
              <Link className='w-full' href='/account/settings'>
                <DropdownMenuItem className='flex items-center space-x-2 cursor-pointer'>
                  <Settings className='h-4 w-4 flex-shrink-0' />
                  <span className='truncate'>
                    {t('Header.Settings') || 'Paramètres'}
                  </span>
                </DropdownMenuItem>
              </Link>
              <Link className='w-full' href='/account/manage'>
                <DropdownMenuItem className='flex items-center space-x-2 cursor-pointer'>
                  <User className='h-4 w-4 flex-shrink-0' />
                  <span className='truncate'>
                    {t('Header.Manage account') || 'Gérer le compte'}
                  </span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            {/* Section Admin - conditionnelle */}
            {session.user.role === 'Admin' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className='py-1'>
                  <Link className='w-full' href='/admin/overview'>
                    <DropdownMenuItem className='flex items-center space-x-2 cursor-pointer'>
                      <Shield className='h-4 w-4 flex-shrink-0' />
                      <span className='truncate'>{t('Header.Admin')}</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
              </>
            )}

            {/* Section Déconnexion - Sticky en bas */}
            <div className='border-t border-border/50 pt-1 sticky bottom-0 bg-popover'>
              <DropdownMenuItem className='p-0 mt-1'>
                <form action={SignOut} className='w-full'>
                  <Button
                    className='w-full py-4 px-2 h-9 justify-start font-medium'
                    variant='ghost'
                  >
                    {t('Header.Sign out')}
                  </Button>
                </form>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent
            className='w-56 sm:w-64 md:w-72'
            align='end'
            forceMount
          >
            <DropdownMenuGroup>
              <DropdownMenuItem className='p-0'>
                <Link
                  className={cn(buttonVariants(), 'w-full')}
                  href='/sign-in'
                >
                  {t('Header.Sign in')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>
              <div className='font-normal text-sm'>
                {t('Header.New Customer')}?{' '}
                <Link href='/sign-up' className='text-primary hover:underline'>
                  {t('Header.Sign up')}
                </Link>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
