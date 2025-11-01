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

export async function POST(request: Request) {
  try {
    let adminEmail = 'admin@example.com'

    // Essayer de récupérer l'email depuis le body de la requête
    try {
      const body = await request.json().catch(() => null)
      if (body?.adminEmail) {
        adminEmail = body.adminEmail
      }
    } catch {
      // Ignorer les erreurs de parsing
    }

    // Si pas d'email depuis le body, essayer de récupérer depuis les paramètres stockés
    if (adminEmail === 'admin@example.com') {
      try {
        const { getNotificationSettings } = await import(
          '@/lib/actions/notification-settings.actions'
        )
        const settingsResult = await getNotificationSettings()
        if (settingsResult.success && settingsResult.settings?.adminEmail) {
          adminEmail = settingsResult.settings.adminEmail
        }
      } catch {
        // Ignorer les erreurs
      }
    }

    const result = await checkStockAndNotify(adminEmail)

    return NextResponse.json({
      success: result.success,
      message: result.message,
      notificationsSent: result.notificationsSent,
      adminEmail: adminEmail,
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
