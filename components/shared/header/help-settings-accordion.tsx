import Link from 'next/link'
import { Settings, User, HelpCircle, Shield, Heart } from 'lucide-react'
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
          <h2 className='text-base font-semibold text-foreground'>
            {t('Header.Help & Settings')}
          </h2>
        </div>
      </div>

      {/* Content - Always visible */}
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
              href='/wishlist'
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border/20 text-foreground'
            >
              <Heart className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>{t('Header.Wishlist')}</span>
            </Link>
          </DrawerClose>

          {session?.user?.role === 'Admin' && (
            <DrawerClose asChild>
              <Link
                href='/admin/overview'
                className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border/20 text-foreground'
              >
                <Shield className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>{t('Header.Admin')}</span>
              </Link>
            </DrawerClose>
          )}

          <DrawerClose asChild>
            <Link
              href='/page/customer-service'
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border/20 text-foreground'
            >
              <HelpCircle className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>{t('Header.Customer Service')}</span>
            </Link>
          </DrawerClose>
        </div>
      </div>
    </div>
  )
}
