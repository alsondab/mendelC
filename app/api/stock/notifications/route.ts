import { NextResponse } from 'next/server'
import { checkStockAndNotify } from '@/lib/actions/stock-notifications.actions'

export async function GET() {
  try {
    const result = await checkStockAndNotify()

    return NextResponse.json({
      success: result.success,
      message: result.message,
      notificationsSent: result.notificationsSent,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Erreur lors de la vérification des stocks:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Erreur interne du serveur',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const { adminEmail } = { adminEmail: 'admin@votre-site.com' }

    const result = await checkStockAndNotify()

    return NextResponse.json({
      success: result.success,
      message: result.message,
      notificationsSent: result.notificationsSent,
      adminEmail: adminEmail || 'admin@votre-site.com',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi des notifications:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de l'envoi des notifications",
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    )
  }
}
