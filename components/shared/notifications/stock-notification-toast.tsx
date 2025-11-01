'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import { useRealtimeStockAlerts } from '@/hooks/use-stock-alerts'
import { useNotificationLevel } from '@/hooks/use-notification-level'
import { AlertTriangle, XCircle, Bell } from 'lucide-react'

// Queue pour différer les notifications
interface QueuedNotification {
  type: 'critical' | 'warning'
  count: number
  timestamp: number
}

export function StockNotificationToast() {
  const { toast } = useToast()
  const t = useTranslations()
  const { hasNewAlerts, criticalCount, warningCount, clearNewAlerts } =
    useRealtimeStockAlerts()
  const notificationLevel = useNotificationLevel()

  const lastToastTimeRef = useRef<number>(0)
  const notificationQueueRef = useRef<QueuedNotification[]>([])
  const processingRef = useRef<boolean>(false)
  const minDelayBetweenToasts = 5000 // 5 secondes minimum entre toasts

  const processQueue = useCallback(() => {
    if (processingRef.current || notificationQueueRef.current.length === 0) {
      return
    }

    const now = Date.now()
    const timeSinceLastToast = now - lastToastTimeRef.current

    if (timeSinceLastToast < minDelayBetweenToasts) {
      // Attendre avant de traiter la prochaine notification
      const remainingDelay = minDelayBetweenToasts - timeSinceLastToast
      setTimeout(() => {
        processQueue()
      }, remainingDelay)
      return
    }

    processingRef.current = true
    const notification = notificationQueueRef.current.shift()

    if (notification) {
      if (notification.type === 'critical') {
        toast({
          title: t('StockNotifications.CriticalAlertTitle'),
          description: t('StockNotifications.CriticalAlertDescription', {
            count: notification.count,
          }),
          variant: 'destructive',
          duration: 10000, // 10 secondes
        })
      } else if (notification.type === 'warning') {
        toast({
          title: t('StockNotifications.WarningAlertTitle'),
          description: t('StockNotifications.WarningAlertDescription', {
            count: notification.count,
          }),
          variant: 'default',
          duration: 8000, // 8 secondes
        })
      }

      lastToastTimeRef.current = Date.now()
    }

    processingRef.current = false

    // Traiter la prochaine notification dans la queue si disponible
    if (notificationQueueRef.current.length > 0) {
      setTimeout(() => {
        processQueue()
      }, minDelayBetweenToasts)
    }
  }, [toast, t])

  useEffect(() => {
    // Ne traiter les toasts que si le niveau est "full"
    if (hasNewAlerts && notificationLevel === 'full') {
      const now = Date.now()
      const notification: QueuedNotification = {
        type: criticalCount > 0 ? 'critical' : 'warning',
        count: criticalCount > 0 ? criticalCount : warningCount,
        timestamp: now,
      }

      // Ajouter à la queue
      notificationQueueRef.current.push(notification)

      // Déclencher le traitement de la queue
      processQueue()

      clearNewAlerts()
    } else if (hasNewAlerts) {
      // Si niveau != 'full', on clear juste les alertes sans afficher de toast
      clearNewAlerts()
    }
  }, [
    hasNewAlerts,
    criticalCount,
    warningCount,
    clearNewAlerts,
    processQueue,
    notificationLevel,
  ])

  return null // Ce composant n'affiche rien, il gère juste les toasts
}

// Composant pour afficher une notification persistante dans l'interface
export function StockNotificationBanner() {
  const { alerts, isLoading, criticalCount, warningCount } =
    useRealtimeStockAlerts()
  const t = useTranslations()

  if (isLoading || alerts.length === 0) return null

  return (
    <div className='fixed top-4 right-4 z-50 max-w-sm'>
      <div
        className={`rounded-lg shadow-lg border-2 p-4 ${
          criticalCount > 0
            ? 'bg-red-50 border-red-200 text-red-900'
            : 'bg-orange-50 border-orange-200 text-orange-900'
        }`}
      >
        <div className='flex items-start gap-3'>
          <div
            className={`p-2 rounded-full ${
              criticalCount > 0 ? 'bg-red-100' : 'bg-orange-100'
            }`}
          >
            {criticalCount > 0 ? (
              <XCircle className='h-5 w-5 text-red-600' />
            ) : (
              <AlertTriangle className='h-5 w-5 text-orange-600' />
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1'>
              <Bell className='h-4 w-4 animate-pulse' />
              <span className='text-sm font-semibold'>
                {criticalCount > 0
                  ? `${criticalCount} rupture(s) de stock`
                  : `${warningCount} stock(s) faible(s)`}
              </span>
            </div>
            <p className='text-xs opacity-80 mb-2'>
              {criticalCount > 0
                ? 'Réapprovisionnement urgent requis'
                : 'Vérifiez les niveaux de stock'}
            </p>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-medium'>
                {alerts.length} alerte(s) au total
              </span>
              <button
                onClick={() => (window.location.href = '/admin/stock')}
                className={`text-xs px-2 py-1 rounded ${
                  criticalCount > 0
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                } transition-colors`}
                aria-label={t('StockNotifications.View Stock Management')}
              >
                Voir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
