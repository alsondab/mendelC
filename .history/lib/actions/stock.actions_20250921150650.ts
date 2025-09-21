'use server'

import { connectToDatabase } from '../db'
import Product from '../db/models/product.model'
import { formatError } from '../utils'
import { revalidatePath } from 'next/cache'

// 🚀 ACTIONS POUR LA GESTION DES STOCKS

/**
 * Met à jour le stock d'un produit
 */
export async function updateProductStock({
  productId,
  quantity,
  operation = 'set', // 'set', 'add', 'subtract'
  reason = 'Manual adjustment'
}: {
  productId: string
  quantity: number
  operation?: 'set' | 'add' | 'subtract'
  reason?: string
}) {
  try {
    await connectToDatabase()
    
    const product = await Product.findById(productId)
    if (!product) {
      throw new Error('Produit non trouvé')
    }

    let newQuantity = product.countInStock
    
    switch (operation) {
      case 'set':
        newQuantity = quantity
        break
      case 'add':
        newQuantity = product.countInStock + quantity
        break
      case 'subtract':
        newQuantity = Math.max(0, product.countInStock - quantity)
        break
    }

    product.countInStock = newQuantity
    product.updateStockStatus() // Met à jour automatiquement le statut
    
    await product.save()
    
    revalidatePath('/admin/products')
    revalidatePath(`/product/${product.slug}`)
    
    return {
      success: true,
      message: `Stock mis à jour: ${newQuantity} unités`,
      product: {
        id: product._id,
        name: product.name,
        countInStock: product.countInStock,
        stockStatus: product.stockStatus,
        isLowStock: product.isLowStock,
        isOutOfStock: product.isOutOfStock
      }
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Récupère tous les produits avec un stock faible
 */
export async function getLowStockProducts() {
  try {
    await connectToDatabase()
    
    const products = await Product.find({
      isLowStock: true,
      isPublished: true
    }).select('name slug countInStock minStockLevel stockStatus lastStockUpdate')
    
    return {
      success: true,
      products: products.map(product => ({
        id: product._id,
        name: product.name,
        slug: product.slug,
        countInStock: product.countInStock,
        minStockLevel: product.minStockLevel,
        stockStatus: product.stockStatus,
        lastStockUpdate: product.lastStockUpdate
      }))
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Récupère tous les produits en rupture de stock
 */
export async function getOutOfStockProducts() {
  try {
    await connectToDatabase()
    
    const products = await Product.find({
      isOutOfStock: true,
      isPublished: true
    }).select('name slug countInStock stockStatus lastStockUpdate')
    
    return {
      success: true,
      products: products.map(product => ({
        id: product._id,
        name: product.name,
        slug: product.slug,
        countInStock: product.countInStock,
        stockStatus: product.stockStatus,
        lastStockUpdate: product.lastStockUpdate
      }))
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Met à jour les seuils de stock d'un produit
 */
export async function updateStockThresholds({
  productId,
  minStockLevel,
  maxStockLevel
}: {
  productId: string
  minStockLevel: number
  maxStockLevel: number
}) {
  try {
    await connectToDatabase()
    
    if (minStockLevel < 0) {
      throw new Error('Le seuil minimum ne peut pas être négatif')
    }
    
    if (maxStockLevel <= minStockLevel) {
      throw new Error('Le seuil maximum doit être supérieur au seuil minimum')
    }
    
    const product = await Product.findById(productId)
    if (!product) {
      throw new Error('Produit non trouvé')
    }
    
    product.minStockLevel = minStockLevel
    product.maxStockLevel = maxStockLevel
    product.updateStockStatus() // Recalcule le statut avec les nouveaux seuils
    
    await product.save()
    
    revalidatePath('/admin/products')
    revalidatePath(`/product/${product.slug}`)
    
    return {
      success: true,
      message: 'Seuils de stock mis à jour avec succès',
      product: {
        id: product._id,
        name: product.name,
        minStockLevel: product.minStockLevel,
        maxStockLevel: product.maxStockLevel,
        stockStatus: product.stockStatus
      }
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Récupère les statistiques de stock
 */
export async function getStockStatistics() {
  try {
    await connectToDatabase()
    
    const totalProducts = await Product.countDocuments({ isPublished: true })
    const inStockProducts = await Product.countDocuments({ 
      stockStatus: 'in_stock',
      isPublished: true 
    })
    const lowStockProducts = await Product.countDocuments({ 
      stockStatus: 'low_stock',
      isPublished: true 
    })
    const outOfStockProducts = await Product.countDocuments({ 
      stockStatus: 'out_of_stock',
      isPublished: true 
    })
    
    // Calculer la valeur totale du stock
    const products = await Product.find({ isPublished: true })
    const totalStockValue = products.reduce((sum, product) => {
      return sum + (product.countInStock * product.price)
    }, 0)
    
    return {
      success: true,
      statistics: {
        totalProducts,
        inStockProducts,
        lowStockProducts,
        outOfStockProducts,
        totalStockValue: Math.round(totalStockValue * 100) / 100
      }
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Met à jour le statut de stock de tous les produits
 */
export async function updateAllStockStatus() {
  try {
    await connectToDatabase()
    
    const products = await Product.find({ isPublished: true })
    let updatedCount = 0
    
    for (const product of products) {
      const oldStatus = product.stockStatus
      product.updateStockStatus()
      
      if (oldStatus !== product.stockStatus) {
        await product.save()
        updatedCount++
      }
    }
    
    revalidatePath('/admin/products')
    
    return {
      success: true,
      message: `${updatedCount} produits mis à jour`,
      updatedCount
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
