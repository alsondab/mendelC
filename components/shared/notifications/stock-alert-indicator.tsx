'use client'

import { useRealtimeStockAlerts } from '@/hooks/use-stock-alerts'
import { AlertTriangle, XCircle, Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function StockAlertIndicator() {
  const { alerts, isLoading, criticalCount, warningCount } =
    useRealtimeStockAlerts()

  if (isLoading || alerts.length === 0) return null

  return (
    <div className='flex items-center gap-2'>
      {criticalCount > 0 ? (
        <div className='flex items-center gap-1'>
          <XCircle className='h-4 w-4 text-red-600' />
          <Badge variant='destructive' className='text-xs'>
            {criticalCount}
          </Badge>
        </div>
      ) : warningCount > 0 ? (
        <div className='flex items-center gap-1'>
          <AlertTriangle className='h-4 w-4 text-orange-600' />
          <Badge
            variant='secondary'
            className='text-xs bg-orange-100 text-orange-800'
          >
            {warningCount}
          </Badge>
        </div>
      ) : null}

      <div className='flex items-center gap-1 text-sm text-muted-foreground'>
        <Bell className='h-4 w-4' />
        <span>{alerts.length}</span>
      </div>
    </div>
  )
}
