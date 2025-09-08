import Link from 'next/link'
import { Settings, Shield, Sparkles, Star, Award, TrendingUp } from 'lucide-react'
import { DrawerClose } from '@/components/ui/drawer'
import { getTranslations } from 'next-intl/server'
import { Session } from 'next-auth'

interface HelpSettingsAccordionProps {
  session: Session | null
}

export default async function HelpSettingsAccordion({
  session,
}: HelpSettingsAccordionProps) {
  const t = await getTranslations()

  return (
    <div className='border-t border-border/50 bg-muted/30'>
      {/* Header - Always visible */}
      <div className='p-3'>
        <div className='flex items-center space-x-2'>
          <Settings className='h-4 w-4 text-primary' />
          <h2 className='text-base font-semibold text-foreground'>Dashboard</h2>
        </div>
      </div>

      {/* Content - Always visible */}
      <div className='border-t border-border/50'>
        <div className='flex flex-col'>
          {/* Navigation Links */}
          <DrawerClose asChild>
            <Link
              href='/search?q=&sort=createdAt&order=desc'
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border/20 text-foreground'
            >
              <Sparkles className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>{t('Header.Today\'s Deal')}</span>
            </Link>
          </DrawerClose>

          <DrawerClose asChild>
            <Link
              href='/search?q=&sort=createdAt&order=desc'
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border/20 text-foreground'
            >
              <Star className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>{t('Header.New Arrivals')}</span>
            </Link>
          </DrawerClose>

          <DrawerClose asChild>
            <Link
              href='/search?q=&sort=featured&order=desc'
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border/20 text-foreground'
            >
              <Award className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>{t('Header.Featured Products')}</span>
            </Link>
          </DrawerClose>

          <DrawerClose asChild>
            <Link
              href='/search?q=&sort=sold&order=desc'
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border/20 text-foreground'
            >
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>{t('Header.Best Sellers')}</span>
            </Link>
          </DrawerClose>

          {/* Admin Link */}
          {session?.user?.role === 'Admin' && (
            <DrawerClose asChild>
              <Link
                href='/admin/overview'
                className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors text-foreground'
              >
                <Shield className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>{t('Header.Admin')}</span>
              </Link>
            </DrawerClose>
          )}
        </div>
      </div>
    </div>
  )
}
