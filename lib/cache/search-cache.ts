import { unstable_cache } from 'next/cache'

/**
 * Cache pour les suggestions de recherche
 * Durée de validité : 120 secondes (2 minutes)
 * Les suggestions changent peu fréquemment pour une même requête
 */
export async function getCachedSearchSuggestions(query: string) {
  // Ne pas cacher si la requête est trop courte
  if (!query || query.length < 2) {
    return { suggestions: [] }
  }

  // Normaliser la requête (lowercase, trim) pour le cache
  const normalizedQuery = query.toLowerCase().trim()

  // Clé de cache basée sur la requête normalisée
  const cacheKey = `search-suggestions-${normalizedQuery}`

  return unstable_cache(
    async () => {
      const { connectToDatabase } = await import('../db')
      const Product = (await import('../db/models/product.model')).default
      const Category = (await import('../db/models/category.model')).default

      await connectToDatabase()

      // Rechercher dans les produits
      const products = await Product.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { brand: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { subCategory: { $regex: query, $options: 'i' } },
        ],
        isPublished: true,
      })
        .select('name brand category subCategory')
        .limit(10)
        .lean()

      // Rechercher dans les catégories
      const categories = await Category.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      })
        .select('name')
        .limit(5)
        .lean()

      // Rechercher dans les sous-catégories
      const subCategories = await Category.find({
        'subCategories.name': { $regex: query, $options: 'i' },
      })
        .select('name subCategories')
        .limit(5)
        .lean()

      // Formater les suggestions
      const suggestions: Array<{
        type: 'product' | 'category' | 'subcategory'
        text: string
        category?: string
        brand?: string
        subCategory?: string
      }> = []

      // Ajouter les produits
      products.forEach((product) => {
        suggestions.push({
          type: 'product',
          text: product.name,
          category: product.category,
          brand: product.brand,
          subCategory: product.subCategory,
        })
      })

      // Ajouter les catégories
      categories.forEach((category) => {
        suggestions.push({
          type: 'category',
          text: category.name,
          category: category.name,
        })
      })

      // Ajouter les sous-catégories
      subCategories.forEach((category) => {
        const categoryWithSubs = category as {
          name: string
          subCategories?: Array<{ name: string }>
        }
        if (
          categoryWithSubs.subCategories &&
          Array.isArray(categoryWithSubs.subCategories)
        ) {
          categoryWithSubs.subCategories.forEach((subCategory) => {
            if (
              subCategory.name &&
              subCategory.name.toLowerCase().includes(query.toLowerCase())
            ) {
              suggestions.push({
                type: 'subcategory',
                text: subCategory.name,
                category: categoryWithSubs.name,
                subCategory: subCategory.name,
              })
            }
          })
        }
      })

      // Dédupliquer et limiter
      const uniqueSuggestions = suggestions
        .filter(
          (suggestion, index, self) =>
            index === self.findIndex((s) => s.text === suggestion.text)
        )
        .slice(0, 8)

      return {
        suggestions: uniqueSuggestions,
        total: uniqueSuggestions.length,
      }
    },
    [cacheKey],
    {
      revalidate: 120, // Cache valide 2 minutes
      tags: ['search-suggestions', 'products', 'categories'],
    }
  )()
}

/**
 * Invalide le cache des suggestions de recherche
 * Utile après des mises à jour de produits ou catégories
 */
export async function invalidateSearchSuggestionsCache() {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('search-suggestions')
}

/**
 * Invalide le cache des suggestions pour une requête spécifique
 */
export async function invalidateSearchSuggestionsForQuery(_query: string) {
  // Pour une requête spécifique, on invalide tout le cache
  // car les suggestions peuvent se chevaucher
  void _query // Marquer comme utilisé pour éviter l'erreur ESLint
  await invalidateSearchSuggestionsCache()
}
