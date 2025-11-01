'use server'

import { connectToDatabase } from '../db'
import Product from '../db/models/product.model'
import { formatError } from '../utils'
import { revalidatePath, revalidateTag } from 'next/cache'
import { calculateStockStatus } from '../utils/stock-utils'

/**
 * Déclenche automatiquement une notification si le produit nécessite une attention
 */
async function triggerAutoNotification(productId: string) {
  try {
    // Récupérer le produit pour vérifier son statut
    const product = await Product.findById(productId)
    if (!product || !product.isPublished) return

    // Vérifier si le produit nécessite une notification
    const { getProductsNeedingNotification } = await import(
      './stock-notifications.actions'
    )
    const result = await getProductsNeedingNotification()

    if (result.success && result.notifications.length > 0) {
      // Vérifier si ce produit est dans les notifications
      const productNeedsNotification = result.notifications.some(
        (n) => n.productId === productId
      )

      if (productNeedsNotification) {
        // Récupérer l'email admin depuis les paramètres
        const { getNotificationSettings } = await import(
          './notification-settings.actions'
        )
        const settingsResult = await getNotificationSettings()
        const adminEmail =
          settingsResult.success && settingsResult.settings?.adminEmail
            ? settingsResult.settings.adminEmail
            : 'admin@example.com'

        // Vérifier si les notifications email sont activées
        const emailEnabled =
          settingsResult.success &&
          settingsResult.settings?.emailNotifications !== false

        if (emailEnabled) {
          // Filtrer les notifications pour ce produit spécifique
          const productNotifications = result.notifications.filter(
            (n) => n.productId === productId
          )

          if (productNotifications.length > 0) {
            const { sendStockNotificationEmail } = await import(
              './stock-notifications.actions'
            )
            // Envoyer la notification en arrière-plan (ne pas bloquer)
            sendStockNotificationEmail(productNotifications, adminEmail).catch(
              (error) => {
                console.error(
                  'Erreur lors de l\'envoi automatique de notification:',
                  error
                )
              }
            )
          }
        }
      }
    }
  } catch (error) {
    // Ne pas bloquer la mise à jour du stock en cas d'erreur de notification
    console.error(
      'Erreur lors du déclenchement automatique de notification:',
      error
    )
  }
}

// 🚀 ACTIONS POUR LA GESTION DES STOCKS

/**
 * Met à jour le stock d'un produit
 */
