import { NextRequest, NextResponse } from 'next/server'
import { checkAndUpdateExpiredPromotions } from '@/lib/actions/promotion.actions'

export async function GET(request: NextRequest) {
  try {
    // Vérifier si c'est un appel cron légitime (optionnel)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    console.log('🕐 Vérification automatique des promotions expirées...')

    const result = await checkAndUpdateExpiredPromotions()

    if (result.success) {
      console.log(`✅ ${result.updatedCount} promotions mises à jour`)
      return NextResponse.json({
        success: true,
        message: `${result.updatedCount} promotions mises à jour`,
        timestamp: new Date().toISOString(),
      })
    } else {
      console.error(
        '❌ Erreur lors de la vérification des promotions:',
        result.error
      )
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error(
      '❌ Erreur critique lors de la vérification des promotions:',
      error
    )
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur interne du serveur',
      },
      { status: 500 }
    )
  }
}

// Endpoint de test local (développement uniquement)
export async function POST() {
  try {
    console.log('🧪 Test local de vérification des promotions...')

    const result = await checkAndUpdateExpiredPromotions()

    return NextResponse.json({
      success: true,
      message: `Test local terminé: ${result.updatedCount} promotions mises à jour`,
      timestamp: new Date().toISOString(),
      note: 'En développement, appelez cette API manuellement pour tester',
    })
  } catch (error) {
    console.error('❌ Erreur lors du test local:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors du test local',
      },
      { status: 500 }
    )
  }
}
