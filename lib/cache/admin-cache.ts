import { unstable_cache } from 'next/cache'

/**
 * Cache pour la liste des produits admin (avec recherche)
 * Durée de validité : 30 secondes (admin a besoin de données récentes)
 */
export async function getCachedAllProductsForAdmin(params: {
  query: string
  page?: number
  sort?: string
  limit?: number
}) {
  const cacheKey = `admin-products-${params.query || 'all'}-${params.page || 1}-${params.sort || 'latest'}`
  
  return unstable_cache(
    async () => {
      const { getAllProductsForAdmin } = await import(
        '../actions/product.actions'
      )
      return await getAllProductsForAdmin(params)
    },
    [cacheKey],
    {
      revalidate: 30,
      tags: ['admin-products', 'products'],
    }
  )()
}

/**
 * Cache pour la liste des commandes admin
 * Durée de validité : 30 secondes
 */
export async function getCachedAllOrders(params: {
  limit?: number
  page: number
}) {
  const cacheKey = `admin-orders-${params.page || 1}-${params.limit || 20}`
  
  return unstable_cache(
    async () => {
      const { getAllOrders } = await import('../actions/order.actions')
      return await getAllOrders(params)
    },
    [cacheKey],
    {
      revalidate: 30,
      tags: ['admin-orders'],
    }
  )()
}

/**
 * Cache pour la liste des catégories admin
 * Durée de validité : 60 secondes
 */
export async function getCachedAllCategoriesForAdmin(params: {
  page?: number
  limit?: number
  query?: string
}) {
  const cacheKey = `admin-categories-${params.query || 'all'}-${params.page || 1}`
  
  return unstable_cache(
    async () => {
      const { getAllCategoriesForAdmin } = await import(
        '../actions/category.actions'
      )
      return await getAllCategoriesForAdmin({
        query: params.query || '',
        page: params.page,
        limit: params.limit,
      })
    },
    [cacheKey],
    {
      revalidate: 60,
      tags: ['admin-categories', 'categories'],
    }
  )()
}

/**
 * Invalide le cache admin (produits)
 */
export async function invalidateAdminProductsCache() {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('admin-products')
}

/**
 * Invalide le cache admin (commandes)
 */
export async function invalidateAdminOrdersCache() {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('admin-orders')
}

/**
 * Cache pour la liste des utilisateurs admin
 * Durée de validité : 30 secondes
 */
export async function getCachedAllUsers(params: {
  limit?: number
  page: number
}) {
  const cacheKey = `admin-users-${params.page || 1}-${params.limit || 20}`
  
  return unstable_cache(
    async () => {
      const { getAllUsers } = await import('../actions/user.actions')
      return await getAllUsers(params)
    },
    [cacheKey],
    {
      revalidate: 30,
      tags: ['admin-users'],
    }
  )()
}

/**
 * Invalide le cache admin (catégories)
 */
export async function invalidateAdminCategoriesCache() {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('admin-categories')
}

/**
 * Invalide le cache admin (utilisateurs)
 */
export async function invalidateAdminUsersCache() {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('admin-users')
}


