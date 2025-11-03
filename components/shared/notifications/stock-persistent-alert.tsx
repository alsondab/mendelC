'use client'

import { useRealtimeStockAlerts } from '@/hooks/use-stock-alerts'
import { useNotificationLevel } from '@/hooks/use-notification-level'
import { AlertTriangle, XCircle, Bell, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import React, { useState, useEffect, useRef } from 'react'

// ⚡ Optimization: Lazy load framer-motion pour réduire le bundle initial
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MotionComponent = React.ComponentType<any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnimatePresenceComponent = React.ComponentType<any>

let MotionDiv: MotionComponent | null = null
let AnimatePresence: AnimatePresenceComponent | null = null
let motionReady = false

// Charger framer-motion de manière asynchrone
const loadFramerMotion = async () => {
  if (!motionReady) {
    const framerMotion = await import('framer-motion')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MotionDiv = framerMotion.motion.div as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AnimatePresence = framerMotion.AnimatePresence as any
    motionReady = true
  }
  return { MotionDiv, AnimatePresence }
}

export function StockPersistentAlert() {
  const t = useTranslations('Admin.Stock.StockAlerts')
  const { alerts, isLoading, criticalCount, warningCount } =
    useRealtimeStockAlerts()
  const notificationLevel = useNotificationLevel()
  const [isDismissed, setIsDismissed] = useState(false)
  const previousAlertCountRef = useRef<number>(0)
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

  // IMPORTANT: La notification persistante a son propre état de fermeture (isDismissed)
  // qui est INDÉPENDANT de l'indicateur dans la navbar (StockAlertIndicator)
  // L'indicateur dans la navbar reste toujours visible tant qu'il y a des alertes

  // Réinitialiser le statut de masquage seulement si de nouvelles alertes apparaissent
  // (quand le nombre d'alertes augmente, pas quand il diminue)
  useEffect(() => {
    if (!isLoading && alerts.length > 0) {
      const currentCount = alerts.length
      const previousCount = previousAlertCountRef.current

      // Si c'est la première fois qu'on charge et qu'il y a des alertes, afficher la notification
      if (previousCount === 0 && currentCount > 0) {
        setIsDismissed(false)
      }
      // Si le nombre d'alertes augmente et que l'alerte était fermée, la réafficher
      else if (currentCount > previousCount && isDismissed) {
        setIsDismissed(false)
      }

      previousAlertCountRef.current = currentCount
    } else if (alerts.length === 0) {
      previousAlertCountRef.current = 0
      // Réinitialiser le statut quand il n'y a plus d'alertes
      setIsDismissed(false)
    }
  }, [alerts.length, isLoading, isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
  }

  const handleViewDetails = () => {
    // Utiliser window.location car le router next-intl est strict sur les types
    window.location.href = '/admin/stock'
  }

  // Ne pas afficher si :
  // - En chargement ou pas d'alertes
  // - Niveau de notification est "minimal" (badge navbar seulement)
  // La vérification isDismissed est faite dans AnimatePresence pour permettre l'animation
  if (isLoading || alerts.length === 0 || notificationLevel === 'minimal') {
    return null
  }

  // Fallback sans animation si framer-motion n'est pas encore chargé
  const MotionDivComponent = motionComponents?.MotionDiv || 'div'
  const AnimatePresenceComponent =
    motionComponents?.AnimatePresence || React.Fragment

  const alertContent = !isDismissed && alerts.length > 0 && (
    <MotionDivComponent
      key='alert'
      {...(motionComponents
        ? ({
            initial: { opacity: 0, y: 20, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: -20, scale: 0.95 },
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            },
          } as React.ComponentProps<typeof MotionDivComponent>)
        : {})}
      className='fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50 max-w-[calc(100vw-1rem)] sm:max-w-sm'
    >
      <Card
        className={`border-2 shadow-lg ${
          criticalCount > 0
            ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
            : 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20'
        }`}
      >
        <CardContent className='p-2 sm:p-4'>
          <div className='flex items-start gap-2 sm:gap-3'>
            {motionComponents ? (
              <MotionDivComponent
                {...({
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  transition: { delay: 0.1, type: 'spring', stiffness: 200 },
                  className: `p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                    criticalCount > 0
                      ? 'bg-red-100 dark:bg-red-900/30'
                      : 'bg-orange-100 dark:bg-orange-900/30'
                  }`,
                } as React.ComponentProps<typeof MotionDivComponent>)}
              >
                {criticalCount > 0 ? (
                  <XCircle className='h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400' />
                ) : (
                  <AlertTriangle className='h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400' />
                )}
              </MotionDivComponent>
            ) : (
              <div
                className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                  criticalCount > 0
                    ? 'bg-red-100 dark:bg-red-900/30'
                    : 'bg-orange-100 dark:bg-orange-900/30'
                }`}
              >
                {criticalCount > 0 ? (
                  <XCircle className='h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400' />
                ) : (
                  <AlertTriangle className='h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400' />
                )}
              </div>
            )}

            <div className='flex-1 min-w-0'>
              {motionComponents ? (
                <MotionDivComponent
                  {...({
                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: 0.15 },
                    className: 'flex items-center gap-1.5 sm:gap-2 mb-1',
                  } as React.ComponentProps<typeof MotionDivComponent>)}
                >
                  <Bell className='h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse flex-shrink-0' />
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      criticalCount > 0
                        ? 'text-red-900 dark:text-red-100'
                        : 'text-orange-900 dark:text-orange-100'
                    }`}
                  >
                    {criticalCount > 0
                      ? t('OutOfStockCount', { count: criticalCount })
                      : t('LowStockCount', { count: warningCount })}
                  </span>
                </MotionDivComponent>
              ) : (
                <div className='flex items-center gap-1.5 sm:gap-2 mb-1'>
                  <Bell className='h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse flex-shrink-0' />
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      criticalCount > 0
                        ? 'text-red-900 dark:text-red-100'
                        : 'text-orange-900 dark:text-orange-100'
                    }`}
                  >
                    {criticalCount > 0
                      ? t('OutOfStockCount', { count: criticalCount })
                      : t('LowStockCount', { count: warningCount })}
                  </span>
                </div>
              )}

              {motionComponents ? (
                <MotionDivComponent
                  {...({
                    as: 'p',
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { delay: 0.2 },
                    className: `text-[10px] sm:text-xs mb-2 sm:mb-3 ${
                      criticalCount > 0
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-orange-700 dark:text-orange-300'
                    }`,
                  } as React.ComponentProps<typeof MotionDivComponent>)}
                >
                  {criticalCount > 0
                    ? t('UrgentRestockRequired')
                    : t('CheckStockLevels')}
                </MotionDivComponent>
              ) : (
                <p
                  className={`text-[10px] sm:text-xs mb-2 sm:mb-3 ${
                    criticalCount > 0
                      ? 'text-red-700 dark:text-red-300'
                      : 'text-orange-700 dark:text-orange-300'
                  }`}
                >
                  {criticalCount > 0
                    ? t('UrgentRestockRequired')
                    : t('CheckStockLevels')}
                </p>
              )}

              {motionComponents ? (
                <MotionDivComponent
                  {...({
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.25 },
                    className: 'flex items-center justify-between gap-2',
                  } as React.ComponentProps<typeof MotionDivComponent>)}
                >
                  <Button
                    size='sm'
                    variant={criticalCount > 0 ? 'destructive' : 'default'}
                    className='text-[10px] sm:text-xs h-6 sm:h-7 px-2 sm:px-3'
                    onClick={handleViewDetails}
                  >
                    {t('ViewDetails')}
                  </Button>

                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-[10px] sm:text-xs h-6 sm:h-7 p-1 sm:p-1.5'
                    onClick={handleDismiss}
                    aria-label={t('Close')}
                  >
                    <X className='h-3 w-3 sm:h-3.5 sm:w-3.5' />
                  </Button>
                </MotionDivComponent>
              ) : (
                <div className='flex items-center justify-between gap-2'>
                  <Button
                    size='sm'
                    variant={criticalCount > 0 ? 'destructive' : 'default'}
                    className='text-[10px] sm:text-xs h-6 sm:h-7 px-2 sm:px-3'
                    onClick={handleViewDetails}
                  >
                    {t('ViewDetails')}
                  </Button>

                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-[10px] sm:text-xs h-6 sm:h-7 p-1 sm:p-1.5'
                    onClick={handleDismiss}
                    aria-label={t('Close')}
                  >
                    <X className='h-3 w-3 sm:h-3.5 sm:w-3.5' />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </MotionDivComponent>
  )

  if (motionComponents) {
    return (
      <AnimatePresenceComponent
        {...({ mode: 'wait' } as React.ComponentProps<
          typeof AnimatePresenceComponent
        >)}
      >
        {alertContent}
      </AnimatePresenceComponent>
    )
  }

  return alertContent || null
}
