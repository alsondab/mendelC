'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StockGaugeProps {
  currentStock: number
  minStockLevel: number
  maxStockLevel: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function StockGauge({
  currentStock,
  minStockLevel,
  maxStockLevel,
  size = 'md',
  showLabel = true,
  className,
}: StockGaugeProps) {
  // Calculer le pourcentage de stock par rapport au max
  const stockPercentage = Math.min(
    100,
    Math.max(0, (currentStock / maxStockLevel) * 100)
  )

  // Déterminer la couleur selon le statut
  const getColor = () => {
    if (currentStock <= 0) return 'bg-red-500'
    if (currentStock <= minStockLevel) return 'bg-orange-500'
    if (currentStock >= maxStockLevel * 0.8) return 'bg-green-500'
    if (currentStock >= maxStockLevel * 0.5) return 'bg-blue-500'
    return 'bg-yellow-500'
  }

  // Déterminer le statut textuel
  const getStatus = () => {
    if (currentStock <= 0) return 'Rupture'
    if (currentStock <= minStockLevel) return 'Stock faible'
    if (currentStock >= maxStockLevel * 0.8) return 'Stock optimal'
    if (currentStock >= maxStockLevel * 0.5) return 'Stock moyen'
    return 'Stock acceptable'
  }

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs'
      case 'lg':
        return 'text-sm'
      default:
        return 'text-xs'
    }
  }

  const color = getColor()
  const status = getStatus()

  return (
    <div className={cn('space-y-1.5', className)}>
      {showLabel && (
        <div className='flex items-center justify-between'>
          <span className={cn('font-medium', getTextSizeClasses())}>
            {status}
          </span>
          <span className={cn('text-muted-foreground', getTextSizeClasses())}>
            {currentStock} / {maxStockLevel}
          </span>
        </div>
      )}
      <div className='relative w-full overflow-hidden rounded-full bg-muted'>
        {/* Barre de progression animée - Optimisé avec transform pour meilleure performance */}
        <motion.div
          className={cn(
            'h-full rounded-full transition-colors origin-left',
            color
          )}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: stockPercentage / 100 }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
          style={{ width: '100%' }}
        />
        {/* Marqueur de seuil minimum */}
        <div
          className='absolute top-0 h-full w-0.5 bg-orange-300 dark:bg-orange-700'
          style={{
            left: `${(minStockLevel / maxStockLevel) * 100}%`,
          }}
          title={`Seuil minimum: ${minStockLevel}`}
        />
      </div>
      {size !== 'sm' && (
        <div className='flex items-center justify-between text-[10px] text-muted-foreground'>
          <span>Min: {minStockLevel}</span>
          <span>{Math.round(stockPercentage)}%</span>
          <span>Max: {maxStockLevel}</span>
        </div>
      )}
    </div>
  )
}
