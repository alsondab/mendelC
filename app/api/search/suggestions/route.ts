import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/db/models/product.model'
import Category from '@/lib/db/models/category.model'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

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

    // Rechercher dans les catégories
    const categories = await Category.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    })
      .select('name')
      .limit(5)

    // Rechercher dans les sous-catégories
    const subCategories = await Category.find({
      'subCategories.name': { $regex: query, $options: 'i' },
    })
      .select('name subCategories')
      .limit(5)

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

    return NextResponse.json({
      suggestions: uniqueSuggestions,
      total: uniqueSuggestions.length,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
