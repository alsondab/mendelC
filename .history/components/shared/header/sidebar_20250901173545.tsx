import * as React from 'react'
import Link from 'next/link'
import {
  X,
  ChevronRight,
  UserCircle,
  MenuIcon,
  ShoppingBag,
  Grid3X3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignOut } from '@/lib/actions/user.actions'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { auth } from '@/auth'
import { getLocale, getTranslations } from 'next-intl/server'
import { getDirection } from '@/i18n-config'

export default async function Sidebar({
  categories,
}: {
  categories: string[]
}) {
  const session = await auth()
  const locale = await getLocale()
  const t = await getTranslations()

  return (
    <Drawer direction={getDirection(locale) === 'rtl' ? 'right' : 'left'}>
      <DrawerTrigger className='flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium border border-border/50'>
        <Grid3X3 className='h-4 w-4' />
        <span className='hidden sm:block'>{t('Header.All')}</span>
      </DrawerTrigger>

      <DrawerContent className='w-[320px] sm:w-[400px] mt-0 top-0'>
        <div className='flex flex-col h-full bg-background'>
          {/* User Section */}
          <div className='border-b border-border/50 bg-muted/30'>
            <DrawerHeader className='pb-4'>
              <DrawerTitle className='flex items-center space-x-3'>
                <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                  <UserCircle className='h-6 w-6 text-primary' />
                </div>
                <div className='flex-1'>
                  {session ? (
                    <DrawerClose asChild>
                      <Link href='/account' className='block'>
                        <span className='text-lg font-semibold text-foreground'>
                          {t('Header.Hello')}, {session.user.name}
                        </span>
                        <p className='text-sm text-muted-foreground'>
                          {t('Header.View your account')}
                        </p>
                      </Link>
                    </DrawerClose>
                  ) : (
                    <DrawerClose asChild>
                      <Link href='/sign-in' className='block'>
                        <span className='text-lg font-semibold text-foreground'>
                          {t('Header.Hello')}, {t('Header.sign in')}
                        </span>
                        <p className='text-sm text-muted-foreground'>
                          {t('Header.Sign in to your account')}
                        </p>
                      </Link>
                    </DrawerClose>
                  )}
                </div>
              </DrawerTitle>
            </DrawerHeader>

            <DrawerClose asChild>
              <Button
                variant='ghost'
                size='icon'
                className='absolute top-4 right-4'
              >
                <X className='h-4 w-4' />
                <span className='sr-only'>{t('Header.Close')}</span>
              </Button>
            </DrawerClose>
          </div>

          {/* Categories Section */}
          <div className='flex-1 overflow-y-auto'>
            <div className='p-4 border-b border-border/50'>
              <div className='flex items-center space-x-2'>
                <ShoppingBag className='h-5 w-5 text-primary' />
                <h2 className='text-lg font-semibold text-foreground'>
                  {t('Header.Shop By Department')}
                </h2>
              </div>
            </div>

            <nav className='flex flex-col'>
              {categories.map((category) => (
                <DrawerClose asChild key={category}>
                  <Link
                    href={`/search?category=${category}`}
                    className='flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/20 last:border-b-0'
                  >
                    <span className='text-foreground font-medium'>
                      {category}
                    </span>
                    <ChevronRight className='h-4 w-4 text-muted-foreground' />
                  </Link>
                </DrawerClose>
              ))}
            </nav>
          </div>

          {/* Help & Settings Section */}
          <div className='border-t border-border/50 bg-muted/30'>
            <div className='p-4 border-b border-border/50'>
              <h2 className='text-lg font-semibold text-foreground'>
                {t('Header.Help & Settings')}
              </h2>
            </div>

            <div className='flex flex-col'>
              <DrawerClose asChild>
                <Link
                  href='/account'
                  className='px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/20 text-foreground'
                >
                  {t('Header.Your account')}
                </Link>
              </DrawerClose>

              <DrawerClose asChild>
                <Link
                  href='/page/customer-service'
                  className='px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/20 text-foreground'
                >
                  {t('Header.Customer Service')}
                </Link>
              </DrawerClose>

              {session ? (
                <form action={SignOut} className='w-full'>
                  <Button
                    className='w-full justify-start px-4 py-3 h-auto rounded-none hover:bg-muted/50 transition-colors text-foreground'
                    variant='ghost'
                  >
                    {t('Header.Sign out')}
                  </Button>
                </form>
              ) : (
                <DrawerClose asChild>
                  <Link
                    href='/sign-in'
                    className='px-4 py-3 hover:bg-muted/50 transition-colors text-foreground'
                  >
                    {t('Header.Sign in')}
                  </Link>
                </DrawerClose>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
