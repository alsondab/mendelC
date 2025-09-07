import * as React from 'react'
import Link from 'next/link'
import { X, UserCircle, Settings, Grid3X3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import LanguageSwitcher from './language-switcher'
import HelpSettingsAccordion from './help-settings-accordion'
import LogoutButton from './logout-button'

export default async function Sidebar() {
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

          {/* Theme & Currency Section */}
          <div className='flex-1 overflow-y-auto'>
            <div className='p-3 border-b border-border/50'>
              <div className='flex items-center space-x-2'>
                <Settings className='h-4 w-4 text-primary' />
                <h2 className='text-base font-semibold text-foreground'>
                  {t('Header.Preferences')}
                </h2>
              </div>
              <p className='text-xs text-muted-foreground mt-1 px-1'>
                Personnalisez votre expérience
              </p>
            </div>

            <div className='p-3 space-y-3'>
              <div className='space-y-2'>
                <h3 className='text-sm font-medium text-foreground'>
                  {t('Header.Language')} & {t('Header.Currency')}
                </h3>
                <LanguageSwitcher />
              </div>
            </div>

            {/* Help & Settings Section */}
            <HelpSettingsAccordion session={session} />

            {/* Login/Logout Section */}
            <div className='border-t border-border/50 bg-muted/30'>
              <div className='p-3'>
                {session ? (
                  <LogoutButton />
                ) : (
                  <DrawerClose asChild>
                    <Link
                      href='/sign-in'
                      className='flex items-center justify-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium border border-border/50 w-full'
                    >
                      <span>Connexion</span>
                    </Link>
                  </DrawerClose>
                )}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
