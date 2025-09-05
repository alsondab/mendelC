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
import useColorStore from '@/hooks/use-color-store'
import { setCurrencyOnServer } from '@/lib/actions/setting.actions'
import { i18n } from '@/i18n-config'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SettingsPage() {
  const locale = useLocale()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const {
    setting: { availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()

  const { availableColors, color, setColor } = useColorStore(theme)

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    orderHistory: false,
    browsingHistory: true,
  })

  const handleCurrencyChange = async (newCurrency: string) => {
    await setCurrencyOnServer(newCurrency)
    setCurrency(newCurrency)
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  return (
    <div className='p-1 xs:p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto'>
      <div className='mb-6 xs:mb-8'>
        <h1 className='text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-2'>
          Réglages
        </h1>
        <p className='text-sm xs:text-base text-muted-foreground'>
          Gérez vos préférences, notifications et paramètres de confidentialité
        </p>
      </div>

      <div className='space-y-6'>
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Bell className='h-5 w-5 text-blue-600' />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <Label htmlFor='email-notifications'>
                  Notifications par email
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Recevez des mises à jour par email
                </p>
              </div>
              <Switch
                id='email-notifications'
                checked={notifications.email}
                onCheckedChange={(checked: boolean) =>
                  setNotifications((prev) => ({ ...prev, email: checked }))
                }
              />
            </div>

            <Separator />

            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <Label htmlFor='push-notifications'>Notifications push</Label>
                <p className='text-sm text-muted-foreground'>
                  Notifications sur votre appareil
                </p>
              </div>
              <Switch
                id='push-notifications'
                checked={notifications.push}
                onCheckedChange={(checked: boolean) =>
                  setNotifications((prev) => ({ ...prev, push: checked }))
                }
              />
            </div>

            <Separator />

            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <Label htmlFor='sms-notifications'>Notifications SMS</Label>
                <p className='text-sm text-muted-foreground'>
                  Recevez des alertes par SMS
                </p>
              </div>
              <Switch
                id='sms-notifications'
                checked={notifications.sms}
                onCheckedChange={(checked: boolean) =>
                  setNotifications((prev) => ({ ...prev, sms: checked }))
                }
              />
            </div>

            <Separator />

            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <Label htmlFor='marketing-notifications'>Marketing</Label>
                <p className='text-sm text-muted-foreground'>
                  Offres spéciales et promotions
                </p>
              </div>
              <Switch
                id='marketing-notifications'
                checked={notifications.marketing}
                onCheckedChange={(checked: boolean) =>
                  setNotifications((prev) => ({ ...prev, marketing: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Confidentialité */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5 text-green-600' />
              Confidentialité
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <Label htmlFor='profile-visible'>Profil visible</Label>
                <p className='text-sm text-muted-foreground'>
                  Rendre votre profil visible aux autres utilisateurs
                </p>
              </div>
              <Switch
                id='profile-visible'
                checked={privacy.profileVisible}
                onCheckedChange={(checked: boolean) =>
                  setPrivacy((prev) => ({ ...prev, profileVisible: checked }))
                }
              />
            </div>

            <Separator />

            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <Label htmlFor='order-history'>Historique des commandes</Label>
                <p className='text-sm text-muted-foreground'>
                  Sauvegarder l&apos;historique de vos commandes
                </p>
              </div>
              <Switch
                id='order-history'
                checked={privacy.orderHistory}
                onCheckedChange={(checked: boolean) =>
                  setPrivacy((prev) => ({ ...prev, orderHistory: checked }))
                }
              />
            </div>

            <Separator />

            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <Label htmlFor='browsing-history'>
                  Historique de navigation
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Enregistrer les pages visitées pour des recommandations
                </p>
              </div>
              <Switch
                id='browsing-history'
                checked={privacy.browsingHistory}
                onCheckedChange={(checked: boolean) =>
                  setPrivacy((prev) => ({ ...prev, browsingHistory: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Préférences */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Palette className='h-5 w-5 text-purple-600' />
              Préférences
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='language'>Langue</Label>
                <div className='space-y-2'>
                  {i18n.locales.map((l) => (
                    <Link
                      key={l.code}
                      href={`/${l.code}${pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '')}`}
                      className={`flex items-center gap-2 p-2 rounded-md border transition-colors ${
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
                    </Link>
                  ))}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='currency'>Devise</Label>
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
                <Label>Thème</Label>
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
                    <span>Clair</span>
                    {theme === 'light' && <span className='text-xs'>✓</span>}
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-md border transition-colors ${
                      theme === 'dark'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    <Moon className='h-4 w-4' />
                    <span>Sombre</span>
                    {theme === 'dark' && <span className='text-xs'>✓</span>}
                  </button>
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Couleur d&apos;accent</Label>
                <div className='grid grid-cols-4 gap-2'>
                  {availableColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name, true)}
                      className={`flex items-center justify-center gap-2 p-2 rounded-md border transition-colors ${
                        color.name === c.name
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted'
                      }`}
                    >
                      <div
                        style={{ backgroundColor: c.name }}
                        className='h-4 w-4 rounded-full'
                      />
                      {color.name === c.name && (
                        <span className='text-xs'>✓</span>
                      )}
                    </button>
                  ))}
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
              Données
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-3'>
              <Button variant='outline' className='flex items-center gap-2'>
                <Download className='h-4 w-4' />
                Télécharger mes données
              </Button>
              <Button variant='outline' className='flex items-center gap-2'>
                <Upload className='h-4 w-4' />
                Importer des données
              </Button>
            </div>

            <Separator />

            <div className='space-y-2'>
              <h4 className='font-medium text-destructive'>Zone de danger</h4>
              <p className='text-sm text-muted-foreground'>
                Ces actions sont irréversibles. Veuillez réfléchir avant de
                continuer.
              </p>
              <Button variant='destructive' className='flex items-center gap-2'>
                <Trash2 className='h-4 w-4' />
                Supprimer mon compte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
