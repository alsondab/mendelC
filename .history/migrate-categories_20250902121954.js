const { MongoClient } = require('mongodb')
const mongoose = require('mongoose')

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextjs-amazona'

// Fonction pour créer un slug
function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

// Schéma Category
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, trim: true },
  image: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  level: { type: Number, required: true, default: 0, min: 0, max: 3 },
  isActive: { type: Boolean, required: true, default: true },
  sortOrder: { type: Number, required: true, default: 0 },
}, { timestamps: true })

// Index
categorySchema.index({ parent: 1, isActive: 1 })
categorySchema.index({ level: 1, isActive: 1 })
categorySchema.index({ slug: 1 })

const Category = mongoose.model('Category', categorySchema)

// Schéma Product (simplifié pour la migration)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true }, // Ancien format
  categoryName: { type: String, required: false }, // Nouveau champ
  // ... autres champs
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

async function migrateCategories() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('🚀 Connexion à la base de données établie')
    console.log('🚀 Début de la migration des catégories...')

    // 1. Récupérer toutes les catégories uniques des produits
    const uniqueCategories = await Product.distinct('category')
    console.log(`📋 ${uniqueCategories.length} catégories trouvées:`, uniqueCategories)

    // 2. Créer les catégories principales
    const createdCategories = new Map() // name -> ObjectId

    for (const categoryName of uniqueCategories) {
      if (!categoryName) continue

      const slug = toSlug(categoryName)
      
      // Vérifier si la catégorie existe déjà
      let existingCategory = await Category.findOne({ slug })
      
      if (!existingCategory) {
        const category = new Category({
          name: categoryName,
          slug,
          level: 0,
          isActive: true,
          sortOrder: 0,
        })
        
        await category.save()
        createdCategories.set(categoryName, category._id.toString())
        console.log(`✅ Catégorie créée: ${categoryName}`)
      } else {
        createdCategories.set(categoryName, existingCategory._id.toString())
        console.log(`ℹ️  Catégorie existante: ${categoryName}`)
      }
    }

    // 3. Mettre à jour les produits avec les nouveaux ObjectId de catégories
    let updatedProducts = 0
    
    for (const [categoryName, categoryId] of createdCategories) {
      const result = await Product.updateMany(
        { category: categoryName },
        { 
          $set: { 
            category: categoryId,
            categoryName: categoryName // Garder l'ancien nom pour référence
          }
        }
      )
      
      updatedProducts += result.modifiedCount
      console.log(`🔄 ${result.modifiedCount} produits mis à jour pour la catégorie: ${categoryName}`)
    }

    console.log(`✅ Migration terminée!`)
    console.log(`📊 Résumé:`)
    console.log(`   - ${createdCategories.size} catégories créées/trouvées`)
    console.log(`   - ${updatedProducts} produits mis à jour`)

    // 4. Vérification
    const productsWithOldCategory = await Product.countDocuments({ 
      category: { $type: 'string' } 
    })
    
    if (productsWithOldCategory > 0) {
      console.log(`⚠️  ${productsWithOldCategory} produits ont encore l'ancien format de catégorie`)
    } else {
      console.log(`✅ Tous les produits ont été migrés avec succès`)
    }

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    throw error
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Connexion fermée')
  }
}

// Exemple de création de sous-catégories
async function createSampleSubCategories() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("🌱 Création d'exemples de sous-catégories...")

    // Trouver la catégorie "Computer Equipment"
    const computerCategory = await Category.findOne({ slug: 'computer-equipment' })
    if (!computerCategory) {
      console.log('❌ Catégorie "Computer Equipment" non trouvée')
      return
    }

    // Créer des sous-catégories pour Computer Equipment
    const subCategories = [
      { name: 'Laptops', description: 'Ordinateurs portables' },
      { name: 'Desktops', description: 'Ordinateurs de bureau' },
      { name: 'Monitors', description: 'Écrans et moniteurs' },
      { name: 'Keyboards', description: 'Claviers' },
      { name: 'Mice', description: 'Souris' },
    ]

    for (const subCat of subCategories) {
      const existing = await Category.findOne({ slug: toSlug(subCat.name) })
      if (!existing) {
        const category = new Category({
          name: subCat.name,
          slug: toSlug(subCat.name),
          description: subCat.description,
          parent: computerCategory._id,
          level: 1,
          isActive: true,
          sortOrder: 0,
        })
        
        await category.save()
        
        // Ajouter à la liste des enfants du parent
        await Category.findByIdAndUpdate(computerCategory._id, {
          $addToSet: { children: category._id }
        })
        
        console.log(`✅ Sous-catégorie créée: ${subCat.name}`)
      } else {
        console.log(`ℹ️  Sous-catégorie existante: ${subCat.name}`)
      }
    }

    console.log('✅ Exemples de sous-catégories créés!')

  } catch (error) {
    console.error('❌ Erreur lors de la création des sous-catégories:', error)
    throw error
  } finally {
    await mongoose.disconnect()
  }
}

// Fonction principale
async function main() {
  try {
    await migrateCategories()
    await createSampleSubCategories()
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration échouée:', error)
    process.exit(1)
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  main()
}

module.exports = { migrateCategories, createSampleSubCategories }
