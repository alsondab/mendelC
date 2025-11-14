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
    await user.save()

    return {
      success: true,
      message:
        'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.',
    }
  } catch (error) {
    return { success: false, error: formatError(error) }
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
