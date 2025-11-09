'use client'

import { useState } from 'react'
import { AlertTriangle, XCircle, CheckCircle, Bell } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductEditDialog } from '@/components/shared/product/product-edit-dialog'

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
  const t = useTranslations('Admin.Stock.StockAlerts')
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  )
  const [editDialogOpen, setEditDialogOpen] = useState(false)

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
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-800">{t('NoAlerts')}</span>
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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell
              className={`h-5 w-5 ${criticalAlerts.length > 0 ? 'text-red-600' : 'text-orange-600'}`}
            />
            <CardTitle className="text-lg">{t('Title')}</CardTitle>
            <Badge
              variant={criticalAlerts.length > 0 ? 'destructive' : 'secondary'}
            >
              {alerts.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? t('Hide') : t('ShowAll')}
          </Button>
        </div>
        <CardDescription>
          {criticalAlerts.length > 0
            ? t('CriticalAndWarning', {
                critical: criticalAlerts.length,
                warning: warningAlerts.length,
              })
            : t('WarningOnly', { count: warningAlerts.length })}
        </CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Alertes critiques (rupture de stock) */}
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 bg-red-100 border border-red-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <h4 className="font-medium text-red-900">{alert.name}</h4>
                    <p className="text-sm text-red-700">
                      {t('OutOfStockAlert', { count: alert.countInStock })}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setSelectedProductId(alert.id)
                    setEditDialogOpen(true)
                  }}
                >
                  {t('Restock')}
                </Button>
              </div>
            ))}

            {/* Alertes d'avertissement (stock faible) */}
            {warningAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 bg-orange-100 border border-orange-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <h4 className="font-medium text-orange-900">
                      {alert.name}
                    </h4>
                    <p className="text-sm text-orange-700">
                      {t('LowStockAlert', {
                        current: alert.countInStock,
                        threshold: alert.minStockLevel,
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedProductId(alert.id)
                    setEditDialogOpen(true)
                  }}
                >
                  {t('Edit')}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      )}

      {/* Product Edit Dialog */}
      <ProductEditDialog
        productId={selectedProductId}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) {
            setSelectedProductId(null)
          }
        }}
      />
    </Card>
  )
}

// Composant pour afficher les alertes dans la barre latérale
export function StockAlertsSidebar({
  lowStockProducts,
  outOfStockProducts,
}: StockAlertsProps) {
  const t = useTranslations('Admin.Stock.StockAlerts')
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
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Bell className="h-4 w-4" />
        {t('StockAlertsLabel')}
      </div>

      {criticalCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <XCircle className="h-4 w-4" />
          <span>{t('OutOfStockCount', { count: criticalCount })}</span>
        </div>
      )}

      {warningCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-orange-600">
          <AlertTriangle className="h-4 w-4" />
          <span>{t('LowStockCount', { count: warningCount })}</span>
        </div>
      )}
    </div>
  )
}
