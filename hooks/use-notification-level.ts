'use client'

import { useState, useEffect } from 'react'
import { getNotificationSettings } from '@/lib/actions/notification-settings.actions'

type NotificationLevel = 'minimal' | 'standard' | 'full'

/**
 * Hook pour récupérer le niveau de notification UI configuré
 * @returns Le niveau de notification (minimal, standard, full)
 */
export function useNotificationLevel(): NotificationLevel {
  const [level, setLevel] = useState<NotificationLevel>('standard')

  useEffect(() => {
    const loadLevel = async () => {
      try {
        const result = await getNotificationSettings()
        if (result.success && result.settings?.uiNotificationLevel) {
          setLevel(result.settings.uiNotificationLevel)
        }
      } catch (error) {
        console.error('Erreur lors du chargement du niveau de notification:', error)
        // Garder la valeur par défaut 'standard'
      }
    }

    loadLevel()
  }, [])

  return level
}

