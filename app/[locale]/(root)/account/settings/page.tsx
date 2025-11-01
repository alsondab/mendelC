'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Bell,
  Shield,
  Palette,
  Globe,
  Trash2,
  Download,
  Upload,
  Sun,
  Moon,
} from 'lucide-react'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import useSettingStore from '@/hooks/use-setting-store'
import { setCurrencyOnServer } from '@/lib/actions/setting.actions'
import { i18n } from '@/i18n-config'
import { usePathname, useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import DeleteAccountDialog from './delete-account-dialog'

export default function SettingsPage() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const t = useTranslations('Settings')
  const tAccount = useTranslations('Account')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const {
    setting: { availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()

  const handleCurrencyChange = async (newCurrency: string) => {
    await setCurrencyOnServer(newCurrency)
    setCurrency(newCurrency)
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  return (
    <>
      <div className='p-1 xs:p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto'>
        <div className='mb-6 xs:mb-8'>
          <nav className='flex items-center gap-2 text-sm xs:text-base mb-4'>
            <Link
              href='/account'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              {tAccount('Title')}
            </Link>
            <span className='text-muted-foreground'>›</span>
            <span className='text-foreground font-medium'>
              {tAccount('Settings')}
            </span>
          </nav>
          <h1 className='text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-2'>
            {tAccount('Settings')}
          </h1>
          <p className='text-sm xs:text-base text-muted-foreground'>
            {tAccount('Settings Description')}
          </p>
        </div>

        <div className='space-y-6'>
          {/* Notifications */}
          <Card className='opacity-75'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Bell className='h-5 w-5 text-blue-600' />
                {t('Notifications')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label htmlFor='email-notifications' className='opacity-75'>
                    {t('Email Notifications')}
                  </Label>
                  <p className='text-sm text-muted-foreground'>
                    {t('Receive updates by email')}
                  </p>
                </div>
                <Switch id='email-notifications' disabled checked={false} />
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label htmlFor='push-notifications' className='opacity-75'>
                    {t('Push Notifications')}
                  </Label>
                  <p className='text-sm text-muted-foreground'>
                    {t('Notifications on your device')}
                  </p>
                </div>
                <Switch id='push-notifications' disabled checked={false} />
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label htmlFor='sms-notifications' className='opacity-75'>
                    {t('SMS Notifications')}
                  </Label>
                  <p className='text-sm text-muted-foreground'>
                    {t('Receive SMS alerts')}
                  </p>
                </div>
                <Switch id='sms-notifications' disabled checked={false} />
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label
                    htmlFor='marketing-notifications'
                    className='opacity-75'
                  >
                    {t('Marketing')}
                  </Label>
                  <p className='text-sm text-muted-foreground'>
                    {t('Special offers and promotions')}
                  </p>
                </div>
                <Switch id='marketing-notifications' disabled checked={false} />
              </div>

              <div className='mt-4 p-3 bg-muted rounded-md'>
                <p className='text-sm text-muted-foreground'>
                  {t('Will be implemented in next version')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Confidentialité */}
          <Card className='opacity-75'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Shield className='h-5 w-5 text-green-600' />
                {t('Privacy')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label htmlFor='profile-visible' className='opacity-75'>
                    {t('Visible Profile')}
                  </Label>
                  <p className='text-sm text-muted-foreground'>
                    {t('Make your profile visible to other users')}
                  </p>
                </div>
                <Switch id='profile-visible' disabled checked={false} />
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label htmlFor='order-history' className='opacity-75'>
                    {t('Order History')}
                  </Label>
                  <p className='text-sm text-muted-foreground'>
                    {t('Save your order history')}
                  </p>
                </div>
                <Switch id='order-history' disabled checked={false} />
              </div>

              <div className='mt-4 p-3 bg-muted rounded-md'>
                <p className='text-sm text-muted-foreground'>
                  {t('Will be implemented in next version')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Préférences */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Palette className='h-5 w-5 text-purple-600' />
                {t('Preferences')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='language'>{t('Language')}</Label>
                  <div className='space-y-2'>
                    {i18n.locales.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          try {
                            router.prefetch(pathname, { locale: l.code })
                          } catch {}
                          router.replace(pathname, { locale: l.code })
                        }}
                        onMouseEnter={() => {
                          try {
                            router.prefetch(pathname, { locale: l.code })
                          } catch {}
                        }}
                        className={`w-full flex items-center gap-2 p-2 rounded-md border transition-colors ${
                          locale === l.code
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted'
                        }`}
                      >
                        <span className='text-lg'>{l.icon}</span>
                        <span>{l.name}</span>
                        {locale === l.code && (
                          <span className='ml-auto text-xs'>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='currency'>{t('Currency')}</Label>
                  <div className='space-y-2'>
                    {availableCurrencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => handleCurrencyChange(c.code)}
                        className={`w-full flex items-center justify-between p-2 rounded-md border transition-colors ${
                          currency === c.code
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted'
                        }`}
                      >
                        <span>
                          {c.symbol} {c.name}
                        </span>
                        {currency === c.code && (
                          <span className='text-xs'>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label>{t('Theme')}</Label>
                  <div className='grid grid-cols-2 gap-2'>
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-md border transition-colors ${
                        theme === 'light'
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted'
                      }`}
                    >
                      <Sun className='h-4 w-4' />
                      <span>{t('Light')}</span>
                      {theme === 'light' && <span className='text-xs'>✓</span>}
                    </button>
                    <button
                      disabled
                      className='flex items-center justify-center gap-2 p-3 rounded-md border transition-colors opacity-50 cursor-not-allowed bg-muted'
                    >
                      <Moon className='h-4 w-4' />
                      <span>{t('Dark')}</span>
                    </button>
                  </div>
                  <div className='mt-2 p-3 bg-muted rounded-md'>
                    <p className='text-sm text-muted-foreground'>
                      {t('Dark theme will be implemented in a future version')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Données */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Globe className='h-5 w-5 text-orange-600' />
                {t('Data')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-col sm:flex-row gap-3'>
                <Button
                  variant='outline'
                  className='flex items-center gap-2 opacity-50 cursor-not-allowed'
                  disabled
                >
                  <Download className='h-4 w-4' />
                  {t('Download my data')}
                </Button>
                <Button
                  variant='outline'
                  className='flex items-center gap-2 opacity-50 cursor-not-allowed'
                  disabled
                >
                  <Upload className='h-4 w-4' />
                  {t('Import data')}
                </Button>
              </div>
              <div className='p-3 bg-muted rounded-md'>
                <p className='text-sm text-muted-foreground'>
                  {t('Will be implemented in next version')}
                </p>
              </div>

              <Separator />

              <div className='space-y-2'>
                <h4 className='font-medium text-destructive'>
                  {t('Danger Zone')}
                </h4>
                <p className='text-sm text-muted-foreground'>
                  {t('Danger Zone Description')}
                </p>
                <Button
                  variant='destructive'
                  className='flex items-center gap-2'
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className='h-4 w-4' />
                  {t('Delete my account')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  )
}
