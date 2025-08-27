import { auth } from '@/auth'

export async function verifyAdminAccess() {
  try {
    const session = await auth()

    // Vérifier si l'utilisateur est connecté
    if (!session?.user) {
      return {
        authorized: false,
        error: 'Non authentifié',
        status: 401,
      }
    }

    // Vérifier si l'utilisateur a le rôle admin
    if (session.user.role !== 'admin') {
      return {
        authorized: false,
        error: 'Accès refusé - Privilèges insuffisants',
        status: 403,
      }
    }

    return {
      authorized: true,
      user: session.user,
    }
  } catch (error) {
    console.error(
      'Erreur lors de la vérification des permissions admin:',
      error
    )
    return {
      authorized: false,
      error: "Erreur d'authentification",
      status: 500,
    }
  }
}
