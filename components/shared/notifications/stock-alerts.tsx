'use client'

import { useState } from 'react'
import { AlertTriangle, XCircle, CheckCircle, Bell } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface StockAlert {
  id: string
  name: string
  countInStock: number
  minStockLevel: number
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
  lastStockUpdate: string
}

interface StockAlertsProps {
  lowStockProducts: StockAlert[]
  outOfStockProducts: StockAlert[]
}

export function StockAlerts({
  lowStockProducts,
  outOfStockProducts,
}: StockAlertsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Créer les alertes à partir des props
  const alerts: StockAlert[] = [
    ...outOfStockProducts.map((p) => ({
      ...p,
      stockStatus: 'out_of_stock' as const,
    })),
    ...lowStockProducts.map((p) => ({
      ...p,
      stockStatus: 'low_stock' as const,
    })),
  ]

  if (alerts.length === 0) {
    return (
      <Card className='border-green-200 bg-green-50'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-2'>
            <CheckCircle className='h-4 w-4 text-green-600' />
            <span className='text-sm text-green-800'>
              Aucune alerte de stock
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const criticalAlerts = alerts.filter(
    (alert) => alert.stockStatus === 'out_of_stock'
  )
  const warningAlerts = alerts.filter(
    (alert) => alert.stockStatus === 'low_stock'
  )

  return (
    <Card
      className={`border-2 ${criticalAlerts.length > 0 ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}`}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Bell
              className={`h-5 w-5 ${criticalAlerts.length > 0 ? 'text-red-600' : 'text-orange-600'}`}
            />
            <CardTitle className='text-lg'>Alertes de Stock</CardTitle>
            <Badge
              variant={criticalAlerts.length > 0 ? 'destructive' : 'secondary'}
            >
              {alerts.length}
            </Badge>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Masquer' : 'Voir tout'}
          </Button>
        </div>
        <CardDescription>
          {criticalAlerts.length > 0
            ? `${criticalAlerts.length} rupture(s) de stock, ${warningAlerts.length} stock(s) faible(s)`
            : `${warningAlerts.length} produit(s) en stock faible`}
        </CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent className='pt-0'>
          <div className='space-y-3'>
            {/* Alertes critiques (rupture de stock) */}
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className='flex items-center justify-between p-3 bg-red-100 border border-red-200 rounded-lg'
              >
                <div className='flex items-center gap-3'>
                  <XCircle className='h-5 w-5 text-red-600' />
                  <div>
                    <h4 className='font-medium text-red-900'>{alert.name}</h4>
                    <p className='text-sm text-red-700'>
                      Rupture de stock - {alert.countInStock} unité(s)
                    </p>
                  </div>
                </div>
                <Button asChild size='sm' variant='destructive'>
                  <Link href={`/admin/products/${alert.id}`}>
                    Réapprovisionner
                  </Link>
                </Button>
              </div>
            ))}

            {/* Alertes d'avertissement (stock faible) */}
            {warningAlerts.map((alert) => (
              <div
                key={alert.id}
                className='flex items-center justify-between p-3 bg-orange-100 border border-orange-200 rounded-lg'
              >
                <div className='flex items-center gap-3'>
                  <AlertTriangle className='h-5 w-5 text-orange-600' />
                  <div>
                    <h4 className='font-medium text-orange-900'>
                      {alert.name}
                    </h4>
                    <p className='text-sm text-orange-700'>
                      Stock faible: {alert.countInStock} / {alert.minStockLevel}{' '}
                      (seuil)
                    </p>
                  </div>
                </div>
                <Button asChild size='sm' variant='outline'>
                  <Link href={`/admin/products/${alert.id}`}>Modifier</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Composant pour afficher les alertes dans la barre latérale
export function StockAlertsSidebar({
  lowStockProducts,
  outOfStockProducts,
}: StockAlertsProps) {
  const alerts: StockAlert[] = [
    ...outOfStockProducts.map((p) => ({
      ...p,
      stockStatus: 'out_of_stock' as const,
    })),
    ...lowStockProducts.map((p) => ({
      ...p,
      stockStatus: 'low_stock' as const,
    })),
  ]

  if (alerts.length === 0) return null

  const criticalCount = alerts.filter(
    (a) => a.stockStatus === 'out_of_stock'
  ).length
  const warningCount = alerts.filter(
    (a) => a.stockStatus === 'low_stock'
  ).length

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2 text-sm font-medium'>
        <Bell className='h-4 w-4' />
        Alertes de Stock
      </div>

      {criticalCount > 0 && (
        <div className='flex items-center gap-2 text-sm text-red-600'>
          <XCircle className='h-4 w-4' />
          <span>{criticalCount} rupture(s)</span>
        </div>
      )}

      {warningCount > 0 && (
        <div className='flex items-center gap-2 text-sm text-orange-600'>
          <AlertTriangle className='h-4 w-4' />
          <span>{warningCount} stock(s) faible(s)</span>
        </div>
      )}
    </div>
  )
}
