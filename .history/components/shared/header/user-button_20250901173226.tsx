import { auth } from '@/auth'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOut } from '@/lib/actions/user.actions'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, User, Settings } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function UserButton() {
  const t = await getTranslations()
  const session = await auth()
  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger className='flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors' asChild>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
              <User className='h-4 w-4 text-primary' />
            </div>
            <div className='flex flex-col text-xs text-left'>
              <span className='text-foreground'>
                {t('Header.Hello')},{' '}
                {session ? session.user.name : t('Header.sign in')}
              </span>
              <span className='font-bold text-muted-foreground'>{t('Header.Account & Orders')}</span>
            </div>
            <ChevronDownIcon className='h-4 w-4 text-muted-foreground' />
          </div>
        </DropdownMenuTrigger>
        {session ? (
          <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>
                  {session.user.name}
                </p>
                <p className='text-xs leading-none text-muted-foreground'>
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <Link className='w-full' href='/account'>
                <DropdownMenuItem className='flex items-center space-x-2'>
                  <User className='h-4 w-4' />
                  <span>{t('Header.Your account')}</span>
                </DropdownMenuItem>
              </Link>
              <Link className='w-full' href='/account/orders'>
                <DropdownMenuItem className='flex items-center space-x-2'>
                  <Settings className='h-4 w-4' />
                  <span>{t('Header.Your orders')}</span>
                </DropdownMenuItem>
              </Link>

              {session.user.role === 'Admin' && (
                <Link className='w-full' href='/admin/overview'>
                  <DropdownMenuItem className='flex items-center space-x-2'>
                    <Settings className='h-4 w-4' />
                    <span>{t('Header.Admin')}</span>
                  </DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuGroup>
            <DropdownMenuItem className='p-0 mb-1'>
              <form action={SignOut} className='w-full'>
                <Button
                  className='w-full py-4 px-2 h-4 justify-start'
                  variant='ghost'
                >
                  {t('Header.Sign out')}
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  className={cn(buttonVariants(), 'w-full')}
                  href='/sign-in'
                >
                  {t('Header.Sign in')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className='font-normal'>
                {t('Header.New Customer')}?{' '}
                <Link href='/sign-up'>{t('Header.Sign up')}</Link>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
