import { connectToDatabase } from '../lib/db/mongodb'
import Product from '../lib/db/models/product.model'
import Category from '../lib/db/models/category.model'
import { toSlug } from '../lib/utils'

async function migrateCategories() {
  try {
    await connectToDatabase()
    console.log('🚀 Début de la migration des catégories...')

    // 1. Récupérer toutes les catégories uniques des produits
    const uniqueCategories = await Product.distinct('category')
    console.log(
      `📋 ${uniqueCategories.length} catégories trouvées:`,
      uniqueCategories
    )

    // 2. Créer les catégories principales
    const createdCategories = new Map<string, string>() // name -> ObjectId

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
            categoryName: categoryName, // Garder l'ancien nom pour référence
          },
        }
      )

      updatedProducts += result.modifiedCount
      console.log(
        `🔄 ${result.modifiedCount} produits mis à jour pour la catégorie: ${categoryName}`
      )
    }

    console.log(`✅ Migration terminée!`)
    console.log(`📊 Résumé:`)
    console.log(`   - ${createdCategories.size} catégories créées/trouvées`)
    console.log(`   - ${updatedProducts} produits mis à jour`)

    // 4. Vérification
    const productsWithOldCategory = await Product.countDocuments({
      category: { $type: 'string' },
    })

    if (productsWithOldCategory > 0) {
      console.log(
        `⚠️  ${productsWithOldCategory} produits ont encore l'ancien format de catégorie`
      )
    } else {
      console.log(`✅ Tous les produits ont été migrés avec succès`)
    }
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    throw error
  }
}

// Exemple de création de sous-catégories
async function createSampleSubCategories() {
  try {
    await connectToDatabase()
    console.log("🌱 Création d'exemples de sous-catégories...")

    // Trouver la catégorie "Computer Equipment"
    const computerCategory = await Category.findOne({
      slug: 'computer-equipment',
    })
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
          $addToSet: { children: category._id },
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

export { migrateCategories, createSampleSubCategories }
