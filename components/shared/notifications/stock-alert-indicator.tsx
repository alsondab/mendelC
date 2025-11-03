'use client'

import React, { useState, useEffect } from 'react'
import { useRealtimeStockAlerts } from '@/hooks/use-stock-alerts'
import { AlertTriangle, XCircle, Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// ⚡ Optimization: Lazy load framer-motion pour réduire le bundle initial
type MotionComponent = React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & {
    initial?: Record<string, unknown>
    animate?: Record<string, unknown>
    exit?: Record<string, unknown>
    transition?: Record<string, unknown>
    key?: string
  }
>
type AnimatePresenceComponent = React.ComponentType<{
  mode?: 'wait' | 'sync'
  children?: React.ReactNode
}>

let MotionDiv: MotionComponent | null = null
let AnimatePresence: AnimatePresenceComponent | null = null
let motionReady = false

const loadFramerMotion = async () => {
  if (!motionReady) {
    const framerMotion = await import('framer-motion')
    MotionDiv = framerMotion.motion.div as MotionComponent
    AnimatePresence = framerMotion.AnimatePresence as AnimatePresenceComponent
    motionReady = true
  }
  return { MotionDiv, AnimatePresence }
}

export function StockAlertIndicator() {
  const { alerts, isLoading, criticalCount, warningCount } =
    useRealtimeStockAlerts()
  const [motionComponents, setMotionComponents] = useState<{
    MotionDiv: MotionComponent | null
    AnimatePresence: AnimatePresenceComponent | null
  } | null>(null)

  // ⚡ Optimization: Charger framer-motion de manière asynchrone
  useEffect(() => {
    loadFramerMotion().then((components) => {
      setMotionComponents(components)
    })
  }, [])

  // IMPORTANT: L'indicateur doit toujours être visible s'il y a des alertes
  // Indépendamment de l'état de la notification persistante (fermée ou non)
  // Afficher les alertes même pendant le chargement si elles existent déjà
  // Toujours réserver un espace fixe pour éviter les déplacements

  // Afficher le skeleton uniquement si on charge ET qu'on n'a pas encore d'alertes
  if (isLoading && alerts.length === 0) {
    return (
      <div className='w-8 sm:w-10 flex items-center justify-center flex-shrink-0'>
        <div className='h-4 w-4 sm:h-5 sm:w-5 animate-pulse rounded bg-muted' />
      </div>
    )
  }

  // Fallback sans animation si framer-motion n'est pas encore chargé
  const MotionDivComponent = motionComponents?.MotionDiv || 'div'
  const AnimatePresenceComponent =
    motionComponents?.AnimatePresence || React.Fragment

  const getAlertContent = () => {
    if (alerts.length > 0) {
      if (criticalCount > 0) {
        return (
          <MotionDivComponent
            key='critical'
            {...(motionComponents
              ? {
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.8 },
                  transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    duration: 0.2,
                  },
                }
              : {})}
            className='flex items-center gap-1'
            title={`${criticalCount} produit(s) en rupture de stock`}
          >
            <XCircle className='h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0' />
            <Badge
              variant='destructive'
              className='text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5'
            >
              {criticalCount}
            </Badge>
          </MotionDivComponent>
        )
      } else if (warningCount > 0) {
        return (
          <MotionDivComponent
            key='warning'
            {...(motionComponents
              ? {
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.8 },
                  transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    duration: 0.2,
                  },
                }
              : {})}
            className='flex items-center gap-1'
            title={`${warningCount} produit(s) avec stock faible`}
          >
            <AlertTriangle className='h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0' />
            <Badge
              variant='secondary'
              className='text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
            >
              {warningCount}
            </Badge>
          </MotionDivComponent>
        )
      } else {
        return (
          <MotionDivComponent
            key='bell'
            {...(motionComponents
              ? {
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.8 },
                  transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    duration: 0.2,
                  },
                }
              : {})}
            className='flex items-center gap-1 text-muted-foreground'
            title={`${alerts.length} alerte(s) au total`}
          >
            <Bell className='h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0' />
            <span className='text-[10px] sm:text-xs font-medium'>
              {alerts.length}
            </span>
          </MotionDivComponent>
        )
      }
    } else {
      return (
        <MotionDivComponent
          key='empty'
          {...(motionComponents
            ? {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
              }
            : {})}
          className='w-full'
        />
      )
    }
  }

  // Afficher uniquement le badge d'alerte OU le compteur de cloche (pas les deux)
  return (
    <div className='w-8 sm:w-10 flex items-center justify-center flex-shrink-0'>
      {motionComponents ? (
        <AnimatePresenceComponent mode='wait'>
          {getAlertContent()}
        </AnimatePresenceComponent>
      ) : (
        getAlertContent()
      )}
    </div>
  )
}
