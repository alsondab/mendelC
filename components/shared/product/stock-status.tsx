'use client'

import { AlertTriangle, CheckCircle, XCircle, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StockStatusProps {
  countInStock: number
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StockStatus({
  countInStock,
  stockStatus,
  showIcon = true,
  size = 'md',
  className,
}: StockStatusProps) {
  const getStatusConfig = () => {
    switch (stockStatus) {
      case 'out_of_stock':
        return {
          text: 'Rupture de stock',
          variant: 'destructive' as const,
          icon: XCircle,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
        }
      case 'low_stock':
        return {
          text: `Stock faible (${countInStock} restants)`,
          variant: 'secondary' as const,
          icon: AlertTriangle,
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          borderColor: 'border-orange-200',
        }
      case 'in_stock':
        return {
          text: 'En stock',
          variant: 'default' as const,
          icon: CheckCircle,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
        }
      case 'discontinued':
        return {
          text: 'Produit discontinué',
          variant: 'outline' as const,
          icon: Package,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
        }
      default:
        return {
          text: 'Statut inconnu',
          variant: 'outline' as const,
          icon: Package,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={cn(iconSizes[size], 'shrink-0')} />}
      <span className='truncate'>{config.text}</span>
    </div>
  )
}

// Composant pour afficher le statut de stock dans une carte produit
export function ProductStockStatus({
  countInStock,
  stockStatus,
  className,
}: Omit<StockStatusProps, 'showIcon' | 'size'>) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <span className='text-sm text-muted-foreground'>
        Stock: {countInStock}
      </span>
      <StockStatus
        countInStock={countInStock}
        stockStatus={stockStatus}
        size='sm'
      />
    </div>
  )
}

// Composant pour afficher le statut de stock dans une liste admin
export function AdminStockStatus({
  countInStock,
  stockStatus,
  className,
}: Omit<StockStatusProps, 'showIcon' | 'size'>) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className='text-sm font-medium'>{countInStock}</span>
      <StockStatus
        countInStock={countInStock}
        stockStatus={stockStatus}
        size='sm'
        showIcon={false}
      />
    </div>
  )
}