export async function updateProductStock({
  productId,
  quantity,
  operation = 'set', // 'set', 'add', 'subtract'
}: {
  productId: string
  quantity: number
  operation?: 'set' | 'add' | 'subtract'
}) {
  try {
    await connectToDatabase()

    const product = await Product.findById(productId)
    if (!product) {
      throw new Error('Produit non trouvé')
    }

    let newQuantity = product.countInStock

    switch (operation) {
      case 'set':
        newQuantity = quantity
        break
      case 'add':
        newQuantity = product.countInStock + quantity
        break
      case 'subtract':
        newQuantity = Math.max(0, product.countInStock - quantity)
        break
    }

    const quantityBefore = product.countInStock
    product.countInStock = newQuantity
    // Le statut sera mis à jour automatiquement par le middleware pre-save

    await product.save()

    // Enregistrer dans l'historique (en arrière-plan, ne pas bloquer)
    const { recordStockMovement } = await import('./stock-history.actions')
    const { auth } = await import('@/auth')
    const session = await auth()
    
    // Déterminer la raison selon l'opération (tous les ajustements manuels utilisent 'adjustment')
    let reason = 'Ajustement manuel'
    
    if (operation === 'add') {
      reason = 'Ajout de stock'
    } else if (operation === 'set') {
      reason = 'Définition manuelle du stock'
    } else if (operation === 'subtract') {
      reason = 'Retrait de stock'
    }

    recordStockMovement({
      productId: product._id.toString(),
      productName: product.name,
      movementType: 'adjustment', // Tous les ajustements manuels utilisent ce type
      quantityBefore,
      quantityAfter: newQuantity,
      reason,
      userId: session?.user?.id,
      metadata: {
        operation,
        quantity: quantity.toString(),
      },
    }).catch((error) => {
      console.error('Erreur lors de l\'enregistrement de l\'historique:', error)
    })

    // Déclencher automatiquement une notification si nécessaire
    triggerAutoNotification(productId).catch((error) => {
      console.error('Erreur lors de la notification automatique:', error)
    })

    // Invalider le cache et les chemins
    revalidateTag('stock')
    revalidatePath('/admin/products')
    revalidatePath('/admin/stock')
    revalidatePath(`/product/${product.slug}`)

    return {
      success: true,
      message: `Stock mis à jour: ${newQuantity} unités`,
      product: {
        id: product._id.toString(),
        name: product.name,
        countInStock: product.countInStock,
        stockStatus: product.stockStatus,
        isLowStock: product.isLowStock,
        isOutOfStock: product.isOutOfStock,
      },
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Récupère tous les produits avec un stock faible
 */
export async function getLowStockProducts() {
  try {
    await connectToDatabase()

    const products = await Product.find({
      isLowStock: true,
      isPublished: true,
    }).select(
      'name slug countInStock minStockLevel maxStockLevel stockStatus lastStockUpdate'
    )

    return {
      success: true,
      products: products.map((product) => ({
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        countInStock: product.countInStock,
        minStockLevel: product.minStockLevel,
        maxStockLevel: product.maxStockLevel,
        stockStatus: product.stockStatus,
        lastStockUpdate: product.lastStockUpdate.toISOString(),
      })),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Récupère tous les produits en rupture de stock
 */
export async function getOutOfStockProducts() {
  try {
    await connectToDatabase()

    const products = await Product.find({
      isOutOfStock: true,
      isPublished: true,
    }).select(
      'name slug countInStock minStockLevel maxStockLevel stockStatus lastStockUpdate'
    )

    return {
      success: true,
      products: products.map((product) => ({
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        countInStock: product.countInStock,
        minStockLevel: product.minStockLevel,
        maxStockLevel: product.maxStockLevel,
        stockStatus: product.stockStatus,
        lastStockUpdate: product.lastStockUpdate.toISOString(),
      })),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Met à jour les seuils de stock d'un produit
 */
export async function updateStockThresholds({
  productId,
  minStockLevel,
  maxStockLevel,
}: {
  productId: string
  minStockLevel: number
  maxStockLevel: number
}) {
  try {
    await connectToDatabase()

    if (minStockLevel < 0) {
      throw new Error('Le seuil minimum ne peut pas être négatif')
    }

    if (maxStockLevel <= minStockLevel) {
      throw new Error('Le seuil maximum doit être supérieur au seuil minimum')
    }

    const product = await Product.findById(productId)
    if (!product) {
      throw new Error('Produit non trouvé')
    }

    product.minStockLevel = minStockLevel
    product.maxStockLevel = maxStockLevel
    // Le statut sera mis à jour automatiquement par le middleware pre-save

    await product.save()

    // Déclencher automatiquement une notification si nécessaire (le stock pourrait maintenant être en alerte)
    triggerAutoNotification(productId).catch((error) => {
      console.error('Erreur lors de la notification automatique:', error)
    })

    // Invalider le cache et les chemins
    revalidateTag('stock')
    revalidatePath('/admin/products')
    revalidatePath('/admin/stock')
    revalidatePath(`/product/${product.slug}`)

    return {
      success: true,
      message: 'Seuils de stock mis à jour avec succès',
      product: {
        id: product._id.toString(),
        name: product.name,
        minStockLevel: product.minStockLevel,
        maxStockLevel: product.maxStockLevel,
        stockStatus: product.stockStatus,
      },
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Récupère les statistiques de stock
 */
export async function getStockStatistics() {
  try {
    await connectToDatabase()

    // Utiliser Promise.all pour exécuter les requêtes en parallèle
    const [totalProducts, inStockProducts, lowStockProducts, outOfStockProducts, stockValueResult] = await Promise.all([
      Product.countDocuments({ isPublished: true }),
      Product.countDocuments({
        stockStatus: 'in_stock',
        isPublished: true,
      }),
      Product.countDocuments({
        stockStatus: 'low_stock',
        isPublished: true,
      }),
      Product.countDocuments({
        stockStatus: 'out_of_stock',
        isPublished: true,
      }),
      // Utiliser une agrégation MongoDB pour calculer la valeur totale du stock de manière optimisée
      // Cela évite de charger tous les produits en mémoire
      Product.aggregate([
        {
          $match: { isPublished: true }
        },
        {
          $project: {
            stockValue: {
              $multiply: ['$countInStock', '$price']
            }
          }
        },
        {
          $group: {
            _id: null,
            totalStockValue: { $sum: '$stockValue' }
          }
        }
      ])
    ])

    // Extraire la valeur totale du résultat de l'agrégation
    const totalStockValue = stockValueResult.length > 0 && stockValueResult[0].totalStockValue 
      ? Math.round(stockValueResult[0].totalStockValue * 100) / 100 
      : 0

    return {
      success: true,
      statistics: {
        totalProducts,
        inStockProducts,
        lowStockProducts,
        outOfStockProducts,
        totalStockValue,
      },
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Met à jour le statut de stock de tous les produits
 */
export async function updateAllStockStatus() {
  try {
    await connectToDatabase()

    const products = await Product.find({ isPublished: true })
    let updatedCount = 0

    for (const product of products) {
      const oldStatus = product.stockStatus

      // Calculer le nouveau statut manuellement
      const stockStatusData = calculateStockStatus(
        product.countInStock,
        product.minStockLevel
      )

      // Mettre à jour les champs de statut
      product.stockStatus = stockStatusData.stockStatus
      product.isLowStock = stockStatusData.isLowStock
      product.isOutOfStock = stockStatusData.isOutOfStock
      product.lastStockUpdate = new Date()

      // Marquer le document comme modifié pour déclencher la sauvegarde
      product.markModified('stockStatus')
      product.markModified('isLowStock')
      product.markModified('isOutOfStock')
      product.markModified('lastStockUpdate')

      await product.save()

      // Vérifier si le statut a changé
      if (oldStatus !== product.stockStatus) {
        updatedCount++
      }
    }

    // Invalider le cache et les chemins
    revalidateTag('stock')
    revalidatePath('/admin/products')
    revalidatePath('/admin/stock')

    return {
      success: true,
      message: `${updatedCount} produits mis à jour`,
      updatedCount,
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Applique les seuils globaux à tous les produits
 * Utile pour une migration en masse ou une réinitialisation
 */
export async function applyGlobalThresholdsToAllProducts({
  applyToExistingProducts = false,
}: {
  applyToExistingProducts?: boolean
}): Promise<{
  success: boolean
  message: string
  updatedCount?: number
}> {
  try {
    await connectToDatabase()

    // Récupérer les seuils globaux
    const { getGlobalStockThresholds } = await import('./setting.actions')
    const thresholdsResult = await getGlobalStockThresholds()

    if (!thresholdsResult.success || !thresholdsResult.thresholds) {
      throw new Error(
        'Impossible de récupérer les seuils globaux. Veuillez d\'abord les définir dans les paramètres.'
      )
    }

    const { globalLowStockThreshold } =
      thresholdsResult.thresholds

    // Trouver tous les produits publiés
    const products = await Product.find({ isPublished: true })
    let updatedCount = 0

    for (const product of products) {
      let shouldUpdate = false

      // Si applyToExistingProducts est true, mettre à jour tous les produits
      // Sinon, seulement ceux qui n'ont pas de seuil personnalisé (null ou 0)
      if (applyToExistingProducts) {
        shouldUpdate = true
      } else {
        // Appliquer seulement si le produit n'a pas de seuil personnalisé
        if (!product.minStockLevel || product.minStockLevel === 0) {
          shouldUpdate = true
        }
      }

      if (shouldUpdate) {
        product.minStockLevel = globalLowStockThreshold
        // Définir maxStockLevel si non défini ou si inférieur au min
        if (
          !product.maxStockLevel ||
          product.maxStockLevel <= product.minStockLevel
        ) {
          product.maxStockLevel = globalLowStockThreshold * 20 // 20x le min par défaut
        }

        // Recalculer le statut avec le nouveau seuil
        const stockStatusData = calculateStockStatus(
          product.countInStock,
          product.minStockLevel
        )
        product.stockStatus = stockStatusData.stockStatus
        product.isLowStock = stockStatusData.isLowStock
        product.isOutOfStock = stockStatusData.isOutOfStock
        product.lastStockUpdate = new Date()

        await product.save()
        updatedCount++
      }
    }

    // Invalider le cache et les chemins
    revalidateTag('stock')
    revalidatePath('/admin/products')
    revalidatePath('/admin/stock')

    return {
      success: true,
      message: `${updatedCount} produit(s) mis à jour avec les seuils globaux`,
      updatedCount,
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}
