import Link from 'next/link'
import {
  Settings,
  Shield,
  Sparkles,
  Star,
  Award,
  TrendingUp,
  MessageCircle,
  Truck,
  RotateCcw,
  HelpCircle,
  Info,
  Phone,
} from 'lucide-react'
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
      {/* Navigation Section - Mobile Only */}
      <div className='p-3 border-b border-border/50 lg:hidden'>
        <div className='flex items-center space-x-2'>
          <Settings className='h-4 w-4 text-primary' />
          <h2 className='text-base font-semibold text-foreground'>
            Navigation
          </h2>
        </div>
      </div>

      {/* Navigation Links - Mobile Only */}
      <div className='border-b border-border/50 lg:hidden'>
        <div className='flex flex-col'>
          <DrawerClose asChild>
            <Link
              href='/search?q=&sort=createdAt&order=desc'
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border/20 text-foreground'
            >
              <Sparkles className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>{t("Header.Today's Deal")}</span>
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
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors text-foreground'
            >
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>{t('Header.Best Sellers')}</span>
            </Link>
          </DrawerClose>

          <DrawerClose asChild>
            <Link
              href='/service-client'
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors text-foreground'
            >
              <MessageCircle className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>Service client</span>
            </Link>
          </DrawerClose>

          <DrawerClose asChild>
            <Link
              href='/suivi-livraison'
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors text-foreground'
            >
              <Truck className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>Suivi de livraison</span>
            </Link>
          </DrawerClose>

          <DrawerClose asChild>
            <Link
              href='/politique-retour'
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors text-foreground'
            >
              <RotateCcw className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>Politique de retour</span>
            </Link>
          </DrawerClose>

          <DrawerClose asChild>
            <Link
              href='/centre-aide'
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors text-foreground'
            >
              <HelpCircle className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>Centre d&apos;aide</span>
            </Link>
          </DrawerClose>

          <DrawerClose asChild>
            <Link
              href='/questions-frequentes'
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors text-foreground'
            >
              <Info className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>Questions fréquentes</span>
            </Link>
          </DrawerClose>

          <DrawerClose asChild>
            <Link
              href='/a-propos'
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors text-foreground'
            >
              <Info className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>À propos</span>
            </Link>
          </DrawerClose>

          <DrawerClose asChild>
            <Link
              href='/contact'
              className='flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors text-foreground'
            >
              <Phone className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>Contact</span>
            </Link>
          </DrawerClose>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className='p-3'>
        <div className='flex items-center space-x-2'>
          <Settings className='h-4 w-4 text-primary' />
          <h2 className='text-base font-semibold text-foreground'>Dashboard</h2>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className='border-t border-border/50'>
        <div className='flex flex-col'>
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
