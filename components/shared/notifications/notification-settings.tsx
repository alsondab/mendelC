'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Bell, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  getNotificationSettings,
  saveNotificationSettings,
} from '@/lib/actions/notification-settings.actions'
import { getGlobalStockThresholds } from '@/lib/actions/setting.actions'
import Link from 'next/link'

interface NotificationSettings {
  emailNotifications: boolean
  adminEmail: string
  globalLowStockThreshold: number
  globalCriticalStockThreshold: number
  lowStockThreshold: number
  criticalStockThreshold: number
  notificationFrequency: 'realtime' | 'hourly' | 'daily'
  uiNotificationLevel: 'minimal' | 'standard' | 'full'
}

export function NotificationSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    adminEmail: 'admin@example.com',
    globalLowStockThreshold: 5,
    globalCriticalStockThreshold: 2,
    lowStockThreshold: 5,
    criticalStockThreshold: 2,
    notificationFrequency: 'hourly',
    uiNotificationLevel: 'standard',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [globalThresholds, setGlobalThresholds] = useState<{
    globalLowStockThreshold: number
    globalCriticalStockThreshold: number
  } | null>(null)

  // Charger les paramètres au montage du composant
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [settingsResult, thresholdsResult] = await Promise.all([
          getNotificationSettings(),
          getGlobalStockThresholds(),
        ])

        if (settingsResult.success && settingsResult.settings) {
          setSettings(settingsResult.settings)
        }

        if (thresholdsResult.success && thresholdsResult.thresholds) {
          setGlobalThresholds(thresholdsResult.thresholds)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error)
      } finally {
        setIsLoadingSettings(false)
      }
    }

    loadSettings()
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const result = await saveNotificationSettings(settings)

      if (result.success) {
        toast({
          title: 'Paramètres sauvegardés',
          description:
            result.message ||
            'Vos préférences de notification ont été mises à jour.',
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Impossible de sauvegarder les paramètres.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingSettings) {
    return (
      <div className='space-y-4 sm:space-y-6'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-center py-8'>
              <div className='text-sm text-muted-foreground'>
                Chargement des paramètres...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      <Card>
        <CardHeader className='pb-3 sm:pb-6'>
          <CardTitle className='flex items-center gap-2 text-xl sm:text-2xl'>
            <Bell className='h-4 w-4 sm:h-5 sm:w-5' />
            Configuration des Notifications
          </CardTitle>
          <CardDescription className='text-xs sm:text-sm'>
            Configurez comment et quand vous souhaitez recevoir des alertes de
            stock
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
          {/* Notifications par email */}
          <div className='space-y-3 sm:space-y-4'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
              <div className='space-y-0.5 flex-1'>
                <Label className='text-sm sm:text-base'>
                  Notifications par email
                </Label>
                <p className='text-xs sm:text-sm text-muted-foreground'>
                  Recevez des alertes par email quand le stock est faible
                </p>
              </div>
              <div className='flex-shrink-0'>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      emailNotifications: checked,
                    }))
                  }
                />
              </div>
            </div>

            {settings.emailNotifications && (
              <div className='space-y-2 pt-2'>
                <Label htmlFor='adminEmail' className='text-sm sm:text-base'>
                  Email d&apos;administration
                </Label>
                <Input
                  id='adminEmail'
                  type='email'
                  value={settings.adminEmail}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      adminEmail: e.target.value,
                    }))
                  }
                  placeholder='admin@example.com'
                  className='w-full text-sm sm:text-base'
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Seuils de notification - Afficher les seuils globaux (lecture seule) */}
          <div className='space-y-3 sm:space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base sm:text-lg font-medium'>
                Seuils de Notification
              </h3>
              <Button variant='outline' size='sm' asChild>
                <Link href='/admin/stock'>Modifier les seuils globaux</Link>
              </Button>
            </div>
            <p className='text-xs sm:text-sm text-muted-foreground'>
              Les seuils globaux définis dans la page Gestion des Stocks sont
              utilisés pour toutes les notifications. Vous pouvez les modifier
              depuis la page de gestion des stocks.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              <div className='space-y-2'>
                <Label className='text-sm sm:text-base'>
                  Stock faible (avertissement)
                </Label>
                <Input
                  type='number'
                  value={
                    globalThresholds?.globalLowStockThreshold ??
                    settings.lowStockThreshold
                  }
                  readOnly
                  className='text-sm sm:text-base bg-muted/50 cursor-not-allowed'
                />
                <p className='text-xs text-muted-foreground'>
                  Avertir quand le stock ≤ cette valeur (seuil global)
                </p>
              </div>

              <div className='space-y-2'>
                <Label className='text-sm sm:text-base'>Stock critique</Label>
                <Input
                  type='number'
                  value={
                    globalThresholds?.globalCriticalStockThreshold ??
                    settings.criticalStockThreshold
                  }
                  readOnly
                  className='text-sm sm:text-base bg-muted/50 cursor-not-allowed'
                />
                <p className='text-xs text-muted-foreground'>
                  Alerte critique quand le stock ≤ cette valeur (seuil global)
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notifications dans l'interface */}
          <div className='space-y-3 sm:space-y-4'>
            <div>
              <h3 className='text-base sm:text-lg font-medium mb-2'>
                Notifications dans l&apos;Interface
              </h3>
              <p className='text-xs sm:text-sm text-muted-foreground mb-4'>
                Choisissez le niveau de notification dans l&apos;interface admin
              </p>
            </div>

            <RadioGroup
              value={settings.uiNotificationLevel}
              onValueChange={(value) =>
                setSettings((prev) => ({
                  ...prev,
                  uiNotificationLevel: value as 'minimal' | 'standard' | 'full',
                }))
              }
              className='space-y-3 sm:space-y-4'
            >
              <div className='flex items-start space-x-3 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors'>
                <RadioGroupItem value='minimal' id='minimal' className='mt-1' />
                <div className='flex-1 space-y-1'>
                  <Label
                    htmlFor='minimal'
                    className='text-sm sm:text-base font-medium cursor-pointer'
                  >
                    Minimal
                  </Label>
                  <p className='text-xs sm:text-sm text-muted-foreground'>
                    Badge dans la navbar uniquement. Discret, ne perturbe pas le
                    travail.
                  </p>
                </div>
              </div>

              <div className='flex items-start space-x-3 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors bg-accent/30'>
                <RadioGroupItem
                  value='standard'
                  id='standard'
                  className='mt-1'
                />
                <div className='flex-1 space-y-1'>
                  <div className='flex items-center gap-2'>
                    <Label
                      htmlFor='standard'
                      className='text-sm sm:text-base font-medium cursor-pointer'
                    >
                      Standard
                    </Label>
                    <span className='text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium border border-blue-200 dark:border-blue-800'>
                      Recommandé
                    </span>
                  </div>
                  <p className='text-xs sm:text-sm text-muted-foreground'>
                    Badge navbar + notification persistante (bottom-right).
                    Équilibre entre information et discrétion.
                  </p>
                </div>
              </div>

              <div className='flex items-start space-x-3 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors'>
                <RadioGroupItem value='full' id='full' className='mt-1' />
                <div className='flex-1 space-y-1'>
                  <Label
                    htmlFor='full'
                    className='text-sm sm:text-base font-medium cursor-pointer'
                  >
                    Complet
                  </Label>
                  <p className='text-xs sm:text-sm text-muted-foreground'>
                    Badge navbar + notification persistante + toasts popup.
                    Maximum de visibilité pour réagir rapidement.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Actions */}
          <div className='flex flex-col sm:flex-row gap-4 pt-6 border-t border-border'>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              size='lg'
              className='flex-1 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200'
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  <span>Sauvegarde en cours...</span>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <Save className='h-5 w-5' />
                  <span>Sauvegarder</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
