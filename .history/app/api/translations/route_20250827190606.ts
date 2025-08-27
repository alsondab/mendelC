import { NextRequest, NextResponse } from 'next/server'
import { addTranslation, addMultipleTranslations, getAllTranslations } from '@/lib/actions/translation.actions'

// GET - Récupérer toutes les traductions
export async function GET() {
  try {
    const result = await getAllTranslations()
    
    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erreur API GET /api/translations:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST - Ajouter une ou plusieurs traductions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (body.multiple && Array.isArray(body.translations)) {
      // Ajouter plusieurs traductions
      const result = await addMultipleTranslations(body.translations)
      
      if (result.success) {
        return NextResponse.json(result)
      } else {
        return NextResponse.json(
          { error: result.message },
          { status: 500 }
        )
      }
    } else if (body.namespace && body.key && body.frenchValue && body.englishValue) {
      // Ajouter une seule traduction
      const result = await addTranslation(
        body.namespace,
        body.key,
        body.frenchValue,
        body.englishValue
      )
      
      if (result.success) {
        return NextResponse.json(result)
      } else {
        return NextResponse.json(
          { error: result.message },
          { status: 500 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Données manquantes ou invalides' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Erreur API POST /api/translations:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
