'use server'

import { connectToDatabase } from '@/lib/db'
import Category, { ICategory } from '@/lib/db/models/category.model'
import { revalidatePath } from 'next/cache'
import { formatError } from '../utils'
import { CategoryInputSchema, CategoryUpdateSchema } from '../validator'
import { ICategoryInput } from '@/types'
import { z } from 'zod'

// CREATE
export async function createCategory(data: ICategoryInput) {
  try {
    const category = CategoryInputSchema.parse(data)
    await connectToDatabase()

    // Nettoyer les données pour MongoDB
    const cleanData = {
      ...category,
      parentCategory:
        category.parentCategory && category.parentCategory.trim() !== ''
          ? category.parentCategory
          : undefined,
    }

    await Category.create(cleanData)
    // Invalider tous les caches liés aux catégories
    const { invalidateCategoriesCache } = await import('../cache/category-cache')
    invalidateCategoriesCache()
    const { invalidateAdminCategoriesCache } = await import('../cache/admin-cache')
    invalidateAdminCategoriesCache()
    const { invalidateSearchSuggestionsCache } = await import('../cache/search-cache')
    invalidateSearchSuggestionsCache()
    revalidatePath('/admin/categories')
    return {
      success: true,
      message: 'Catégorie créée avec succès',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// UPDATE
export async function updateCategory(
  data: z.infer<typeof CategoryUpdateSchema>
) {
  try {
    const category = CategoryUpdateSchema.parse(data)
    await connectToDatabase()

    // Nettoyer les données pour MongoDB
    const cleanData = {
      ...category,
      parentCategory:
        category.parentCategory && category.parentCategory.trim() !== ''
          ? category.parentCategory
          : undefined,
    }

    await Category.findByIdAndUpdate(category._id, cleanData)
    // Invalider tous les caches liés aux catégories
    const { invalidateCategoriesCache, invalidateCategoryCache } = await import(
      '../cache/category-cache'
    )
    invalidateCategoriesCache()
    invalidateCategoryCache(category.name)
    const { invalidateAdminCategoriesCache } = await import('../cache/admin-cache')
    invalidateAdminCategoriesCache()
    const { invalidateAllProductsCache } = await import('../cache/product-cache')
    invalidateAllProductsCache() // Les produits peuvent être affectés par le changement de catégorie
    const { invalidateSearchSuggestionsCache } = await import('../cache/search-cache')
    invalidateSearchSuggestionsCache()
    revalidatePath('/admin/categories')
    return {
      success: true,
      message: 'Catégorie mise à jour avec succès',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// DELETE
export async function deleteCategory(id: string) {
  try {
    await connectToDatabase()
    const res = await Category.findByIdAndDelete(id)
    if (!res) throw new Error('Category not found')
    // Invalider tous les caches liés aux catégories
    const { invalidateCategoriesCache, invalidateCategoryCache } = await import(
      '../cache/category-cache'
    )
    invalidateCategoriesCache()
    if (res.name) {
      invalidateCategoryCache(res.name)
    }
    const { invalidateAdminCategoriesCache } = await import('../cache/admin-cache')
    invalidateAdminCategoriesCache()
    const { invalidateAllProductsCache } = await import('../cache/product-cache')
    invalidateAllProductsCache() // Les produits peuvent être affectés
    const { invalidateSearchSuggestionsCache } = await import('../cache/search-cache')
    invalidateSearchSuggestionsCache()
    revalidatePath('/admin/categories')
    return {
      success: true,
      message: 'Catégorie supprimée avec succès',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// GET ONE CATEGORY BY ID
export async function getCategoryById(categoryId: string) {
  await connectToDatabase()
  const category = await Category.findById(categoryId)
  return JSON.parse(JSON.stringify(category)) as ICategory
}

// GET ALL CATEGORIES FOR ADMIN
export async function getAllCategoriesForAdmin({
  query,
  page = 1,
  sort = 'name',
  limit,
  useCache = false, // Désactivé par défaut pour éviter les problèmes côté client
}: {
  query: string
  page?: number
  sort?: string
  limit?: number
  useCache?: boolean
}): Promise<{
  categories: ICategory[]
  totalPages: number
  totalCategories: number
  from: number
  to: number
}> {
  // Utiliser le cache si activé et pas de recherche et côté serveur uniquement
  if (useCache && (!query || query === '') && typeof window === 'undefined') {
    try {
      const { getCachedAllCategoriesForAdmin } = await import(
        '../cache/admin-cache'
      )
      return await getCachedAllCategoriesForAdmin({ query, page, limit })
    } catch (error) {
      // Fallback si cache échoue
      console.error('Cache error, falling back to direct query:', error)
    }
  }

  try {
    // Requête directe (pas de cache ou recherche active)
    await connectToDatabase()

    limit = limit || 20
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
      sort === 'name'
        ? { name: 1 }
        : sort === 'sortOrder'
          ? { sortOrder: 1 }
          : { createdAt: -1 }

    const categories = await Category.find({
      ...queryFilter,
    })
      .populate('parentCategory', 'name slug')
      .sort(order)
      .skip(limit * (Number(page) - 1))
      .limit(limit)
      .lean()

    const countCategories = await Category.countDocuments({
      ...queryFilter,
    })

    return {
      categories: JSON.parse(JSON.stringify(categories)) as ICategory[],
      totalPages: Math.ceil(countCategories / limit),
      totalCategories: countCategories,
      from: limit * (Number(page) - 1) + 1,
      to: limit * (Number(page) - 1) + categories.length,
    }
  } catch (error) {
    console.error('Error in getAllCategoriesForAdmin:', error)
    throw error
  }
}

// GET ALL MAIN CATEGORIES (without parent)
export async function getAllMainCategories() {
  await connectToDatabase()
  const categories = await Category.find({
    parentCategory: null,
    isActive: true,
  })
    .sort({ sortOrder: 1, name: 1 })
    .lean()
  return JSON.parse(JSON.stringify(categories)) as ICategory[]
}

// GET SUBCATEGORIES BY PARENT
export async function getSubCategoriesByParent(parentId: string) {
  await connectToDatabase()
  const subCategories = await Category.find({
    parentCategory: parentId,
    isActive: true,
  })
    .sort({ sortOrder: 1, name: 1 })
    .lean()
  return JSON.parse(JSON.stringify(subCategories)) as ICategory[]
}

// GET ALL CATEGORIES WITH SUBCATEGORIES (for frontend)
export async function getAllCategoriesWithSubCategories() {
  await connectToDatabase()

  // Get main categories
  const mainCategories = await Category.find({
    parentCategory: null,
    isActive: true,
  })
    .sort({ sortOrder: 1, name: 1 })
    .lean()

  // Get all subcategories
  const subCategories = await Category.find({
    parentCategory: { $ne: null },
    isActive: true,
  })
    .sort({ sortOrder: 1, name: 1 })
    .lean()

  // Group subcategories by parent
  const subCategoriesByParent = subCategories.reduce(
    (acc, sub) => {
      const parentId = sub.parentCategory?.toString()
      if (parentId && !acc[parentId]) {
        acc[parentId] = []
      }
      if (parentId) {
        acc[parentId].push(sub)
      }
      return acc
    },
    {} as Record<string, ICategory[]>
  )

  // Combine main categories with their subcategories
  const categoriesWithSubs = mainCategories.map((category) => ({
    ...category,
    subCategories: subCategoriesByParent[category._id.toString()] || [],
  }))

  return JSON.parse(JSON.stringify(categoriesWithSubs)) as (ICategory & {
    subCategories: ICategory[]
  })[]
}

// GET CATEGORY BY SLUG
export async function getCategoryBySlug(slug: string) {
  await connectToDatabase()
  const category = await Category.findOne({ slug, isActive: true })
  if (!category) {
    throw new Error('Category not found')
  }
  return JSON.parse(JSON.stringify(category)) as ICategory
}

// GET CATEGORY TREE (for navigation)
export async function getCategoryTree() {
  await connectToDatabase()

  const categories = await Category.find({
    isActive: true,
  })
    .sort({ sortOrder: 1, name: 1 })
    .lean()

  // Build tree structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryMap = new Map<string, any>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootCategories: any[] = []

  // First pass: create map of all categories
  categories.forEach((category) => {
    categoryMap.set(category._id.toString(), {
      ...category,
      subCategories: [],
    })
  })

  // Second pass: build tree
  categories.forEach((category) => {
    const categoryObj = categoryMap.get(category._id.toString())

    if (category.parentCategory) {
      const parent = categoryMap.get(category.parentCategory.toString())
      if (parent) {
        parent.subCategories.push(categoryObj)
      }
    } else {
      rootCategories.push(categoryObj)
    }
  })

  return JSON.parse(JSON.stringify(rootCategories)) as (ICategory & {
    subCategories: ICategory[]
  })[]
}
