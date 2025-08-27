import fs from 'fs/promises'
import path from 'path'

export interface TranslationFile {
  [namespace: string]: {
    [key: string]: string
  }
}

export interface MissingTranslation {
  key: string
  namespace: string
  context: string
  suggestedTranslation?: string
}

export interface TranslationValidationResult {
  isValid: boolean
  missingTranslations: MissingTranslation[]
  totalMissing: number
}

export class TranslationValidatorService {
  private frTranslations: TranslationFile = {}
  private enTranslations: TranslationFile = {}

  // Charger les fichiers de traduction
  async loadTranslations(): Promise<void> {
    try {
      const frPath = path.join(process.cwd(), 'messages', 'fr.json')
      const enPath = path.join(process.cwd(), 'messages', 'en-US.json')

      const frContent = await fs.readFile(frPath, 'utf-8')
      const enContent = await fs.readFile(enPath, 'utf-8')

      this.frTranslations = JSON.parse(frContent)
      this.enTranslations = JSON.parse(enContent)
    } catch (error) {
      console.error('Erreur lors du chargement des traductions:', error)
      this.frTranslations = {}
      this.enTranslations = {}
    }
  }

  // Nettoyer une clé pour la rendre compatible avec next-intl
  private cleanKey(key: string): string {
    return key
      .replace(/[.,!?;:]/g, '') // Supprimer la ponctuation
      .replace(/\s+/g, '_') // Remplacer les espaces par des underscores
      .replace(/[^a-zA-Z0-9_]/g, '') // Garder seulement lettres, chiffres et underscores
      .toLowerCase() // Mettre en minuscules
  }

  // Vérifier si une traduction existe
  private translationExists(namespace: string, key: string): boolean {
    const cleanKeyValue = this.cleanKey(key)
    
    // Chercher dans les clés existantes avec la clé nettoyée
    const frKeys = Object.keys(this.frTranslations[namespace] || {})
    const enKeys = Object.keys(this.enTranslations[namespace] || {})
    
    // Vérifier si une clé nettoyée correspond
    const frExists = frKeys.some(existingKey => this.cleanKey(existingKey) === cleanKeyValue)
    const enExists = enKeys.some(existingKey => this.cleanKey(existingKey) === cleanKeyValue)
    
    return frExists && enExists
  }

  // Valider les carousels
  validateCarousels(
    carousels: Array<{ title: string; buttonCaption: string }>
  ): TranslationValidationResult {
    const missing: MissingTranslation[] = []

    carousels.forEach((carousel, index) => {
      // Valider le titre
      if (!this.translationExists('Home', carousel.title)) {
        missing.push({
          key: carousel.title,
          namespace: 'Home',
          context: `Carousel ${index + 1} Title`,
          suggestedTranslation: carousel.title,
        })
      }

      // Valider le bouton
      if (!this.translationExists('Home', carousel.buttonCaption)) {
        missing.push({
          key: carousel.buttonCaption,
          namespace: 'Home',
          context: `Carousel ${index + 1} Button`,
          suggestedTranslation: carousel.buttonCaption,
        })
      }
    })

    return {
      isValid: missing.length === 0,
      missingTranslations: missing,
      totalMissing: missing.length,
    }
  }

  // Valider les informations du site
  validateSiteInfo(siteInfo: {
    name: string
    slogan: string
    description: string
  }): TranslationValidationResult {
    const missing: MissingTranslation[] = []

    // Valider le nom du site
    if (!this.translationExists('Site', siteInfo.name)) {
      missing.push({
        key: siteInfo.name,
        namespace: 'Site',
        context: 'Site Name',
        suggestedTranslation: siteInfo.name,
      })
    }

    // Valider le slogan
    if (!this.translationExists('Site', siteInfo.slogan)) {
      missing.push({
        key: siteInfo.slogan,
        namespace: 'Site',
        context: 'Site Slogan',
        suggestedTranslation: siteInfo.slogan,
      })
    }

    return {
      isValid: missing.length === 0,
      missingTranslations: missing,
      totalMissing: missing.length,
    }
  }

  // Obtenir toutes les traductions
  getAllTranslations(): { french: TranslationFile; english: TranslationFile } {
    return {
      french: this.frTranslations,
      english: this.enTranslations,
    }
  }

  // Vérifier une traduction spécifique
  checkTranslation(
    namespace: string,
    key: string
  ): { exists: boolean; french?: string; english?: string } {
    const frValue = this.frTranslations[namespace]?.[key]
    const enValue = this.enTranslations[namespace]?.[key]

    return {
      exists: !!(frValue && enValue),
      french: frValue,
      english: enValue,
    }
  }
}
