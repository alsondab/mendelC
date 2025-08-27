import { useCallback, useState } from 'react'

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

export function useTranslationValidator() {
  const [validationResults, setValidationResults] =
    useState<TranslationValidationResult>({
      isValid: true,
      missingTranslations: [],
      totalMissing: 0,
    })

  // Fonction pour valider une clé de traduction
  const validateTranslationKey = useCallback((): boolean => {
    // Validation simple basée sur la présence de la clé
    // On ne peut pas utiliser useTranslations dans un callback
    // Pour l'instant, on retourne false pour simuler des traductions manquantes
    return false // Simule que toutes les traductions sont manquantes pour tester
  }, [])

  // Fonction pour valider un objet de carousel
  const validateCarouselTranslations = useCallback(
    (
      carousels: Array<{ title: string; buttonCaption: string }>
    ): TranslationValidationResult => {
      const missing: MissingTranslation[] = []

      carousels.forEach((carousel, index) => {
        // Valider le titre
        if (
          !validateTranslationKey()
        ) {
          missing.push({
            key: carousel.title,
            namespace: 'Home',
            context: `Carousel ${index + 1} Title`,
            suggestedTranslation: carousel.title, // Suggestion basée sur l'original
          })
        }

        // Valider le bouton
        if (
          !validateTranslationKey()
        ) {
          missing.push({
            key: carousel.buttonCaption,
            namespace: 'Home',
            context: `Carousel ${index + 1} Button`,
            suggestedTranslation: carousel.buttonCaption,
          })
        }
      })

      const result: TranslationValidationResult = {
        isValid: missing.length === 0,
        missingTranslations: missing,
        totalMissing: missing.length,
      }

      setValidationResults(result)
      return result
    },
    [validateTranslationKey]
  )

  // Fonction pour valider les informations du site
  const validateSiteInfoTranslations = useCallback(
    (siteInfo: {
      name: string
      slogan: string
      description: string
    }): TranslationValidationResult => {
      const missing: MissingTranslation[] = []

      // Valider le nom du site
      if (!validateTranslationKey()) {
        missing.push({
          key: siteInfo.name,
          namespace: 'Site',
          context: 'Site Name',
          suggestedTranslation: siteInfo.name,
        })
      }

      // Valider le slogan
      if (!validateTranslationKey()) {
        missing.push({
          key: siteInfo.slogan,
          namespace: 'Site',
          context: 'Site Slogan',
          suggestedTranslation: siteInfo.slogan,
        })
      }

      const result: TranslationValidationResult = {
        isValid: missing.length === 0,
        missingTranslations: missing,
        totalMissing: missing.length,
      }

      setValidationResults(result)
      return result
    },
    [validateTranslationKey]
  )

  // Fonction pour obtenir toutes les clés manquantes
  const getAllMissingTranslations = useCallback((): MissingTranslation[] => {
    return validationResults.missingTranslations
  }, [validationResults])

  // Fonction pour effacer les résultats de validation
  const clearValidationResults = useCallback(() => {
    setValidationResults({
      isValid: true,
      missingTranslations: [],
      totalMissing: 0,
    })
  }, [])

  return {
    validationResults,
    validateCarouselTranslations,
    validateSiteInfoTranslations,
    validateTranslationKey,
    getAllMissingTranslations,
    clearValidationResults,
  }
}
