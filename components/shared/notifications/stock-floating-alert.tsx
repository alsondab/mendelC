'use client'

import { useState, useEffect } from 'react'
import { useRealtimeStockAlerts } from '@/hooks/use-stock-alerts'
import { AlertTriangle, XCircle, Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function StockFloatingAlert() {
  const { alerts, isLoading, criticalCount, warningCount } =
    useRealtimeStockAlerts()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (alerts.length > 0 && !isDismissed) {
      setIsVisible(true)
    } else if (alerts.length === 0) {
      setIsVisible(false)
    }
  }, [alerts.length, isDismissed])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    // Réinitialiser après 5 minutes
    setTimeout(() => setIsDismissed(false), 5 * 60 * 1000)
  }

  if (isLoading || alerts.length === 0 || !isVisible) return null

  return (
    <div className='fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-2 duration-300'>
      <Card
        className={`border-2 shadow-lg ${
          criticalCount > 0
            ? 'border-red-200 bg-red-50'
            : 'border-orange-200 bg-orange-50'
        }`}
      >
        <CardContent className='p-4'>
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
                <span
                  className={`text-sm font-semibold ${
                    criticalCount > 0 ? 'text-red-900' : 'text-orange-900'
                  }`}
                >
                  {criticalCount > 0
                    ? `${criticalCount} rupture(s) de stock`
                    : `${warningCount} stock(s) faible(s)`}
                </span>
              </div>

              <p
                className={`text-xs mb-3 ${
                  criticalCount > 0 ? 'text-red-700' : 'text-orange-700'
                }`}
              >
                {criticalCount > 0
                  ? 'Réapprovisionnement urgent requis'
                  : 'Vérifiez les niveaux de stock'}
              </p>

              <div className='flex items-center justify-between gap-2'>
                <Button
                  size='sm'
                  variant={criticalCount > 0 ? 'destructive' : 'default'}
                  className='text-xs h-7'
                  onClick={() => (window.location.href = '/admin/stock')}
                >
                  Voir les détails
                </Button>

                <Button
                  size='sm'
                  variant='ghost'
                  className='text-xs h-7 p-1'
                  onClick={handleDismiss}
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
