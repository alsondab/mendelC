import fs from 'fs/promises'
import path from 'path'

// Fonction pour lire les fichiers de traduction
async function readTranslationFile(locale: string) {
  try {
    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`)
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${locale}.json:`, error)
    return {}
  }
}

// Fonction pour écrire dans les fichiers de traduction
async function writeTranslationFile(locale: string, data: Record<string, unknown>) {
  try {
    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`)
    const content = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, content, 'utf-8')
    return true
  } catch (error) {
    console.error(`Erreur lors de l'écriture du fichier ${locale}.json:`, error)
    return false
  }
}

// Fonction pour ajouter une nouvelle traduction
export async function addTranslation(
  namespace: string,
  key: string,
  frenchValue: string,
  englishValue: string
) {
  try {
    // Lire les fichiers existants
    const frData = await readTranslationFile('fr')
    const enData = await readTranslationFile('en-US')

    // Créer le namespace s'il n'existe pas
    if (!frData[namespace]) {
      frData[namespace] = {}
    }
    if (!enData[namespace]) {
      enData[namespace] = {}
    }

    // Ajouter les traductions
    frData[namespace][key] = frenchValue
    enData[namespace][key] = englishValue

    // Écrire les fichiers
    const frSuccess = await writeTranslationFile('fr', frData)
    const enSuccess = await writeTranslationFile('en-US', enData)

    if (frSuccess && enSuccess) {
      return {
        success: true,
        message: `Traduction ajoutée avec succès pour ${namespace}.${key}`,
        data: {
          namespace,
          key,
          french: frenchValue,
          english: englishValue
        }
      }
    } else {
      return {
        success: false,
        message: 'Erreur lors de l\'écriture des fichiers de traduction'
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la traduction:', error)
    return {
      success: false,
      message: 'Erreur interne du serveur'
    }
  }
}

// Fonction pour ajouter plusieurs traductions en une fois
export async function addMultipleTranslations(translations: Array<{
  namespace: string
  key: string
  frenchValue: string
  englishValue: string
}>) {
  try {
    const results = []
    
    for (const translation of translations) {
      const result = await addTranslation(
        translation.namespace,
        translation.key,
        translation.frenchValue,
        translation.englishValue
      )
      results.push(result)
    }

    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    return {
      success: successCount === totalCount,
      message: `${successCount}/${totalCount} traductions ajoutées avec succès`,
      results
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de multiples traductions:', error)
    return {
      success: false,
      message: 'Erreur interne du serveur'
    }
  }
}

// Fonction pour obtenir toutes les traductions existantes
export async function getAllTranslations() {
  try {
    const frData = await readTranslationFile('fr')
    const enData = await readTranslationFile('en-US')

    return {
      success: true,
      data: {
        french: frData,
        english: enData
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des traductions:', error)
    return {
      success: false,
      message: 'Erreur interne du serveur'
    }
  }
}

// Fonction pour valider si une traduction existe
export async function validateTranslation(namespace: string, key: string) {
  try {
    const frData = await readTranslationFile('fr')
    const enData = await readTranslationFile('en-US')

    const frExists = frData[namespace] && frData[namespace][key]
    const enExists = enData[namespace] && enData[namespace][key]

    return {
      success: true,
      exists: frExists && enExists,
      french: frExists ? frData[namespace][key] : null,
      english: enExists ? enData[namespace][key] : null
    }
  } catch (error) {
    console.error('Erreur lors de la validation de la traduction:', error)
    return {
      success: false,
      message: 'Erreur interne du serveur'
    }
  }
}
