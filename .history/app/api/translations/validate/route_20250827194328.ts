import { NextRequest, NextResponse } from 'next/server'
import { TranslationValidatorService } from '@/lib/services/translation-validator.service'

// POST - Valider les traductions en temps réel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validator = new TranslationValidatorService()

    // Charger les traductions
    await validator.loadTranslations()

    let validationResult

    if (body.type === 'carousels' && body.carousels) {
      // Valider les carousels
      validationResult = validator.validateCarousels(body.carousels)
      
      // Ajouter des suggestions de clés propres pour les traductions manquantes
      if (!validationResult.isValid) {
        validationResult.missingTranslations.forEach(translation => {
          translation.suggestedTranslation = validator.getCleanKeySuggestion(translation.key)
        })
      }
    } else if (body.type === 'siteInfo' && body.siteInfo) {
      // Valider les informations du site
      validationResult = validator.validateSiteInfo(body.siteInfo)
      
      // Ajouter des suggestions de clés propres pour les traductions manquantes
      if (!validationResult.isValid) {
        validationResult.missingTranslations.forEach(translation => {
          translation.suggestedTranslation = validator.getCleanKeySuggestion(translation.key)
        })
      }
    } else {
      return NextResponse.json(
        { error: 'Type de validation invalide ou données manquantes' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: validationResult,
    })
  } catch (error) {
    console.error('Erreur API POST /api/translations/validate:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
