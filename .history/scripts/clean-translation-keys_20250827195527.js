import fs from 'fs/promises'
import path from 'path'

// Fonction pour nettoyer une clé
function cleanKey(key) {
  return key
    .replace(/[.,!?;:]/g, '') // Supprimer la ponctuation
    .replace(/\s+/g, '_') // Remplacer les espaces par des underscores
    .replace(/[^a-zA-Z0-9_]/g, '') // Garder seulement lettres, chiffres et underscores
    .toLowerCase() // Mettre en minuscules
}

// Fonction pour nettoyer un objet de traductions
function cleanTranslationObject(obj) {
  const cleaned = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      // Récursif pour les objets imbriqués
      cleaned[cleanKey(key)] = cleanTranslationObject(value)
    } else {
      // Nettoyer la clé, garder la valeur
      cleaned[cleanKey(key)] = value
    }
  }
  
  return cleaned
}

async function cleanTranslationFiles() {
  try {
    const frPath = path.join(process.cwd(), 'messages', 'fr.json')
    const enPath = path.join(process.cwd(), 'messages', 'en-US.json')
    
    console.log('🧹 Nettoyage des clés de traduction...')
    
    // Lire les fichiers
    const frContent = await fs.readFile(frPath, 'utf-8')
    const enContent = await fs.readFile(enPath, 'utf-8')
    
    const frTranslations = JSON.parse(frContent)
    const enTranslations = JSON.parse(enContent)
    
    // Nettoyer les clés
    const cleanedFr = cleanTranslationObject(frTranslations)
    const cleanedEn = cleanTranslationObject(enTranslations)
    
    // Sauvegarder les fichiers nettoyés
    await fs.writeFile(frPath, JSON.stringify(cleanedFr, null, 2), 'utf-8')
    await fs.writeFile(enPath, JSON.stringify(cleanedEn, null, 2), 'utf-8')
    
    console.log('✅ Fichiers de traduction nettoyés avec succès !')
    console.log('📝 Exemple de transformation :')
    console.log('   "Empowering Technology, Securing Tomorrow." → "empowering_technology_securing_tomorrow"')
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
  }
}

// Exécuter le script
cleanTranslationFiles()
