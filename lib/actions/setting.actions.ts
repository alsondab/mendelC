'use server'
import { ISettingInput } from '@/types'
import data from '../data'
import Setting from '../db/models/setting.model'
import { connectToDatabase } from '../db'
import { formatError } from '../utils'
import { cookies } from 'next/headers'

const globalForSettings = global as unknown as {
  cachedSettings: ISettingInput | null
}
export const getNoCachedSetting = async (): Promise<ISettingInput> => {
  await connectToDatabase()
  const setting = await Setting.findOne()
  return JSON.parse(JSON.stringify(setting)) as ISettingInput
}

export const getSetting = async (): Promise<ISettingInput> => {
  if (!globalForSettings.cachedSettings) {
    console.log('Server hit db')
    await connectToDatabase()
    const setting = await Setting.findOne().lean()
    globalForSettings.cachedSettings = setting
      ? JSON.parse(JSON.stringify(setting))
      : data.settings[0]
  }
  return globalForSettings.cachedSettings as ISettingInput
}

export const updateSetting = async (newSetting: ISettingInput) => {
  try {
    await connectToDatabase()
    const updatedSetting = await Setting.findOneAndUpdate({}, newSetting, {
      upsert: true,
      new: true,
    }).lean()
    globalForSettings.cachedSettings = JSON.parse(
      JSON.stringify(updatedSetting)
    ) // Update the cache
    return {
      success: true,
      message: 'Paramètres mis à jour avec succès',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Server action to update the currency cookie
export const setCurrencyOnServer = async (newCurrency: string) => {
  'use server'
  const cookiesStore = await cookies()
  cookiesStore.set('currency', newCurrency)

  return {
    success: true,
    message: 'Devise mise à jour avec succès',
  }
}

/**
 * Récupère les seuils globaux de stock (source unique de vérité)
 */
export const getGlobalStockThresholds = async (): Promise<{
  success: boolean
  thresholds?: {
    globalLowStockThreshold: number
    globalCriticalStockThreshold: number
  }
  message?: string
}> => {
  try {
    await connectToDatabase()
    const setting = await Setting.findOne().select(
      'notificationSettings.globalLowStockThreshold notificationSettings.globalCriticalStockThreshold'
    )

    if (!setting || !setting.notificationSettings) {
      // Valeurs par défaut si non définies
      return {
        success: true,
        thresholds: {
          globalLowStockThreshold: 5,
          globalCriticalStockThreshold: 2,
        },
      }
    }

    // Utiliser les nouveaux champs globaux, fallback sur les anciens pour migration
    const globalLowStockThreshold =
      setting.notificationSettings.globalLowStockThreshold ??
      setting.notificationSettings.lowStockThreshold ??
      5
    const globalCriticalStockThreshold =
      setting.notificationSettings.globalCriticalStockThreshold ??
      setting.notificationSettings.criticalStockThreshold ??
      2

    return {
      success: true,
      thresholds: {
        globalLowStockThreshold,
        globalCriticalStockThreshold,
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
 * Met à jour les seuils globaux de stock
 */
export const updateGlobalStockThresholds = async ({
  globalLowStockThreshold,
  globalCriticalStockThreshold,
}: {
  globalLowStockThreshold: number
  globalCriticalStockThreshold: number
}): Promise<{ success: boolean; message?: string }> => {
  try {
    await connectToDatabase()

    if (globalLowStockThreshold < 0 || globalCriticalStockThreshold < 0) {
      throw new Error('Les seuils ne peuvent pas être négatifs')
    }

    if (globalCriticalStockThreshold >= globalLowStockThreshold) {
      throw new Error(
        'Le seuil critique doit être strictement inférieur au seuil faible'
      )
    }

    const setting = await Setting.findOne()

    if (!setting) {
      throw new Error('Aucun paramètre trouvé. Veuillez initialiser les paramètres du site.')
    }

    // Mettre à jour les seuils globaux
    if (!setting.notificationSettings) {
      setting.notificationSettings = {
        emailNotifications: true,
        adminEmail: 'admin@example.com',
        globalLowStockThreshold: 5,
        globalCriticalStockThreshold: 2,
        lowStockThreshold: 5,
        criticalStockThreshold: 2,
        notificationFrequency: 'hourly',
        uiNotificationLevel: 'standard',
      }
    }

    setting.notificationSettings.globalLowStockThreshold =
      globalLowStockThreshold
    setting.notificationSettings.globalCriticalStockThreshold =
      globalCriticalStockThreshold

    // Migration: mettre à jour aussi les anciens champs pour compatibilité
    setting.notificationSettings.lowStockThreshold = globalLowStockThreshold
    setting.notificationSettings.criticalStockThreshold =
      globalCriticalStockThreshold

    await setting.save()

    // Invalider le cache
    globalForSettings.cachedSettings = null

    return {
      success: true,
      message: 'Seuils globaux mis à jour avec succès',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}
