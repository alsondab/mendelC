import { connectToDatabase } from '@/lib/db/mongodb'
import Category, { ICategory } from '@/lib/db/models/category.model'
import { toSlug } from '@/lib/utils'

// Créer une nouvelle catégorie
export async function createCategory({
  name,
  description,
  image,
  parent,
  sortOrder = 0,
}: {
  name: string
  description?: string
  image?: string
  parent?: string
  sortOrder?: number
}) {
  await connectToDatabase()

  const slug = toSlug(name)
  
  // Vérifier si le slug existe déjà
  const existingCategory = await Category.findOne({ slug })
  if (existingCategory) {
    throw new Error(`Une catégorie avec le nom "${name}" existe déjà`)
  }

  const category = new Category({
    name,
    slug,
    description,
    image,
    parent: parent || null,
    sortOrder,
  })

  await category.save()

  // Si c'est une sous-catégorie, ajouter à la liste des enfants du parent
  if (parent) {
    await Category.findByIdAndUpdate(parent, {
      $addToSet: { children: category._id }
    })
  }

  return category
}

// Obtenir toutes les catégories principales (niveau 0)
export async function getMainCategories() {
  await connectToDatabase()
  
  return await Category.find({ 
    level: 0, 
    isActive: true 
  })
  .sort({ sortOrder: 1, name: 1 })
  .populate('children', 'name slug image isActive')
}

// Obtenir toutes les catégories avec hiérarchie
export async function getAllCategoriesWithHierarchy() {
  await connectToDatabase()
  
  return await Category.find({ isActive: true })
    .sort({ level: 1, sortOrder: 1, name: 1 })
    .populate('parent', 'name slug')
    .populate('children', 'name slug image isActive')
}

// Obtenir les sous-catégories d'une catégorie parent
export async function getSubCategories(parentId: string) {
  await connectToDatabase()
  
  return await Category.find({ 
    parent: parentId, 
    isActive: true 
  })
  .sort({ sortOrder: 1, name: 1 })
  .populate('children', 'name slug image isActive')
}

// Obtenir une catégorie par son slug
export async function getCategoryBySlug(slug: string) {
  await connectToDatabase()
  
  return await Category.findOne({ 
    slug, 
    isActive: true 
  })
  .populate('parent', 'name slug')
  .populate('children', 'name slug image isActive')
}

// Obtenir le chemin complet d'une catégorie (breadcrumb)
export async function getCategoryPath(categoryId: string): Promise<ICategory[]> {
  await connectToDatabase()
  
  const path: ICategory[] = []
  let current = await Category.findById(categoryId).populate('parent')
  
  while (current) {
    path.unshift(current)
    if (current.parent) {
      current = await Category.findById(current.parent).populate('parent')
    } else {
      break
    }
  }
  
  return path
}

// Mettre à jour une catégorie
export async function updateCategory(
  categoryId: string,
  updates: Partial<ICategory>
) {
  await connectToDatabase()
  
  const category = await Category.findByIdAndUpdate(
    categoryId,
    { ...updates, slug: updates.name ? toSlug(updates.name) : undefined },
    { new: true, runValidators: true }
  )
  
  if (!category) {
    throw new Error('Catégorie non trouvée')
  }
  
  return category
}

// Supprimer une catégorie (soft delete)
export async function deleteCategory(categoryId: string) {
  await connectToDatabase()
  
  const category = await Category.findById(categoryId)
  if (!category) {
    throw new Error('Catégorie non trouvée')
  }
  
  // Vérifier s'il y a des sous-catégories actives
  const hasActiveChildren = await Category.findOne({
    parent: categoryId,
    isActive: true
  })
  
  if (hasActiveChildren) {
    throw new Error('Impossible de supprimer une catégorie qui a des sous-catégories actives')
  }
  
  // Soft delete
  category.isActive = false
  await category.save()
  
  // Retirer de la liste des enfants du parent
  if (category.parent) {
    await Category.findByIdAndUpdate(category.parent, {
      $pull: { children: categoryId }
    })
  }
  
  return category
}

// Obtenir toutes les catégories (pour compatibilité avec l'ancien système)
export async function getAllCategories(): Promise<string[]> {
  await connectToDatabase()
  
  const categories = await Category.find({ 
    isActive: true,
    level: 0 // Seulement les catégories principales pour l'instant
  })
  .sort({ sortOrder: 1, name: 1 })
  
  return categories.map(cat => cat.name)
}

// Rechercher des catégories
export async function searchCategories(query: string) {
  await connectToDatabase()
  
  return await Category.find({
    isActive: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  })
  .sort({ level: 1, sortOrder: 1, name: 1 })
  .populate('parent', 'name slug')
}
