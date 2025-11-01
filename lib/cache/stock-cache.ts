import { unstable_cache } from 'next/cache'

/**
 * Cache pour les statistiques de stock
 * Durée de validité : 120 secondes (augmentée pour réduire les requêtes)
 */
export const getCachedStockStatistics = unstable_cache(
  async () => {
    const { getStockStatistics } = await import('../actions/stock.actions')
    return await getStockStatistics()
  },
  ['stock-statistics'],
  {
    revalidate: 120, // Cache valide 120 secondes (augmenté pour améliorer les performances)
    tags: ['stock'], // Pour invalidation manuelle
  }
)

/**
 * Cache pour les produits en stock faible
 * Durée de validité : 60 secondes (augmentée pour réduire les requêtes)
 */
export const getCachedLowStockProducts = unstable_cache(
  async () => {
    const { getLowStockProducts } = await import('../actions/stock.actions')
    return await getLowStockProducts()
  },
  ['stock-low'],
  {
    revalidate: 60, // Cache valide 60 secondes (augmenté pour améliorer les performances)
    tags: ['stock'],
  }
)

/**
 * Cache pour les produits en rupture de stock
 * Durée de validité : 60 secondes (augmentée pour réduire les requêtes)
 */
export const getCachedOutOfStockProducts = unstable_cache(
  async () => {
    const { getOutOfStockProducts } = await import('../actions/stock.actions')
    return await getOutOfStockProducts()
  },
  ['stock-out'],
  {
    revalidate: 60, // Cache valide 60 secondes (augmenté pour améliorer les performances)
    tags: ['stock'],
  }
)

/**
 * Cache pour les alertes de notification
 * Durée de validité : 30 secondes
 */
export const getCachedStockNotifications = unstable_cache(
  async () => {
    const { getProductsNeedingNotification } = await import(
      '../actions/stock-notifications.actions'
    )
    return await getProductsNeedingNotification()
  },
  ['stock-notifications'],
  {
    revalidate: 30, // Cache valide 30 secondes
    tags: ['stock'],
  }
)

/**
 * Cache pour l'historique des mouvements de stock
 * Durée de validité : 60 secondes
 */
export async function getCachedStockHistory(params: {
  page?: number
  limit?: number
  movementType?: string
  productId?: string
}) {
  // Créer une clé de cache unique basée sur les paramètres
  const cacheKey = `stock-history-${params.page || 1}-${params.limit || 50}-${params.movementType || 'all'}-${params.productId || 'all'}`
  
  return unstable_cache(
    async () => {
      const { getAllStockHistory } = await import(
        '../actions/stock-history.actions'
      )
      return await getAllStockHistory(params)
    },
    [cacheKey],
    {
      revalidate: 60, // Cache valide 60 secondes
      tags: ['stock-history'], // Pour invalidation manuelle
    }
  )()
}

/**
 * Cache pour les statistiques de l'historique
 * Durée de validité : 60 secondes
 */
export const getCachedStockHistoryStatistics = unstable_cache(
  async () => {
    const { getStockHistoryStatistics } = await import(
      '../actions/stock-history.actions'
    )
    return await getStockHistoryStatistics()
  },
  ['stock-history-statistics'],
  {
    revalidate: 60, // Cache valide 60 secondes
    tags: ['stock-history'], // Pour invalidation manuelle
  }
)

/**
 * Invalide le cache des stocks manuellement
 * Utile après des mises à jour critiques
 */
export async function invalidateStockCache() {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('stock')
}

/**
 * Invalide le cache de l'historique manuellement
 * Utile après des enregistrements de mouvements
 */
export async function invalidateStockHistoryCache() {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('stock-history')
}

