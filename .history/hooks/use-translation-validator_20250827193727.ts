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

  // Fonction pour valider un objet de carousel avec le vrai service
  const validateCarouselTranslations = useCallback(
    async (
      carousels: Array<{ title: string; buttonCaption: string }>
    ): Promise<TranslationValidationResult> => {
      try {
        const response = await fetch('/api/translations/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'carousels',
            carousels
          }),
        })

        const result = await response.json()
        
        if (result.success) {
          setValidationResults(result.data)
          return result.data
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error('Erreur lors de la validation des carousels:', error)
        const fallbackResult: TranslationValidationResult = {
          isValid: false,
          missingTranslations: [],
          totalMissing: 0
        }
        setValidationResults(fallbackResult)
        return fallbackResult
      }
    },
    []
  )

  // Fonction pour valider les informations du site avec le vrai service
  const validateSiteInfoTranslations = useCallback(
    async (
      siteInfo: {
        name: string
        slogan: string
        description: string
      }
    ): Promise<TranslationValidationResult> => {
      try {
        const response = await fetch('/api/translations/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'siteInfo',
            siteInfo
          }),
        })

        const result = await response.json()
        
        if (result.success) {
          setValidationResults(result.data)
          return result.data
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error('Erreur lors de la validation des infos du site:', error)
        const fallbackResult: TranslationValidationResult = {
          isValid: false,
          missingTranslations: [],
          totalMissing: 0
        }
        setValidationResults(fallbackResult)
        return fallbackResult
      }
    },
    []
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
    getAllMissingTranslations,
    clearValidationResults,
  }
}
