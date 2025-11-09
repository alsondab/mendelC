'use client'

import { useRealtimeStockAlerts } from '@/hooks/use-stock-alerts'
import { AlertTriangle, XCircle, Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'

export function StockAlertIndicator() {
  const { alerts, isLoading, criticalCount, warningCount } =
    useRealtimeStockAlerts()

  // IMPORTANT: L'indicateur doit toujours être visible s'il y a des alertes
  // Indépendamment de l'état de la notification persistante (fermée ou non)
  // Afficher les alertes même pendant le chargement si elles existent déjà
  // Toujours réserver un espace fixe pour éviter les déplacements

  // Afficher le skeleton uniquement si on charge ET qu'on n'a pas encore d'alertes
  if (isLoading && alerts.length === 0) {
    return (
      <div className="w-8 sm:w-10 flex items-center justify-center flex-shrink-0">
        <div className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  // Afficher uniquement le badge d'alerte OU le compteur de cloche (pas les deux)
  return (
    <div className="w-8 sm:w-10 flex items-center justify-center flex-shrink-0">
      <AnimatePresence mode="wait">
        {alerts.length > 0 ? (
          criticalCount > 0 ? (
            <motion.div
              key="critical"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                duration: 0.2,
              }}
              className="flex items-center gap-1"
              title={`${criticalCount} produit(s) en rupture de stock`}
            >
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
              <Badge
                variant="destructive"
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
              >
                {criticalCount}
              </Badge>
            </motion.div>
          ) : warningCount > 0 ? (
            <motion.div
              key="warning"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                duration: 0.2,
              }}
              className="flex items-center gap-1"
              title={`${warningCount} produit(s) avec stock faible`}
            >
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
              <Badge
                variant="secondary"
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
              >
                {warningCount}
              </Badge>
            </motion.div>
          ) : (
            <motion.div
              key="bell"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                duration: 0.2,
              }}
              className="flex items-center gap-1 text-muted-foreground"
              title={`${alerts.length} alerte(s) au total`}
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium">
                {alerts.length}
              </span>
            </motion.div>
          )
        ) : (
          // Espace réservé vide pour éviter les déplacements
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
