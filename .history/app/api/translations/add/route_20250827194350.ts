import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// POST - Ajouter une nouvelle traduction avec une clé propre
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { namespace, originalKey, frenchValue, englishValue } = body

    if (!namespace || !originalKey || !frenchValue || !englishValue) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Nettoyer la clé pour la rendre compatible avec next-intl
    const cleanKey = originalKey
      .replace(/[.,!?;:]/g, '') // Supprimer la ponctuation
      .replace(/\s+/g, '_') // Remplacer les espaces par des underscores
      .replace(/[^a-zA-Z0-9_]/g, '') // Garder seulement lettres, chiffres et underscores
      .toLowerCase() // Mettre en minuscules

    // Charger les fichiers de traduction existants
    const frPath = path.join(process.cwd(), 'messages', 'fr.json')
    const enPath = path.join(process.cwd(), 'messages', 'en-US.json')

    const frContent = await fs.readFile(frPath, 'utf-8')
    const enContent = await fs.readFile(enPath, 'utf-8')

    const frTranslations = JSON.parse(frContent)
    const enTranslations = JSON.parse(enContent)

    // Ajouter la nouvelle traduction
    if (!frTranslations[namespace]) {
      frTranslations[namespace] = {}
    }
    if (!enTranslations[namespace]) {
      enTranslations[namespace] = {}
    }

    frTranslations[namespace][cleanKey] = frenchValue
    enTranslations[namespace][cleanKey] = englishValue

    // Sauvegarder les fichiers
    await fs.writeFile(frPath, JSON.stringify(frTranslations, null, 2), 'utf-8')
    await fs.writeFile(enPath, JSON.stringify(enTranslations, null, 2), 'utf-8')

    return NextResponse.json({
      success: true,
      message: 'Traduction ajoutée avec succès',
      data: {
        namespace,
        originalKey,
        cleanKey,
        frenchValue,
        englishValue
      }
    })

  } catch (error) {
    console.error('Erreur API POST /api/translations/add:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
