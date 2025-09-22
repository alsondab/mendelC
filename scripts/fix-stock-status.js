/**
 * Script pour corriger les statuts de stock
 * Usage: node scripts/fix-stock-status.js
 */

const mongoose = require('mongoose')

// Configuration de la base de données
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/nextjs-amazona'

// Schéma simplifié pour le produit
const productSchema = new mongoose.Schema({
  name: String,
  countInStock: Number,
  minStockLevel: Number,
  stockStatus: String,
  isLowStock: Boolean,
  isOutOfStock: Boolean,
  lastStockUpdate: Date,
})

const Product = mongoose.model('Product', productSchema)

// Fonction pour calculer le statut de stock
function calculateStockStatus(countInStock, minStockLevel) {
  if (countInStock <= 0) {
    return {
      stockStatus: 'out_of_stock',
      isOutOfStock: true,
      isLowStock: false,
    }
  } else if (countInStock <= minStockLevel) {
    return {
      stockStatus: 'low_stock',
      isLowStock: true,
      isOutOfStock: false,
    }
  } else {
    return {
      stockStatus: 'in_stock',
      isLowStock: false,
      isOutOfStock: false,
    }
  }
}

async function fixStockStatus() {
  try {
    console.log('🔧 Connexion à la base de données...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connecté à MongoDB')

    console.log('🔍 Recherche des produits...')
    const products = await Product.find({ isPublished: true })
    console.log(`📦 ${products.length} produits trouvés`)

    let fixedCount = 0

    for (const product of products) {
      const oldStatus = product.stockStatus
      const stockStatusData = calculateStockStatus(
        product.countInStock,
        product.minStockLevel
      )

      // Vérifier si le statut doit être corrigé
      if (product.stockStatus !== stockStatusData.stockStatus) {
        console.log(`🔧 Correction du produit: ${product.name}`)
        console.log(
          `   Stock: ${product.countInStock}, Seuil: ${product.minStockLevel}`
        )
        console.log(
          `   Ancien statut: ${oldStatus} → Nouveau statut: ${stockStatusData.stockStatus}`
        )

        product.stockStatus = stockStatusData.stockStatus
        product.isLowStock = stockStatusData.isLowStock
        product.isOutOfStock = stockStatusData.isOutOfStock
        product.lastStockUpdate = new Date()

        await product.save()
        fixedCount++
      }
    }

    console.log(`✅ ${fixedCount} produits corrigés`)
    console.log('🎉 Script terminé avec succès!')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Déconnecté de MongoDB')
  }
}

// Exécuter le script
fixStockStatus()
