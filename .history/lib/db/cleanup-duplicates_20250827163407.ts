import { connectToDatabase } from './index'
import client from './client'

export async function cleanupDuplicateAccounts() {
  try {
    await connectToDatabase()
    const db = client.db()
    
    console.log('🔍 Recherche des comptes dupliqués...')
    
    // Trouver tous les comptes avec le même providerAccountId
    const duplicateAccounts = await db.collection('accounts').aggregate([
      {
        $group: {
          _id: '$providerAccountId',
          count: { $sum: 1 },
          accounts: { $push: '$_id' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).toArray()
    
    if (duplicateAccounts.length === 0) {
      console.log('✅ Aucun compte dupliqué trouvé')
      return
    }
    
    console.log(`📊 Trouvé ${duplicateAccounts.length} groupes de comptes dupliqués`)
    
    let totalRemoved = 0
    
    for (const duplicate of duplicateAccounts) {
      // Garder le premier compte, supprimer les autres
      const accountsToRemove = duplicate.accounts.slice(1)
      
      console.log(`🗑️  Suppression de ${accountsToRemove.length} comptes dupliqués pour ${duplicate._id}`)
      
      const result = await db.collection('accounts').deleteMany({
        _id: { $in: accountsToRemove }
      })
      
      totalRemoved += result.deletedCount || 0
    }
    
    console.log(`✅ Nettoyage terminé. ${totalRemoved} comptes dupliqués supprimés`)
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
    throw error
  }
}

export async function cleanupOrphanedAccounts() {
  try {
    await connectToDatabase()
    const db = client.db()
    
    console.log('🔍 Recherche des comptes orphelins...')
    
    // Trouver les comptes qui n'ont pas d'utilisateur associé
    const orphanedAccounts = await db.collection('accounts').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $match: {
          user: { $size: 0 }
        }
      }
    ]).toArray()
    
    if (orphanedAccounts.length === 0) {
      console.log('✅ Aucun compte orphelin trouvé')
      return
    }
    
    console.log(`🗑️  Suppression de ${orphanedAccounts.length} comptes orphelins`)
    
    const accountIds = orphanedAccounts.map(acc => acc._id)
    const result = await db.collection('accounts').deleteMany({
      _id: { $in: accountIds }
    })
    
    console.log(`✅ ${result.deletedCount} comptes orphelins supprimés`)
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des orphelins:', error)
    throw error
  }
}

// Fonction principale pour exécuter tout le nettoyage
export async function runFullCleanup() {
  console.log('🧹 Début du nettoyage complet de la base de données...')
  
  await cleanupDuplicateAccounts()
  await cleanupOrphanedAccounts()
  
  console.log('🎉 Nettoyage complet terminé!')
}

// Exécuter si le script est appelé directement
if (require.main === module) {
  runFullCleanup()
    .then(() => {
      console.log('Script terminé avec succès')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Erreur lors de l\'exécution du script:', error)
      process.exit(1)
    })
}
