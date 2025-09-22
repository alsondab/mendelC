'use client'

import { useState } from 'react'
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
import { Bell, Mail, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface NotificationSettings {
  emailNotifications: boolean
  adminEmail: string
  lowStockThreshold: number
  criticalStockThreshold: number
  notificationFrequency: 'realtime' | 'hourly' | 'daily'
  enableBanner: boolean
  enableToast: boolean
}

export function NotificationSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    adminEmail: 'admin@votre-site.com',
    lowStockThreshold: 5,
    criticalStockThreshold: 2,
    notificationFrequency: 'hourly',
    enableBanner: true,
    enableToast: true,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Ici vous sauvegarderiez les paramètres en base de données
      // await saveNotificationSettings(settings)

      toast({
        title: 'Paramètres sauvegardés',
        description: 'Vos préférences de notification ont été mises à jour.',
      })
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les paramètres.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testNotification = async () => {
    try {
      const response = await fetch('/api/stock/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: settings.adminEmail }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Test envoyé',
          description: `Notification de test envoyée à ${settings.adminEmail}`,
        })
      } else {
        throw new Error(result.message)
      }
    } catch {
      toast({
        title: 'Erreur',
        description: "Impossible d'envoyer la notification de test.",
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Bell className='h-5 w-5' />
            Configuration des Notifications
          </CardTitle>
          <CardDescription>
            Configurez comment et quand vous souhaitez recevoir des alertes de
            stock
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Notifications par email */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label className='text-base'>Notifications par email</Label>
                <p className='text-sm text-muted-foreground'>
                  Recevez des alertes par email quand le stock est faible
                </p>
              </div>
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

            {settings.emailNotifications && (
              <div className='space-y-2'>
                <Label htmlFor='adminEmail'>Email d&apos;administration</Label>
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
                  placeholder='admin@votre-site.com'
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Seuils de notification */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Seuils de Notification</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='lowStockThreshold'>
                  Stock faible (avertissement)
                </Label>
                <Input
                  id='lowStockThreshold'
                  type='number'
                  min='1'
                  value={settings.lowStockThreshold}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      lowStockThreshold: parseInt(e.target.value) || 5,
                    }))
                  }
                />
                <p className='text-xs text-muted-foreground'>
                  Avertir quand le stock ≤ cette valeur
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='criticalStockThreshold'>Stock critique</Label>
                <Input
                  id='criticalStockThreshold'
                  type='number'
                  min='0'
                  value={settings.criticalStockThreshold}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      criticalStockThreshold: parseInt(e.target.value) || 2,
                    }))
                  }
                />
                <p className='text-xs text-muted-foreground'>
                  Alerte critique quand le stock ≤ cette valeur
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Fréquence des notifications */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Fréquence des Notifications</h3>

            <div className='space-y-2'>
              <Label>Vérification automatique</Label>
              <div className='grid grid-cols-3 gap-2'>
                {[
                  { value: 'realtime', label: 'Temps réel', icon: Clock },
                  { value: 'hourly', label: 'Toutes les heures', icon: Clock },
                  { value: 'daily', label: 'Quotidien', icon: Clock },
                ].map((option) => {
                  const Icon = option.icon
                  return (
                    <Button
                      key={option.value}
                      variant={
                        settings.notificationFrequency === option.value
                          ? 'default'
                          : 'outline'
                      }
                      className='flex items-center gap-2'
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          notificationFrequency: option.value as
                            | 'realtime'
                            | 'hourly'
                            | 'daily',
                        }))
                      }
                    >
                      <Icon className='h-4 w-4' />
                      {option.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>

          <Separator />

          {/* Notifications dans l'interface */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>
              Notifications dans l&apos;Interface
            </h3>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Bannière de notification</Label>
                  <p className='text-sm text-muted-foreground'>
                    Afficher une bannière en haut de l&apos;interface admin
                  </p>
                </div>
                <Switch
                  checked={settings.enableBanner}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, enableBanner: checked }))
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Notifications toast</Label>
                  <p className='text-sm text-muted-foreground'>
                    Afficher des notifications popup temporaires
                  </p>
                </div>
                <Switch
                  checked={settings.enableToast}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, enableToast: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className='flex gap-4'>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>

            <Button
              variant='outline'
              onClick={testNotification}
              disabled={!settings.emailNotifications}
            >
              <Mail className='h-4 w-4 mr-2' />
              Tester la notification
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
