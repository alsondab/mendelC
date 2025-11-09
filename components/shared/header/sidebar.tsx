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
      <DrawerTrigger className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium border border-border/50">
        <Grid3X3 className="h-4 w-4" />
        <span>{t('Header.Menu')}</span>
      </DrawerTrigger>

      <DrawerContent className="w-[280px] sm:w-[320px] md:w-[400px] mt-0 top-0 max-h-screen overflow-hidden flex flex-col !h-screen !inset-y-0 !left-0 !right-auto !bottom-auto !rounded-none [&>[data-vaul-handle]]:hidden">
        <div className="flex flex-col h-full bg-background min-h-0 overflow-hidden">
          {/* User Section - Fixe en haut */}
          <div className="border-b border-border/50 bg-muted/30 flex-shrink-0 relative">
            <DrawerHeader className="pb-3 pt-4">
              <DrawerTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <UserCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  {session ? (
                    <DrawerClose asChild>
                      <Link href="/account" className="block">
                        <span className="text-base font-semibold text-foreground truncate block">
                          {t('Header.Hello')}, {session.user.name}
                        </span>
                        <p className="text-xs text-muted-foreground truncate">
                          {t('Header.View your account')}
                        </p>
                      </Link>
                    </DrawerClose>
                  ) : (
                    <DrawerClose asChild>
                      <Link href="/sign-in" className="block">
                        <span className="text-base font-semibold text-foreground">
                          {t('Header.Hello')}, {t('Header.sign in')}
                        </span>
                        <p className="text-xs text-muted-foreground">
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
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">{t('Header.Close')}</span>
              </Button>
            </DrawerClose>
          </div>

          {/* Contenu scrollable - Prend l'espace restant */}
          <div className="flex-1 overflow-y-auto overscroll-contain pr-1 min-h-0 sidebar-scroll">
            <div className="space-y-0 pb-20 sm:pb-16">
              {/* Préférences Section */}
              <div className="p-3 sm:p-4 border-b border-border/50">
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-primary flex-shrink-0" />
                  <h2 className="text-base font-semibold text-foreground">
                    {t('Header.Preferences')}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-1">
                  {t('Header.Personalize your experience')}
                </p>
              </div>

              {/* Language Section */}
              <div className="p-3 sm:p-4 space-y-3">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground">
                    {t('Header.Language')} & {t('Header.Currency')}
                  </h3>
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Help & Settings Section */}
              <HelpSettingsAccordion session={session} />

              {/* Login/Logout Section - Layout responsive avec boutons côte à côte sur mobile */}
              <div className="border-t border-border/50 bg-gradient-to-r from-muted/40 to-muted/20 mt-4">
                <div className="p-3 sm:p-4 pb-16 sm:pb-12">
                  <div className="text-center mb-3">
                    <h3 className="text-sm font-semibold text-foreground mb-2">
                      {session ? t('Header.Account') : t('Header.Get started')}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {session
                        ? t('Header.Manage your account')
                        : t('Header.Sign in to access all features')}
                    </p>
                  </div>

                  {session ? (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <DrawerClose asChild className="flex-1 min-w-0">
                        <Link
                          href="/account"
                          className="flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all duration-200 text-xs sm:text-sm font-medium border border-primary/20 w-full h-full group"
                        >
                          <UserCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                          <span className="text-primary font-semibold truncate">
                            {t('Header.My Account')}
                          </span>
                        </Link>
                      </DrawerClose>
                      <div className="flex-1 min-w-0">
                        <LogoutButton />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <DrawerClose asChild>
                        <Link
                          href="/sign-in"
                          className="flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-200 text-xs sm:text-sm font-semibold text-primary-foreground flex-1 min-w-0 group shadow-sm hover:shadow-md"
                        >
                          <UserCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                          <span className="truncate">
                            {t('Header.Sign In')}
                          </span>
                        </Link>
                      </DrawerClose>
                      <DrawerClose asChild>
                        <Link
                          href="/sign-up"
                          className="flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-muted hover:bg-muted/80 transition-all duration-200 text-xs sm:text-sm font-medium border border-border/50 flex-1 min-w-0 group"
                        >
                          <span className="truncate group-hover:scale-105 transition-transform">
                            {t('Header.Sign Up')}
                          </span>
                        </Link>
                      </DrawerClose>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
