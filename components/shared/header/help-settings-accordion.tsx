'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronUp,
  Settings,
  User,
  HelpCircle,
  LogOut,
  LogIn,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignOut } from '@/lib/actions/user.actions'
import { DrawerClose } from '@/components/ui/drawer'
import { useTranslations } from 'next-intl'
import { Session } from 'next-auth'

interface HelpSettingsAccordionProps {
  session: Session | null
}

export default function HelpSettingsAccordion({
  session,
}: HelpSettingsAccordionProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const t = useTranslations()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className='border-t border-border/50 bg-muted/30'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors'
      >
        <div className='flex items-center space-x-2'>
          <Settings className='h-4 w-4 text-primary' />
          <h2 className='text-base font-semibold text-foreground'>
            {t('Header.Help & Settings')}
          </h2>
        </div>
        {isMounted && isOpen ? (
          <ChevronUp className='h-4 w-4 text-muted-foreground' />
        ) : (
          <ChevronDown className='h-4 w-4 text-muted-foreground' />
        )}
      </button>

      {isMounted && isOpen && (
        <div className='border-t border-border/50'>
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
                <span className='text-sm'>{t('Header.Customer Service')}</span>
              </Link>
            </DrawerClose>

            {session?.user ? (
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
      )}
    </div>
  )
}
