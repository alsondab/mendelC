'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Star,
  TrendingUp,
  History,
  MessageCircle,
  Info,
  HelpCircle,
} from 'lucide-react'
import { DrawerClose } from '@/components/ui/drawer'
import { useTranslations } from 'next-intl'
import data from '@/lib/data'

export default function NavigationAccordion() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const t = useTranslations()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className='border-t border-border/50 bg-muted/20'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors'
      >
        <div className='flex items-center space-x-2'>
          <Sparkles className='h-4 w-4 text-primary' />
          <h2 className='text-base font-semibold text-foreground'>
            {t('Header.Navigation')}
          </h2>
        </div>
        {isMounted && isOpen ? (
          <ChevronUp className='h-4 w-4 text-muted-foreground' />
        ) : (
          <ChevronDown className='h-4 w-4 text-muted-foreground' />
        )}
      </button>

      {isMounted && isOpen && (
        <div className='grid grid-cols-2 gap-1 p-2 border-t border-border/50'>
          {data.headerMenus.map((menu) => {
            const getIcon = (name: string) => {
              switch (name) {
                case "Today's Deal":
                  return <Clock className='h-4 w-4' />
                case 'New Arrivals':
                  return <Sparkles className='h-4 w-4' />
                case 'Featured Products':
                  return <Star className='h-4 w-4' />
                case 'Best Sellers':
                  return <TrendingUp className='h-4 w-4' />
                case 'Browsing History':
                  return <History className='h-4 w-4' />
                case 'Customer Service':
                  return <MessageCircle className='h-4 w-4' />
                case 'About Us':
                  return <Info className='h-4 w-4' />
                case 'Help':
                  return <HelpCircle className='h-4 w-4' />
                default:
                  return <Sparkles className='h-4 w-4' />
              }
            }

            return (
              <DrawerClose asChild key={menu.href}>
                <Link
                  href={menu.href}
                  className='flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-muted/50 transition-colors text-center group'
                >
                  <div className='text-muted-foreground group-hover:text-primary transition-colors'>
                    {getIcon(menu.name)}
                  </div>
                  <span className='text-xs font-medium text-foreground leading-tight'>
                    {t('Header.' + menu.name)}
                  </span>
                </Link>
              </DrawerClose>
            )
          })}
        </div>
      )}
    </div>
  )
}
