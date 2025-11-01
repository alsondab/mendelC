'use server'

import { connectToDatabase } from '@/lib/db'
import Product, { IProduct } from '@/lib/db/models/product.model'
import { revalidatePath, revalidateTag } from 'next/cache'
import { formatError } from '../utils'
import { ProductInputSchema, ProductUpdateSchema } from '../validator'
import { IProductInput } from '@/types'
import { z } from 'zod'
import { getSetting } from './setting.actions'
import { calculateStockStatus } from '../utils/stock-utils'

// CREATE
export async function createProduct(data: IProductInput) {
  try {
    const product = ProductInputSchema.parse(data)
    await connectToDatabase()
    await Product.create(product)
    // Invalider tous les caches
    revalidateTag('stock')
    const { invalidateAllProductsCache } = await import('../cache/product-cache')
    invalidateAllProductsCache()
    const { invalidateCategoriesCache } = await import('../cache/category-cache')
    invalidateCategoriesCache()
    const { invalidateAdminProductsCache } = await import('../cache/admin-cache')
    invalidateAdminProductsCache()
    const { invalidateSearchSuggestionsCache } = await import('../cache/search-cache')
    invalidateSearchSuggestionsCache()
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Produit créé avec succès',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// UPDATE
export async function updateProduct(data: z.infer<typeof ProductUpdateSchema>) {
  try {
    const product = ProductUpdateSchema.parse(data)
    await connectToDatabase()

    // Récupérer le produit actuel pour comparer le stock
    const currentProduct = await Product.findById(product._id)
    if (!currentProduct) {
      throw new Error('Produit non trouvé')
    }

    const quantityBefore = currentProduct.countInStock
    const quantityAfter = product.countInStock
    const stockChanged = quantityBefore !== quantityAfter

    // Recalculer le statut de stock avant la mise à jour
    const stockStatusData = calculateStockStatus(
      product.countInStock,
      product.minStockLevel
    )

    // Mettre à jour avec le statut de stock recalculé
    await Product.findByIdAndUpdate(product._id, {
      ...product,
      ...stockStatusData,
      lastStockUpdate: new Date(),
    })

    // Enregistrer dans l'historique si le stock a changé (en arrière-plan)
    if (stockChanged) {
      const { recordStockMovement } = await import('./stock-history.actions')
      const { auth } = await import('@/auth')
      const session = await auth()

      recordStockMovement({
        productId: product._id.toString(),
        productName: currentProduct.name,
        movementType: 'adjustment',
        quantityBefore,
        quantityAfter,
        reason: 'Modification du produit (stock mis à jour)',
        userId: session?.user?.id,
        metadata: {
          action: 'updateProduct',
          oldStock: quantityBefore.toString(),
          newStock: quantityAfter.toString(),
        },
      }).catch((error) => {
        console.error('Erreur lors de l\'enregistrement de l\'historique:', error)
      })
    }

    // Déclencher automatiquement une notification si le stock est faible ou en rupture
    if (
      stockStatusData.stockStatus === 'low_stock' ||
      stockStatusData.stockStatus === 'out_of_stock'
    ) {
      // Importer et déclencher la notification
      const { checkStockAndNotify } = await import(
        './stock-notifications.actions'
      )
      // Vérifier les paramètres de notification
      const { getNotificationSettings } = await import(
        './notification-settings.actions'
      )
      const settingsResult = await getNotificationSettings()
      const emailEnabled =
        settingsResult.success &&
        settingsResult.settings?.emailNotifications !== false

      if (emailEnabled) {
        // Déclencher la vérification et l'envoi en arrière-plan (ne pas bloquer)
        checkStockAndNotify().catch((error) => {
          console.error('Erreur lors de la notification automatique:', error)
        })
      }
    }

    // Invalider tous les caches
    revalidateTag('stock')
    const { invalidateAllProductsCache, invalidateProductCache } = await import(
      '../cache/product-cache'
    )
    invalidateAllProductsCache()
    invalidateProductCache(product._id.toString())
    if (currentProduct.slug) {
      // Invalider aussi par slug
      const { revalidateTag } = await import('next/cache')
      revalidateTag(`product-slug-${currentProduct.slug}`)
      revalidateTag(`product-slug-status-${currentProduct.slug}`)
    }
    const { invalidateAdminProductsCache } = await import('../cache/admin-cache')
    invalidateAdminProductsCache()
    const { invalidateSearchSuggestionsCache } = await import('../cache/search-cache')
    invalidateSearchSuggestionsCache()
    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${product._id}`)
    revalidatePath('/admin/stock')
    revalidatePath(`/product/${currentProduct.slug}`)
    return {
      success: true,
      message: 'Produit mis à jour avec succès',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
// DELETE
export async function deleteProduct(id: string) {
  try {
    await connectToDatabase()
    const res = await Product.findByIdAndDelete(id)
    if (!res) throw new Error('Product not found')
    // Invalider tous les caches
    revalidateTag('stock')
    const { invalidateAllProductsCache, invalidateProductCache } = await import(
      '../cache/product-cache'
    )
    invalidateAllProductsCache()
    invalidateProductCache(id)
    if (res.slug) {
      invalidateProductCache(`slug-${res.slug}`)
    }
    const { invalidateAdminProductsCache } = await import('../cache/admin-cache')
    invalidateAdminProductsCache()
    const { invalidateCategoriesCache } = await import('../cache/category-cache')
    invalidateCategoriesCache()
    const { invalidateSearchSuggestionsCache } = await import('../cache/search-cache')
    invalidateSearchSuggestionsCache()
    revalidatePath('/admin/products')
    revalidatePath('/admin/stock')
    return {
      success: true,
      message: 'Produit supprimé avec succès',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
// GET ONE PRODUCT BY ID
export async function getProductById(productId: string) {
  await connectToDatabase()
  const product = await Product.findById(productId)
  return JSON.parse(JSON.stringify(product)) as IProduct
}

// GET ALL PRODUCTS FOR ADMIN
// Utilise le cache si disponible, sinon requête directe
export async function getAllProductsForAdmin({
  query,
  page = 1,
  sort = 'latest',
  limit,
  useCache = false, // Désactivé par défaut pour éviter les problèmes côté client
}: {
  query: string
  page?: number
  sort?: string
  limit?: number
  useCache?: boolean
}): Promise<{
  products: IProduct[]
  totalPages: number
  totalProducts: number
  from: number
  to: number
}> {
  // Si cache activé et pas de recherche (recherche = pas de cache), utiliser le cache
  // Seulement côté serveur (vérifier si on est dans un contexte serveur)
  if (useCache && (!query || query === '') && typeof window === 'undefined') {
    try {
      const { getCachedAllProductsForAdmin } = await import(
        '../cache/admin-cache'
      )
      return await getCachedAllProductsForAdmin({ query, page, sort, limit })
    } catch (error) {
      // Fallback si cache échoue
      console.error('Cache error, falling back to direct query:', error)
    }
  }

  try {
    // Requête directe (pas de cache ou recherche active)
    await connectToDatabase()

    const {
      common: { pageSize },
    } = await getSetting()
    limit = limit || pageSize
    const queryFilter =
      query && query !== 'all'
        ? {
            name: {
              $regex: query,
              $options: 'i',
            },
          }
        : {}

    const order: Record<string, 1 | -1> =
      sort === 'best-selling'
        ? { numSales: -1 }
        : sort === 'price-low-to-high'
          ? { price: 1 }
          : sort === 'price-high-to-low'
            ? { price: -1 }
            : sort === 'avg-customer-review'
              ? { avgRating: -1 }
              : { _id: -1 }
    const products = await Product.find({
      ...queryFilter,
    })
      .sort(order)
      .skip(limit * (Number(page) - 1))
      .limit(limit)
      .lean()

    const countProducts = await Product.countDocuments({
      ...queryFilter,
    })
    return {
      products: JSON.parse(JSON.stringify(products)) as IProduct[],
      totalPages: Math.ceil(countProducts / pageSize),
      totalProducts: countProducts,
      from: pageSize * (Number(page) - 1) + 1,
      to: pageSize * (Number(page) - 1) + products.length,
    }
  } catch (error) {
    console.error('Error in getAllProductsForAdmin:', error)
    throw error
  }
}

export async function getAllCategories() {
  await connectToDatabase()
  const categories = await Product.find({ isPublished: true }).distinct(
    'category'
  )
  return categories
}

export async function getAllSubCategories() {
  await connectToDatabase()
  const subCategories = await Product.find({
    isPublished: true,
    subCategory: { $exists: true, $ne: null },
  }).distinct('subCategory')
  return subCategories
}

export async function getSubCategoriesByCategory(category: string) {
  await connectToDatabase()
  const subCategories = await Product.find({
    isPublished: true,
    category,
    subCategory: { $exists: true, $ne: null },
  }).distinct('subCategory')
  return subCategories
}
export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string
  limit?: number
}) {
  await connectToDatabase()
  const products = await Product.find(
    { tags: { $in: [tag] }, isPublished: true },
    {
      name: 1,
      href: { $concat: ['/product/', '$slug'] },
      image: { $arrayElemAt: ['$images', 0] },
    }
  )
    .sort({ createdAt: 'desc' })
    .limit(limit)
  return JSON.parse(JSON.stringify(products)) as {
    name: string
    href: string
    image: string
  }[]
}
// GET PRODUCTS BY TAG
export async function getProductsByTag({
  tag,
  limit = 10,
}: {
  tag: string
  limit?: number
}) {
  await connectToDatabase()
  const products = await Product.find({
    tags: { $in: [tag] },
    isPublished: true,
  })
    .sort({ createdAt: 'desc' })
    .limit(limit)
  return JSON.parse(JSON.stringify(products)) as IProduct[]
}

// GET ONE PRODUCT BY SLUG (Published only)
export async function getProductBySlug(slug: string) {
  await connectToDatabase()
  const product = await Product.findOne({ slug, isPublished: true })
  if (!product) {
    throw new Error('Product not found')
  }
  return JSON.parse(JSON.stringify(product)) as IProduct
}

// GET ONE PRODUCT BY SLUG (With publication status)
export async function getProductBySlugWithStatus(slug: string) {
  await connectToDatabase()
  const product = await Product.findOne({ slug })
  if (!product) {
    return { product: null, isPublished: false, exists: false }
  }
  return {
    product: JSON.parse(JSON.stringify(product)) as IProduct,
    isPublished: product.isPublished,
    exists: true,
  }
}
// GET RELATED PRODUCTS: PRODUCTS WITH SAME CATEGORY
export async function getRelatedProductsByCategory({
  category,
  productId,
  limit = 4,
  page = 1,
}: {
  category: string
  productId: string
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  await connectToDatabase()
  const skipAmount = (Number(page) - 1) * limit
  const conditions = {
    isPublished: true,
    category,
    _id: { $ne: productId },
  }
  const products = await Product.find(conditions)
    .sort({ numSales: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const productsCount = await Product.countDocuments(conditions)
  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(productsCount / limit),
  }
}

// GET ALL PRODUCTS
export async function getAllProducts({
  query,
  limit,
  page,
  category,
  subCategory,
  tag,
  price,
  rating,
  sort,
}: {
  query: string
  category: string
  subCategory?: string
  tag: string
  limit?: number
  page: number
  price?: string
  rating?: string
  sort?: string
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  await connectToDatabase()

  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            $regex: query,
            $options: 'i',
          },
        }
      : {}
  const categoryFilter = category && category !== 'all' ? { category } : {}
  const subCategoryFilter =
    subCategory && subCategory !== 'all' ? { subCategory } : {}
  const tagFilter = tag && tag !== 'all' ? { tags: tag } : {}

  const ratingFilter =
    rating && rating !== 'all'
      ? {
          avgRating: {
            $gte: Number(rating),
          },
        }
      : {}
  // 10-50
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {}
  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? { numSales: -1 }
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 }
  const isPublished = { isPublished: true }
  const products = await Product.find({
    ...isPublished,
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...subCategoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(order)
    .skip(limit * (Number(page) - 1))
    .limit(limit)
    .lean()

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...subCategoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / limit),
    totalProducts: countProducts,
    from: limit * (Number(page) - 1) + 1,
    to: limit * (Number(page) - 1) + products.length,
  }
}

export async function getAllTags() {
  const tags = await Product.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: null, uniqueTags: { $addToSet: '$tags' } } },
    { $project: { _id: 0, uniqueTags: 1 } },
  ])
  return (
    (tags[0]?.uniqueTags
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((x: string) =>
        x
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      ) as string[]) || []
  )
}

export const getProductsByCategory = async ({
  category,
  limit = 10,
}: {
  category: string
  limit?: number
}) => {
  try {
    await connectToDatabase()

    const products = await Product.find({
      category: category,
      isPublished: true,
    })
      .limit(limit)
      .select('name images slug price')
      .sort({ createdAt: -1 })

    return products
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}
