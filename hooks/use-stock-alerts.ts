'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
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
      // Ne pas mettre isLoading à true si on a déjà des alertes pour éviter les disparitions
      // Garder les alertes précédentes pendant la mise à jour
      setState((prev) => ({
        ...prev,
        isLoading: prev.alerts.length === 0, // Seulement true si pas encore d'alertes
        error: null,
      }))

      // Utiliser Promise.allSettled pour ne pas bloquer si une requête échoue
      const [lowStockSettled, outOfStockSettled] = await Promise.allSettled([
        getLowStockProducts(),
        getOutOfStockProducts(),
      ])

      // Normaliser les résultats pour garantir une structure cohérente
      const lowStockResult =
        lowStockSettled.status === 'fulfilled'
          ? lowStockSettled.value &&
            typeof lowStockSettled.value === 'object' &&
            'success' in lowStockSettled.value
            ? lowStockSettled.value
            : { success: false, products: [], message: 'Résultat invalide' }
          : {
              success: false,
              products: [],
              message: 'Erreur lors du chargement',
            }

      const outOfStockResult =
        outOfStockSettled.status === 'fulfilled'
          ? outOfStockSettled.value &&
            typeof outOfStockSettled.value === 'object' &&
            'success' in outOfStockSettled.value
            ? outOfStockSettled.value
            : { success: false, products: [], message: 'Résultat invalide' }
          : {
              success: false,
              products: [],
              message: 'Erreur lors du chargement',
            }

      // Vérifier que les résultats existent et ont la structure attendue
      const lowStockAlerts =
        lowStockResult.success && 'products' in lowStockResult
          ? (lowStockResult.products || []).map((p) => ({
              ...p,
              stockStatus: 'low_stock' as const,
            }))
          : []

      const outOfStockAlerts =
        outOfStockResult.success && 'products' in outOfStockResult
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
      // En cas d'erreur, garder les alertes précédentes pour éviter les disparitions
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        // Ne pas vider les alertes en cas d'erreur pour maintenir l'affichage
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

  // Mémoriser les valeurs pour éviter les re-renders inutiles
  const memoizedState = useMemo(
    () => ({
      ...state,
      refresh,
    }),
    [
      state.alerts,
      state.isLoading,
      state.error,
      state.criticalCount,
      state.warningCount,
      state.totalCount,
      refresh,
    ]
  )

  return memoizedState
}

// Hook pour les notifications en temps réel (WebSocket ou Server-Sent Events)
export function useRealtimeStockAlerts() {
  const [hasNewAlerts, setHasNewAlerts] = useState(false)
  const [lastAlertCount, setLastAlertCount] = useState(0)
  const lastUpdateTimeRef = useRef<number>(0)
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { alerts, totalCount, ...rest } = useStockAlerts(10000) // Refresh plus fréquent

  // Throttle les mises à jour de hasNewAlerts (max 1 par seconde)
  useEffect(() => {
    const now = Date.now()
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current

    // Si une mise à jour est en attente, l'annuler
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current)
    }

    if (totalCount > lastAlertCount && lastAlertCount > 0) {
      // Throttle: attendre au moins 1 seconde depuis la dernière mise à jour
      const delay = Math.max(0, 1000 - timeSinceLastUpdate)

      throttleTimeoutRef.current = setTimeout(() => {
        setHasNewAlerts(true)
        lastUpdateTimeRef.current = Date.now()
      }, delay)
    } else if (totalCount === 0) {
      // Réinitialiser immédiatement si plus d'alertes
      setHasNewAlerts(false)
      lastUpdateTimeRef.current = Date.now()
    }

    setLastAlertCount(totalCount)

    return () => {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
      }
    }
  }, [totalCount, lastAlertCount])

  const clearNewAlerts = useCallback(() => {
    setHasNewAlerts(false)
    lastUpdateTimeRef.current = Date.now()
  }, [])

  // Mémoriser le résultat pour éviter les re-renders inutiles
  const memoizedResult = useMemo(
    () => ({
      ...rest,
      alerts,
      totalCount,
      hasNewAlerts,
      clearNewAlerts,
    }),
    [rest, alerts, totalCount, hasNewAlerts, clearNewAlerts]
  )

  return memoizedResult
}
