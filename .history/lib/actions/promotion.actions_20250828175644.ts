import { connectToDatabase } from '@/lib/db/mongoose'
import Product from '@/lib/db/models/product.model'

/**
 * Système automatique de gestion des promotions temporaires
 * Expire automatiquement les promotions et ajuste les tags selon les performances
 */

export const checkAndUpdateExpiredPromotions = async () => {
  try {
    await connectToDatabase()
    const now = new Date()

    // Trouver tous les produits avec des promotions expirées
    const expiredPromotions = await Product.find({
      isPromotionActive: true,
      promotionExpiryDate: { $lte: now },
    })

    console.log(`🔍 ${expiredPromotions.length} promotions expirées trouvées`)

    for (const product of expiredPromotions) {
      await updateProductAfterPromotionExpiry(product)
    }

    return { success: true, updatedCount: expiredPromotions.length }
  } catch (error) {
    console.error(
      'Erreur lors de la vérification des promotions expirées:',
      error
    )
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }
  }
}

const updateProductAfterPromotionExpiry = async (product: any) => {
  try {
    // Sauvegarder les tags originaux si pas encore sauvegardés
    if (!product.originalTags || product.originalTags.length === 0) {
      product.originalTags = product.tags.filter(
        (tag: string) => tag !== 'todays-deal'
      )
    }

    // Retirer le tag de promotion
    const updatedTags = product.tags.filter(
      (tag: string) => tag !== 'todays-deal'
    )

    // Décider des nouveaux tags selon les performances
    const newTags = await determineNewTags(product, updatedTags)

    // Mettre à jour le produit
    await Product.findByIdAndUpdate(product._id, {
      tags: newTags,
      isPromotionActive: false,
      promotionExpiryDate: null,
      promotionStartDate: null,
      // Remettre le prix original si c'était une promotion
      price: product.listPrice > 0 ? product.listPrice : product.price,
      listPrice: 0,
    })

    console.log(
      `✅ Promotion expirée pour ${product.name}, nouveaux tags: ${newTags.join(', ')}`
    )
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de ${product.name}:`, error)
  }
}

const determineNewTags = async (product: any, currentTags: string[]) => {
  const newTags = [...currentTags]

  // Si le produit s'est bien vendu pendant la promotion, le promouvoir
  if (product.numSales > 10) {
    // Seuil de 10 ventes
    if (!newTags.includes('best-seller')) {
      newTags.push('best-seller')
    }
    if (!newTags.includes('featured')) {
      newTags.push('featured')
    }
    console.log(
      `🏆 ${product.name} promu en best-seller (${product.numSales} ventes)`
    )
  }

  // Si c'est un nouveau produit récent, garder le tag new-arrival
  const daysSinceCreation = Math.floor(
    (Date.now() - product.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (daysSinceCreation <= 30 && !newTags.includes('new-arrival')) {
    newTags.push('new-arrival')
  }

  // Si c'est un produit premium (prix élevé), ajouter le tag premium
  if (product.price > 500 && !newTags.includes('premium')) {
    newTags.push('premium')
  }

  return newTags
}

/**
 * Activer une promotion temporaire
 */
export const activatePromotion = async (
  productId: string,
  promotionData: {
    startDate?: Date
    expiryDate: Date
    originalPrice: number
    salePrice: number
  }
) => {
  try {
    await connectToDatabase()

    const product = await Product.findById(productId)
    if (!product) {
      return { success: false, message: 'Produit non trouvé' }
    }

    // Sauvegarder les tags actuels comme tags originaux
    const originalTags = [...product.tags]

    // Ajouter le tag de promotion
    const updatedTags = [...product.tags]
    if (!updatedTags.includes('todays-deal')) {
      updatedTags.push('todays-deal')
    }

    // Mettre à jour le produit
    await Product.findByIdAndUpdate(productId, {
      tags: updatedTags,
      originalTags: originalTags,
      isPromotionActive: true,
      promotionStartDate: promotionData.startDate || new Date(),
      promotionExpiryDate: promotionData.expiryDate,
      listPrice: promotionData.originalPrice,
      price: promotionData.salePrice,
    })

    console.log(`🎉 Promotion activée pour ${product.name}`)
    return { success: true, message: 'Promotion activée avec succès' }
  } catch (error) {
    console.error("Erreur lors de l'activation de la promotion:", error)
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }
  }
}

/**
 * Désactiver manuellement une promotion
 */
export const deactivatePromotion = async (productId: string) => {
  try {
    await connectToDatabase()

    const product = await Product.findById(productId)
    if (!product) {
      return { success: false, message: 'Produit non trouvé' }
    }

    // Restaurer les tags originaux
    const tagsToRestore =
      product.originalTags && product.originalTags.length > 0
        ? product.originalTags
        : ['new-arrival']

    // Mettre à jour le produit
    await Product.findByIdAndUpdate(productId, {
      tags: tagsToRestore,
      isPromotionActive: false,
      promotionExpiryDate: null,
      promotionStartDate: null,
      price: product.listPrice > 0 ? product.listPrice : product.price,
      listPrice: 0,
    })

    console.log(`⏹️ Promotion désactivée pour ${product.name}`)
    return { success: true, message: 'Promotion désactivée avec succès' }
  } catch (error) {
    console.error('Erreur lors de la désactivation de la promotion:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }
  }
}

/**
 * Obtenir les statistiques des promotions
 */
export const getPromotionStats = async () => {
  try {
    await connectToDatabase()
    const now = new Date()

    const stats = await Product.aggregate([
      {
        $facet: {
          activePromotions: [
            {
              $match: {
                isPromotionActive: true,
                promotionExpiryDate: { $gt: now },
              },
            },
            { $count: 'count' },
          ],
          expiredPromotions: [
            {
              $match: {
                isPromotionActive: true,
                promotionExpiryDate: { $lte: now },
              },
            },
            { $count: 'count' },
          ],
          totalPromotions: [
            { $match: { isPromotionActive: true } },
            { $count: 'count' },
          ],
        },
      },
    ])

    return {
      activePromotions: stats[0].activePromotions[0]?.count || 0,
      expiredPromotions: stats[0].expiredPromotions[0]?.count || 0,
      totalPromotions: stats[0].totalPromotions[0]?.count || 0,
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return { activePromotions: 0, expiredPromotions: 0, totalPromotions: 0 }
  }
}
