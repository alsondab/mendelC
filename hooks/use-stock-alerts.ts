'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getLowStockProducts,
  getOutOfStockProducts,
} from '@/lib/actions/stock.actions'

export interface StockAlert {
  id: string
  name: string
  countInStock: number
  minStockLevel: number
  stockStatus: 'low_stock' | 'out_of_stock'
  lastStockUpdate: string
}

export interface StockAlertsState {
  alerts: StockAlert[]
  isLoading: boolean
  error: string | null
  criticalCount: number
  warningCount: number
  totalCount: number
}

export function useStockAlerts(refreshInterval: number = 30000) {
  const [state, setState] = useState<StockAlertsState>({
    alerts: [],
    isLoading: true,
    error: null,
    criticalCount: 0,
    warningCount: 0,
    totalCount: 0,
  })

  const fetchAlerts = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const [lowStockResult, outOfStockResult] = await Promise.all([
        getLowStockProducts(),
        getOutOfStockProducts(),
      ])

      const lowStockAlerts = lowStockResult.success
        ? (lowStockResult.products || []).map((p) => ({
            ...p,
            stockStatus: 'low_stock' as const,
          }))
        : []

      const outOfStockAlerts = outOfStockResult.success
        ? (outOfStockResult.products || []).map((p) => ({
            ...p,
            stockStatus: 'out_of_stock' as const,
          }))
        : []

      const allAlerts = [...outOfStockAlerts, ...lowStockAlerts]
      const criticalCount = outOfStockAlerts.length
      const warningCount = lowStockAlerts.length

      setState({
        alerts: allAlerts,
        isLoading: false,
        error: null,
        criticalCount,
        warningCount,
        totalCount: allAlerts.length,
      })
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      }))
    }
  }, [])

  useEffect(() => {
    fetchAlerts()

    if (refreshInterval > 0) {
      const interval = setInterval(fetchAlerts, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchAlerts, refreshInterval])

  const refresh = useCallback(() => {
    fetchAlerts()
  }, [fetchAlerts])

  return {
    ...state,
    refresh,
  }
}

// Hook pour les notifications en temps réel (WebSocket ou Server-Sent Events)
export function useRealtimeStockAlerts() {
  const [hasNewAlerts, setHasNewAlerts] = useState(false)
  const [lastAlertCount, setLastAlertCount] = useState(0)

  const { alerts, totalCount, ...rest } = useStockAlerts(10000) // Refresh plus fréquent

  useEffect(() => {
    if (totalCount > lastAlertCount && lastAlertCount > 0) {
      setHasNewAlerts(true)
    }
    setLastAlertCount(totalCount)
  }, [totalCount, lastAlertCount])

  const clearNewAlerts = useCallback(() => {
    setHasNewAlerts(false)
  }, [])

  return {
    ...rest,
    alerts,
    totalCount,
    hasNewAlerts,
    clearNewAlerts,
  }
}
