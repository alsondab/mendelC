#!/usr/bin/env node

/**
 * Script de nettoyage de la base de données
 * Supprime les comptes dupliqués et orphelins
 * 
 * Usage: node scripts/cleanup-db.js
 */

require('dotenv').config()
const { runFullCleanup } = require('../lib/db/cleanup-duplicates')

async function main() {
  try {
    console.log('🚀 Démarrage du script de nettoyage...')
    console.log('📅 Date:', new Date().toISOString())
    console.log('🔗 URI MongoDB:', process.env.MONGODB_URI ? '✅ Configuré' : '❌ Manquant')
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI manquant dans les variables d\'environnement')
      process.exit(1)
    }
    
    await runFullCleanup()
    
    console.log('🎉 Script de nettoyage terminé avec succès!')
    process.exit(0)
    
  } catch (error) {
    console.error('💥 Erreur fatale:', error)
    process.exit(1)
  }
}

// Gestion des signaux pour un arrêt propre
process.on('SIGINT', () => {
  console.log('\n⏹️  Arrêt demandé par l\'utilisateur')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n⏹️  Arrêt demandé par le système')
  process.exit(0)
})

main()
