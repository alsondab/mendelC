import * as React from 'react'
import Link from 'next/link'
import {
  X,
  ChevronRight,
  UserCircle,
  ShoppingBag,
  Grid3X3,
  HelpCircle,
  Settings,
  LogOut,
  LogIn,
  User,
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
import { ICategory } from '@/types'

export default async function Sidebar({
  categories,
}: {
  categories: (ICategory & { subCategories: ICategory[] })[]
}) {
  const session = await auth()
  const locale = await getLocale()
  const t = await getTranslations()

  return (
    <Drawer direction={getDirection(locale) === 'rtl' ? 'right' : 'left'}>
      <DrawerTrigger className='flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium border border-border/50'>
        <Grid3X3 className='h-4 w-4' />
        <span>{t('Header.Menu')}</span>
      </DrawerTrigger>

      <DrawerContent className='w-[280px] sm:w-[320px] md:w-[400px] mt-0 top-0'>
        <div className='flex flex-col h-full bg-background'>
          {/* User Section */}
          <div className='border-b border-border/50 bg-muted/30'>
            <DrawerHeader className='pb-3'>
              <DrawerTitle className='flex items-center space-x-2'>
                <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                  <UserCircle className='h-5 w-5 text-primary' />
                </div>
                <div className='flex-1'>
                  {session ? (
                    <DrawerClose asChild>
                      <Link href='/account' className='block'>
                        <span className='text-base font-semibold text-foreground'>
                          {t('Header.Hello')}, {session.user.name}
                        </span>
                        <p className='text-xs text-muted-foreground'>
                          {t('Header.View your account')}
                        </p>
                      </Link>
                    </DrawerClose>
                  ) : (
                    <DrawerClose asChild>
                      <Link href='/sign-in' className='block'>
                        <span className='text-base font-semibold text-foreground'>
                          {t('Header.Hello')}, {t('Header.sign in')}
                        </span>
                        <p className='text-xs text-muted-foreground'>
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
                className='absolute top-3 right-3 h-8 w-8'
              >
                <X className='h-4 w-4' />
                <span className='sr-only'>{t('Header.Close')}</span>
              </Button>
            </DrawerClose>
          </div>

          {/* Categories Section */}
          <div className='flex-1 overflow-y-auto'>
            <div className='p-3 border-b border-border/50'>
              <div className='flex items-center space-x-2'>
                <ShoppingBag className='h-4 w-4 text-primary' />
                <h2 className='text-base font-semibold text-foreground'>
                  {t('Header.Shop By Department')}
                </h2>
              </div>
            </div>

            <nav className='flex flex-col'>
              {categories.map((category) => (
                <div key={category._id} className='border-b border-border/20 last:border-b-0'>
                  {/* Main Category */}
                  <DrawerClose asChild>
                    <Link
                      href={`/search?category=${category.name}`}
                      className='flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors'
                    >
                      <span className='text-sm text-foreground font-medium'>
                        {category.name}
                      </span>
                      <ChevronRight className='h-3 w-3 text-muted-foreground' />
                    </Link>
                  </DrawerClose>
                  
                  {/* Subcategories */}
                  {category.subCategories && category.subCategories.length > 0 && (
                    <div className='ml-4 border-l border-border/20'>
                      {category.subCategories.map((subCategory) => (
                        <DrawerClose asChild key={subCategory._id}>
                          <Link
                            href={`/search?category=${category.name}&subCategory=${subCategory.name}`}
                            className='flex items-center justify-between px-3 py-2 hover:bg-muted/30 transition-colors text-xs text-muted-foreground hover:text-foreground'
                          >
                            <span className='text-xs text-muted-foreground hover:text-foreground'>
                              {subCategory.name}
                            </span>
                            <ChevronRight className='h-2 w-2 text-muted-foreground' />
                          </Link>
                        </DrawerClose>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Help & Settings Section */}
          <div className='border-t border-border/50 bg-muted/30'>
            <div className='p-3 border-b border-border/50'>
              <div className='flex items-center space-x-2'>
                <Settings className='h-4 w-4 text-primary' />
                <h2 className='text-base font-semibold text-foreground'>
                  {t('Header.Help & Settings')}
                </h2>
              </div>
            </div>

            <div className='flex flex-col'>
              <DrawerClose asChild>
                <Link
                  href='/account'
                  className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border/20 text-foreground'
                >
                  <User className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>{t('Header.Your account')}</span>
                </Link>
              </DrawerClose>

              <DrawerClose asChild>
                <Link
                  href='/page/customer-service'
                  className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border/20 text-foreground'
                >
                  <HelpCircle className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>
                    {t('Header.Customer Service')}
                  </span>
                </Link>
              </DrawerClose>

              {session ? (
                <form action={SignOut} className='w-full'>
                  <Button
                    className='w-full justify-start px-3 py-2 h-auto rounded-none hover:bg-muted/50 transition-colors text-foreground'
                    variant='ghost'
                  >
                    <LogOut className='h-4 w-4 text-muted-foreground mr-2' />
                    <span className='text-sm'>{t('Header.Sign out')}</span>
                  </Button>
                </form>
              ) : (
                <DrawerClose asChild>
                  <Link
                    href='/sign-in'
                    className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors text-foreground'
                  >
                    <LogIn className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm'>{t('Header.Sign in')}</span>
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
