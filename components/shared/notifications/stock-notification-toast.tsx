'use client'

import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useRealtimeStockAlerts } from '@/hooks/use-stock-alerts'
import { AlertTriangle, XCircle, Bell } from 'lucide-react'

export function StockNotificationToast() {
  const { toast } = useToast()
  const { hasNewAlerts, criticalCount, warningCount, clearNewAlerts } =
    useRealtimeStockAlerts()

  useEffect(() => {
    if (hasNewAlerts) {
      if (criticalCount > 0) {
        toast({
          title: '🚨 Alerte Critique - Rupture de Stock',
          description: `${criticalCount} produit(s) en rupture de stock nécessitent un réapprovisionnement urgent !`,
          variant: 'destructive',
          duration: 10000, // 10 secondes
        })
      } else if (warningCount > 0) {
        toast({
          title: '⚠️ Alerte - Stock Faible',
          description: `${warningCount} produit(s) ont un stock faible et nécessitent votre attention.`,
          variant: 'default',
          duration: 8000, // 8 secondes
        })
      }
      clearNewAlerts()
    }
  }, [hasNewAlerts, criticalCount, warningCount, toast, clearNewAlerts])

  return null // Ce composant n'affiche rien, il gère juste les toasts
}

// Composant pour afficher une notification persistante dans l'interface
export function StockNotificationBanner() {
  const { alerts, isLoading, criticalCount, warningCount } =
    useRealtimeStockAlerts()

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
