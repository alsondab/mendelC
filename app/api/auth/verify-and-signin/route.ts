import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/actions/verification.actions'
import { signIn } from '@/auth'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/db/models/user.model'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionToken = searchParams.get('token')

    if (!sessionToken) {
      return NextResponse.redirect(
        new URL('/sign-in?error=missing_token', request.url)
      )
    }

    // Vérifier le token de session temporaire
    const sessionData = await verifySessionToken(sessionToken)

    if (!sessionData.valid || !sessionData.userId || !sessionData.email) {
      return NextResponse.redirect(
        new URL('/sign-in?error=invalid_token', request.url)
      )
    }

    // Récupérer l'utilisateur pour obtenir le mot de passe (nécessaire pour signIn)
    await connectToDatabase()
    const user = await User.findById(sessionData.userId)

    if (!user || !user.password) {
      return NextResponse.redirect(
        new URL('/sign-in?error=user_not_found', request.url)
      )
    }

    // Vérifier que l'email est bien vérifié
    if (!user.emailVerified) {
      return NextResponse.redirect(
        new URL('/sign-in?error=email_not_verified', request.url)
      )
    }

    // Connecter l'utilisateur avec le token de session temporaire
    try {
      await signIn('credentials', {
        email: sessionData.email,
        password: `verify_token_${sessionToken}`, // Token spécial pour le CredentialsProvider
        redirect: false,
      })
      // Le token sera consommé automatiquement dans auth.ts lors de l'autorisation

      // Rediriger vers la homepage
      return NextResponse.redirect(new URL('/', request.url))
    } catch (signInError) {
      console.error('Erreur lors de la connexion:', signInError)
      return NextResponse.redirect(
        new URL('/sign-in?error=signin_failed', request.url)
      )
    }
  } catch (error) {
    console.error('Erreur lors de la vérification et connexion:', error)
    return NextResponse.redirect(
      new URL('/sign-in?error=server_error', request.url)
    )
  }
}
