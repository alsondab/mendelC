'use server'

import { connectToDatabase } from '../db'
import User from '../db/models/user.model'
import { formatError } from '../utils'
import { sendVerificationEmail } from '@/emails'
import crypto from 'crypto'

/**
 * Vérifie le token d'email et active le compte
 */
export async function verifyEmail(token: string) {
  try {
    await connectToDatabase()

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }, // Token non expiré
    })

    if (!user) {
      return {
        success: false,
        error:
          'Token invalide ou expiré. Veuillez demander un nouvel email de vérification.',
      }
    }

    // Activer le compte
    user.emailVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiry = undefined

    // Générer un token de session temporaire pour la connexion automatique
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const sessionTokenExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Stocker le token dans la base de données (au lieu de la mémoire)
    user.sessionToken = sessionToken
    user.sessionTokenExpiry = sessionTokenExpiry
    await user.save()

    // Nettoyer les tokens de session expirés pour tous les utilisateurs
    await User.updateMany(
      { sessionTokenExpiry: { $lt: new Date() } },
      { $unset: { sessionToken: 1, sessionTokenExpiry: 1 } }
    )

    return {
      success: true,
      message:
        'Email vérifié avec succès ! Vous allez être connecté automatiquement.',
      userEmail: user.email,
      userId: user._id.toString(),
      sessionToken,
    }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}

/**
 * Vérifie un token de session temporaire et retourne les infos utilisateur
 */
export async function verifySessionToken(sessionToken: string): Promise<{
  valid: boolean
  userId?: string
  email?: string
}> {
  try {
    await connectToDatabase()

    const user = await User.findOne({
      sessionToken,
      sessionTokenExpiry: { $gt: new Date() }, // Token non expiré
    })

    if (!user) {
      return { valid: false }
    }

    return {
      valid: true,
      userId: user._id.toString(),
      email: user.email,
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du token de session:', error)
    return { valid: false }
  }
}

/**
 * Supprime un token de session temporaire après utilisation
 */
export async function consumeSessionToken(sessionToken: string): Promise<void> {
  try {
    await connectToDatabase()
    await User.updateOne(
      { sessionToken },
      { $unset: { sessionToken: 1, sessionTokenExpiry: 1 } }
    )
  } catch (error) {
    console.error('Erreur lors de la suppression du token de session:', error)
  }
}

/**
 * Renvoie un nouvel email de vérification
 */
export async function resendVerificationEmail(email: string) {
  try {
    await connectToDatabase()

    const user = await User.findOne({ email })

    if (!user) {
      return {
        success: false,
        error: 'Aucun compte trouvé avec cet email.',
      }
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: 'Cet email est déjà vérifié.',
      }
    }

    // Générer un nouveau token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 heures

    user.verificationToken = verificationToken
    user.verificationTokenExpiry = verificationTokenExpiry
    await user.save()

    // Envoyer l'email
    try {
      await sendVerificationEmail({
        email: user.email,
        name: user.name,
        token: verificationToken,
      })
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError)
      return {
        success: false,
        error:
          "Erreur lors de l'envoi de l'email. Veuillez réessayer plus tard.",
      }
    }

    return {
      success: true,
      message: 'Email de vérification envoyé avec succès !',
    }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}
