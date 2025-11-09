'use server'

import { connectToDatabase } from '../db'
import Setting from '../db/models/setting.model'
import { formatError } from '../utils'
import { revalidatePath } from 'next/cache'

export interface NotificationSettings {
  emailNotifications: boolean
  adminEmail: string
  globalLowStockThreshold: number
  globalCriticalStockThreshold: number
  lowStockThreshold: number
  criticalStockThreshold: number
  notificationFrequency: 'realtime' | 'hourly' | 'daily'
  uiNotificationLevel: 'minimal' | 'standard' | 'full'
}

/**
 * Récupère les paramètres de notification
 */
export async function getNotificationSettings(): Promise<{
  success: boolean
  settings?: NotificationSettings
  message?: string
}> {
  try {
    await connectToDatabase()

    const setting = await Setting.findOne().lean()

    if (!setting || !setting.notificationSettings) {
      // Retourner les valeurs par défaut si aucun paramètre n'existe
      return {
        success: true,
        settings: {
          emailNotifications: true,
          adminEmail: 'admin@example.com',
          globalLowStockThreshold: 5,
          globalCriticalStockThreshold: 2,
          lowStockThreshold: 5,
          criticalStockThreshold: 2,
          notificationFrequency: 'hourly',
          uiNotificationLevel: 'standard',
        },
      }
    }

    const notificationSettings = setting.notificationSettings as Record<
      string,
      unknown
    >

    // Migration : convertir les anciens champs enableBanner/enableToast en uiNotificationLevel
    let uiNotificationLevel: 'minimal' | 'standard' | 'full' = 'standard'
    if (
      notificationSettings.uiNotificationLevel &&
      typeof notificationSettings.uiNotificationLevel === 'string'
    ) {
      uiNotificationLevel = notificationSettings.uiNotificationLevel as
        | 'minimal'
        | 'standard'
        | 'full'
    } else {
      // Migration depuis les anciens champs
      const enableBanner =
        typeof notificationSettings.enableBanner === 'boolean'
          ? notificationSettings.enableBanner
          : true
      const enableToast =
        typeof notificationSettings.enableToast === 'boolean'
          ? notificationSettings.enableToast
          : true

      if (!enableBanner && !enableToast) {
        uiNotificationLevel = 'minimal'
      } else if (enableBanner && !enableToast) {
        uiNotificationLevel = 'standard'
      } else {
        uiNotificationLevel = 'full'
      }
    }

    return {
      success: true,
      settings: {
        emailNotifications:
          typeof notificationSettings.emailNotifications === 'boolean'
            ? notificationSettings.emailNotifications
            : true,
        adminEmail:
          typeof notificationSettings.adminEmail === 'string'
            ? notificationSettings.adminEmail
            : 'admin@example.com',
        globalLowStockThreshold:
          typeof notificationSettings.globalLowStockThreshold === 'number'
            ? notificationSettings.globalLowStockThreshold
            : typeof notificationSettings.lowStockThreshold === 'number'
              ? notificationSettings.lowStockThreshold
              : 5,
        globalCriticalStockThreshold:
          typeof notificationSettings.globalCriticalStockThreshold === 'number'
            ? notificationSettings.globalCriticalStockThreshold
            : typeof notificationSettings.criticalStockThreshold === 'number'
              ? notificationSettings.criticalStockThreshold
              : 2,
        lowStockThreshold:
          typeof notificationSettings.lowStockThreshold === 'number'
            ? notificationSettings.lowStockThreshold
            : 5,
        criticalStockThreshold:
          typeof notificationSettings.criticalStockThreshold === 'number'
            ? notificationSettings.criticalStockThreshold
            : 2,
        notificationFrequency:
          typeof notificationSettings.notificationFrequency === 'string' &&
          (notificationSettings.notificationFrequency === 'realtime' ||
            notificationSettings.notificationFrequency === 'hourly' ||
            notificationSettings.notificationFrequency === 'daily')
            ? notificationSettings.notificationFrequency
            : 'hourly',
        uiNotificationLevel,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

/**
 * Sauvegarde les paramètres de notification
 */
export async function saveNotificationSettings(
  settings: NotificationSettings
): Promise<{
  success: boolean
  message: string
}> {
  try {
    await connectToDatabase()

    // Validation de l'email
    if (settings.emailNotifications && !settings.adminEmail) {
      throw new Error('Email requis si les notifications email sont activées')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (settings.emailNotifications && !emailRegex.test(settings.adminEmail)) {
      throw new Error('Format email invalide')
    }

    // Récupérer ou créer le setting
    const setting = await Setting.findOne()

    if (!setting) {
      // Si aucun setting n'existe, on devrait le créer avec les valeurs par défaut
      // Pour l'instant, on retourne une erreur car le setting doit exister
      throw new Error('Configuration générale non trouvée')
    }

    // Mettre à jour les paramètres de notification
    setting.notificationSettings = {
      emailNotifications: settings.emailNotifications,
      adminEmail: settings.adminEmail,
      globalLowStockThreshold: settings.globalLowStockThreshold,
      globalCriticalStockThreshold: settings.globalCriticalStockThreshold,
      lowStockThreshold: settings.lowStockThreshold,
      criticalStockThreshold: settings.criticalStockThreshold,
      notificationFrequency: settings.notificationFrequency,
      uiNotificationLevel: settings.uiNotificationLevel,
    }

    await setting.save()

    revalidatePath('/admin/notifications')

    return {
      success: true,
      message: 'Paramètres de notification sauvegardés avec succès',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}
