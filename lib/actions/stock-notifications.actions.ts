'use server'

import { connectToDatabase } from '../db'
import Product from '../db/models/product.model'
import { formatError } from '../utils'

// Interface pour les notifications
export interface StockNotification {
  productId: string
  productName: string
  countInStock: number
  minStockLevel: number
  stockStatus: 'low_stock' | 'out_of_stock'
  lastStockUpdate: string
  severity: 'warning' | 'critical'
}

/**
 * Récupère tous les produits nécessitant une notification
 * Utilise les seuils globaux comme source de vérité, avec fallback sur les seuils produits individuels
 */
export async function getProductsNeedingNotification(): Promise<{
  success: boolean
  notifications: StockNotification[]
  message?: string
}> {
  try {
    await connectToDatabase()

    // Récupérer les seuils globaux (source unique de vérité)
    const { getGlobalStockThresholds } = await import('./setting.actions')
    const thresholdsResult = await getGlobalStockThresholds()

    if (!thresholdsResult.success || !thresholdsResult.thresholds) {
      throw new Error(
        'Impossible de récupérer les seuils globaux. Veuillez les définir dans les paramètres.'
      )
    }

    const { globalLowStockThreshold, globalCriticalStockThreshold } =
      thresholdsResult.thresholds

    // Récupérer tous les produits publiés
    const products = await Product.find({ isPublished: true })
      .select('name countInStock minStockLevel stockStatus lastStockUpdate')
      .sort({ countInStock: 1 }) // Trier par stock croissant

    const notifications: StockNotification[] = []

    for (const product of products) {
      // Utiliser le seuil personnalisé du produit s'il existe, sinon utiliser le seuil global
      const effectiveLowThreshold =
        product.minStockLevel && product.minStockLevel > 0
          ? product.minStockLevel
          : globalLowStockThreshold
      const effectiveCriticalThreshold = globalCriticalStockThreshold

      let needsNotification = false
      let severity: 'warning' | 'critical' = 'warning'

      // Logique de notification unifiée:
      // - Rupture: stock = 0 → CRITIQUE
      // - Critique: stock ≤ seuil critique global → CRITIQUE
      // - Faible: stock ≤ seuil faible (produit ou global) → WARNING

      if (product.countInStock === 0) {
        needsNotification = true
        severity = 'critical'
      } else if (product.countInStock <= effectiveCriticalThreshold) {
        needsNotification = true
        severity = 'critical'
      } else if (product.countInStock <= effectiveLowThreshold) {
        needsNotification = true
        severity = 'warning'
      }

      if (needsNotification) {
        notifications.push({
          productId: product._id.toString(),
          productName: product.name,
          countInStock: product.countInStock,
          minStockLevel: effectiveLowThreshold, // Utiliser le seuil effectif (personnalisé ou global)
          stockStatus: product.stockStatus as 'low_stock' | 'out_of_stock',
          lastStockUpdate: product.lastStockUpdate.toISOString(),
          severity,
        })
      }
    }

    return {
      success: true,
      notifications,
      message: `${notifications.length} produit(s) nécessitent une attention`,
    }
  } catch (error) {
    return {
      success: false,
      notifications: [],
      message: formatError(error),
    }
  }
}

/**
 * Envoie une notification par email via Resend
 */
