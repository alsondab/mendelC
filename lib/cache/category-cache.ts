import { unstable_cache } from 'next/cache'

/**
 * Cache pour l'arbre des catégories
 * Durée de validité : 300 secondes (5 minutes) - les catégories changent rarement
 */
export const getCachedCategoryTree = unstable_cache(
  async () => {
    const { getCategoryTree } = await import('../actions/category.actions')
    return await getCategoryTree()
  },
  ['category-tree'],
  {
    revalidate: 300, // 5 minutes
    tags: ['categories'],
  }
)

/**
 * Cache pour toutes les catégories
 * Durée de validité : 300 secondes
 */
export const getCachedAllCategories = unstable_cache(
  async () => {
    const { getAllCategories } = await import('../actions/product.actions')
    return await getAllCategories()
  },
  ['all-categories'],
  {
    revalidate: 300,
    tags: ['categories'],
  }
)

/**
 * Cache pour les sous-catégories
 * Durée de validité : 300 secondes
 */
export const getCachedAllSubCategories = unstable_cache(
  async () => {
    const { getAllSubCategories } = await import('../actions/product.actions')
    return await getAllSubCategories()
  },
  ['all-subcategories'],
  {
    revalidate: 300,
    tags: ['categories'],
  }
)

/**
 * Cache pour les sous-catégories d'une catégorie
 * Durée de validité : 300 secondes
 */
export async function getCachedSubCategoriesByCategory(category: string) {
  return unstable_cache(
    async () => {
      const { getSubCategoriesByCategory } = await import(
        '../actions/product.actions'
      )
      return await getSubCategoriesByCategory(category)
    },
    [`subcategories-${category}`],
    {
      revalidate: 300,
      tags: ['categories', `category-${category}`],
    }
  )()
}

/**
 * Invalide le cache des catégories
 */
export async function invalidateCategoriesCache() {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('categories')
}

/**
 * Invalide le cache d'une catégorie spécifique
 */
export async function invalidateCategoryCache(category: string) {
  const { revalidateTag } = await import('next/cache')
  revalidateTag(`category-${category}`)
}
