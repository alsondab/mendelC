import { unstable_cache } from 'next/cache'

/**
 * Cache pour les produits par tag (page d'accueil)
 * Durée de validité : 60 secondes
 */
export async function getCachedProductsByTag(params: {
  tag: string
  limit?: number
}) {
  const cacheKey = `products-by-tag-${params.tag}-${params.limit || 10}`
  
  return unstable_cache(
    async () => {
      const { getProductsByTag } = await import('../actions/product.actions')
      return await getProductsByTag(params)
    },
    [cacheKey],
    {
      revalidate: 60,
      tags: ['products'],
    }
  )()
}

/**
 * Cache pour les produits de carte (sliders page d'accueil)
 * Durée de validité : 60 secondes
 */
export async function getCachedProductsForCard(params: {
  tag: string
  limit?: number
}) {
  const cacheKey = `products-for-card-${params.tag}-${params.limit || 4}`
  
  return unstable_cache(
    async () => {
      const { getProductsForCard } = await import('../actions/product.actions')
      return await getProductsForCard(params)
    },
    [cacheKey],
    {
      revalidate: 60,
      tags: ['products'],
    }
  )()
}

/**
 * Cache pour un produit par ID
 * Durée de validité : 120 secondes (produits changent moins souvent)
 */
export async function getCachedProductById(productId: string) {
  return unstable_cache(
    async () => {
      const { getProductById } = await import('../actions/product.actions')
      return await getProductById(productId)
    },
    [`product-${productId}`],
    {
      revalidate: 120,
      tags: ['products', `product-${productId}`],
    }
  )()
}

/**
 * Cache pour un produit par slug
 * Durée de validité : 120 secondes
 */
export async function getCachedProductBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const { getProductBySlug } = await import('../actions/product.actions')
      return await getProductBySlug(slug)
    },
    [`product-slug-${slug}`],
    {
      revalidate: 120,
      tags: ['products', `product-slug-${slug}`],
    }
  )()
}

/**
 * Cache pour un produit par slug avec statut de publication
 * Durée de validité : 120 secondes
 */
export async function getCachedProductBySlugWithStatus(slug: string) {
  return unstable_cache(
    async () => {
      const { getProductBySlugWithStatus } = await import(
        '../actions/product.actions'
      )
      return await getProductBySlugWithStatus(slug)
    },
    [`product-slug-status-${slug}`],
    {
      revalidate: 120,
      tags: ['products', `product-slug-${slug}`],
    }
  )()
}

/**
 * Cache pour les produits similaires
 * Durée de validité : 60 secondes
 */
export async function getCachedRelatedProducts(params: {
  category: string
  productId: string
  limit?: number
  page?: number
}) {
  const cacheKey = `related-products-${params.category}-${params.productId}-${params.limit || 4}`
  
  return unstable_cache(
    async () => {
      const { getRelatedProductsByCategory } = await import(
        '../actions/product.actions'
      )
      return await getRelatedProductsByCategory({
        category: params.category,
        productId: params.productId,
        limit: params.limit,
        page: params.page || 1,
      })
    },
    [cacheKey],
    {
      revalidate: 60,
      tags: ['products', `product-${params.productId}`],
    }
  )()
}

/**
 * Invalide le cache d'un produit spécifique (par ID ou slug)
 */
export async function invalidateProductCache(productIdOrSlug: string) {
  const { revalidateTag } = await import('next/cache')
  // Si c'est un slug (commence par "slug-"), invalider les tags appropriés
  if (productIdOrSlug.startsWith('slug-')) {
    const slug = productIdOrSlug.replace('slug-', '')
    revalidateTag(`product-slug-${slug}`)
    revalidateTag(`product-slug-status-${slug}`)
  } else {
    // C'est un ID
    revalidateTag(`product-${productIdOrSlug}`)
  }
}

/**
 * Invalide le cache de tous les produits
 */
export async function invalidateAllProductsCache() {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('products')
}