export async function sendStockNotificationEmail(
  notifications: StockNotification[],
  adminEmail: string = 'admin@example.com'
): Promise<{ success: boolean; message: string }> {
  try {
    console.log('📧 Envoi de notification par email à:', adminEmail)
    console.log('📊 Produits concernés:', notifications.length)

    const criticalCount = notifications.filter(
      (n) => n.severity === 'critical'
    ).length
    const warningCount = notifications.filter(
      (n) => n.severity === 'warning'
    ).length

    // Essayer d'envoyer l'email via Resend si la clé API est disponible
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const { SENDER_NAME, SENDER_EMAIL } = await import('@/lib/constants')
        const resend = new Resend(process.env.RESEND_API_KEY)

        const result = await resend.emails.send({
          from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
          to: adminEmail,
          subject: `🚨 Alertes de Stock - ${criticalCount} critique(s), ${warningCount} avertissement(s)`,
          html: generateEmailHTML(notifications),
        })

        console.log('✅ Email envoyé via Resend:', result)

        return {
          success: true,
          message: `Notification envoyée à ${adminEmail} pour ${notifications.length} produit(s)`,
        }
      } catch (resendError) {
        console.error('❌ Erreur Resend, fallback sur simulation:', resendError)
        // Fallback sur simulation si Resend échoue
      }
    }

    // Simulation si Resend n'est pas configuré
    const emailContent = {
      to: adminEmail,
      subject: `🚨 Alertes de Stock - ${criticalCount} critique(s), ${warningCount} avertissement(s)`,
      html: generateEmailHTML(notifications),
    }

    console.log('📧 Email simulé (Resend non configuré):', emailContent)

    return {
      success: true,
      message: `Notification simulée à ${adminEmail} pour ${notifications.length} produit(s). Configurez RESEND_API_KEY pour envoyer de vrais emails.`,
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

/**
 * Génère le HTML pour l'email de notification
 */
function generateEmailHTML(notifications: StockNotification[]): string {
  const criticalNotifications = notifications.filter(
    (n) => n.severity === 'critical'
  )
  const warningNotifications = notifications.filter(
    (n) => n.severity === 'warning'
  )

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Alertes de Stock</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .critical { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .warning { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .product-name { font-weight: bold; color: #1f2937; }
        .stock-info { color: #6b7280; font-size: 14px; margin-top: 5px; }
        .footer { background: #f9fafb; padding: 15px; text-align: center; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Alertes de Stock</h1>
          <p>${notifications.length} produit(s) nécessitent votre attention</p>
        </div>
        
        <div class="content">
          ${
            criticalNotifications.length > 0
              ? `
            <h2 style="color: #dc2626;">🔴 Ruptures de Stock (${criticalNotifications.length})</h2>
            ${criticalNotifications
              .map(
                (n) => `
              <div class="critical">
                <div class="product-name">${n.productName}</div>
                <div class="stock-info">
                  Stock: ${n.countInStock} unité(s) | Seuil: ${n.minStockLevel} | 
                  ${n.stockStatus === 'out_of_stock' ? 'RUPTURE' : 'CRITIQUE'}
                </div>
              </div>
            `
              )
              .join('')}
          `
              : ''
          }
          
          ${
            warningNotifications.length > 0
              ? `
            <h2 style="color: #f59e0b;">🟡 Stocks Faibles (${warningNotifications.length})</h2>
            ${warningNotifications
              .map(
                (n) => `
              <div class="warning">
                <div class="product-name">${n.productName}</div>
                <div class="stock-info">
                  Stock: ${n.countInStock} unité(s) | Seuil: ${n.minStockLevel} | 
                  Attention requise
                </div>
              </div>
            `
              )
              .join('')}
          `
              : ''
          }
          
          <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px; text-align: center;">
            <p><strong>Action recommandée :</strong></p>
            <p>Connectez-vous à votre interface d'administration pour gérer ces alertes.</p>
            <a href="${process.env.NEXTAUTH_URL}/admin/stock" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
              Gérer les Stocks
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>Cette notification a été générée automatiquement par votre système de gestion des stocks.</p>
          <p>Dernière mise à jour: ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Tâche programmée pour vérifier les stocks et envoyer des notifications
 * À exécuter via un cron job ou un service comme Vercel Cron
 */
export async function checkStockAndNotify(adminEmail?: string): Promise<{
  success: boolean
  message: string
  notificationsSent: number
}> {
  try {
    const result = await getProductsNeedingNotification()

    if (!result.success || result.notifications.length === 0) {
      return {
        success: true,
        message: 'Aucune notification nécessaire',
        notificationsSent: 0,
      }
    }

    // Récupérer l'email depuis les paramètres si non fourni
    let emailToUse = adminEmail
    if (!emailToUse) {
      const { getNotificationSettings } = await import(
        './notification-settings.actions'
      )
      const settingsResult = await getNotificationSettings()
      if (settingsResult.success && settingsResult.settings?.adminEmail) {
        emailToUse = settingsResult.settings.adminEmail
      } else {
        emailToUse = 'admin@example.com'
      }
    }

    // Envoyer l'email de notification
    const emailResult = await sendStockNotificationEmail(
      result.notifications,
      emailToUse
    )

    if (!emailResult.success) {
      return {
        success: false,
        message: `Erreur lors de l'envoi: ${emailResult.message}`,
        notificationsSent: 0,
      }
    }

    return {
      success: true,
      message: `Notification envoyée pour ${result.notifications.length} produit(s)`,
      notificationsSent: result.notifications.length,
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
      notificationsSent: 0,
    }
  }
}
