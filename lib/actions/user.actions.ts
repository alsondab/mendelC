'use server'

import bcrypt from 'bcryptjs'
import { auth, signIn, signOut } from '@/auth'
import { IUserName, IUserSignIn, IUserSignUp } from '@/types'
import {
  UserSignUpSchema,
  UserUpdateSchema,
  Email,
  Password,
} from '../validator'
import { connectToDatabase } from '../db'
import User, { IUser } from '../db/models/user.model'
import { formatError } from '../utils'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSetting } from './setting.actions'
import { sendVerificationEmail } from '@/emails'
import crypto from 'crypto'

// CREATE
export async function registerUser(userSignUp: IUserSignUp) {
  try {
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    })

    await connectToDatabase()

    // Créer un token de vérification unique
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 heures

    // Hasher le mot de passe AVANT de créer l'utilisateur
    const hashedPassword = await bcrypt.hash(user.password, 5)

    const newUser = await User.create({
      name: user.name,
      email: user.email,
      password: hashedPassword, // Utiliser le mot de passe hashé explicitement
      emailVerified: false, // ❌ CHANGÉ : false par défaut, nécessite vérification
      verificationToken,
      verificationTokenExpiry,
      role: 'User', // Rôle par défaut
    })

    // Envoyer l'email de confirmation
    let emailSent = false
    try {
      const emailResult = await sendVerificationEmail({
        email: newUser.email,
        name: newUser.name,
        token: verificationToken,
      })

      // Vérifier si l'email a vraiment été envoyé
      if ('error' in emailResult && emailResult.error) {
        console.error(
          "❌ Échec de l'envoi de l'email de vérification:",
          emailResult.error
        )
        emailSent = false
      } else if ('data' in emailResult && emailResult.data?.id) {
        console.log(
          '✅ Email de vérification envoyé avec succès. ID:',
          emailResult.data.id
        )
        emailSent = true
      }
    } catch (emailError) {
      console.error(
        "❌ Erreur lors de l'envoi de l'email de vérification:",
        emailError
      )
      emailSent = false
      // Ne pas faire échouer la création du compte si l'email échoue
      // L'utilisateur pourra demander un nouvel email plus tard
    }

    if (!emailSent) {
      console.warn(
        "⚠️ Compte créé mais email de vérification non envoyé. L'utilisateur devra demander un renvoi."
      )
    }

    return {
      success: true,
      message:
        'Compte créé. Veuillez vérifier votre email pour activer votre compte.',
      requiresVerification: true,
    }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}

// DELETE

export async function deleteUser(id: string) {
  try {
    await connectToDatabase()
    const res = await User.findByIdAndDelete(id)
    if (!res) throw new Error('Use not found')
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'Utilisateur supprimé avec succès',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
// UPDATE

export async function updateUser(user: z.infer<typeof UserUpdateSchema>) {
  try {
    await connectToDatabase()
    const dbUser = await User.findById(user._id)
    if (!dbUser) throw new Error('User not found')
    dbUser.name = user.name
    dbUser.email = user.email
    dbUser.role = user.role
    const updatedUser = await dbUser.save()
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
export async function updateUserName(user: IUserName) {
  try {
    await connectToDatabase()
    const session = await auth()
    const currentUser = await User.findById(session?.user?.id)
    if (!currentUser) throw new Error('User not found')
    currentUser.name = user.name
    const updatedUser = await currentUser.save()
    return {
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function signInWithCredentials(user: IUserSignIn) {
  try {
    const result = await signIn('credentials', { ...user, redirect: false })

    // NextAuth v5 peut retourner :
    // - { ok: true } si la connexion réussit
    // - { error: string, ok: false } si la connexion échoue
    // - null/undefined dans certains cas (à traiter comme succès si pas d'erreur)

    // Si le résultat indique un succès explicite
    if (result && typeof result === 'object' && 'ok' in result) {
      if (result.ok === true) {
        return result
      }

      // Si ok est false, il y a une erreur
      if (result.ok === false) {
        // Vérifier si c'est lié à l'email non vérifié
        await connectToDatabase()
        const dbUser = await User.findOne({ email: user.email })

        if (dbUser && !dbUser.emailVerified) {
          throw new Error('EMAIL_NOT_VERIFIED')
        }

        // Autre erreur de connexion
        const errorMsg =
          'error' in result && result.error
            ? result.error === 'CredentialsSignin'
              ? 'Invalid email or password'
              : String(result.error)
            : 'Invalid email or password'
        throw new Error(errorMsg)
      }
    }

    // Si le résultat est null/undefined, vérifier dans la base de données
    // pour s'assurer que ce n'est pas un problème d'email non vérifié
    await connectToDatabase()
    const dbUser = await User.findOne({ email: user.email })

    if (!dbUser) {
      throw new Error('Invalid email or password')
    }

    if (!dbUser.emailVerified) {
      throw new Error('EMAIL_NOT_VERIFIED')
    }

    // Si l'utilisateur existe et est vérifié, mais signIn a retourné null/undefined,
    // cela peut être un problème de timing. Retourner un succès conditionnel.
    // Le useEffect dans le composant vérifiera la session.
    return { ok: true }
  } catch (error) {
    // Si l'erreur est déjà une Error avec un message, la relancer
    if (error instanceof Error) {
      throw error
    }
    // Sinon, créer une nouvelle erreur
    throw new Error('Invalid email or password')
  }
}
export const SignInWithGoogle = async () => {
  await signIn('google')
}
export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false })
  redirect(redirectTo.redirect)
}

// GET
export async function getAllUsers({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  await connectToDatabase()

  const skipAmount = (Number(page) - 1) * limit
  const users = await User.find()
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const usersCount = await User.countDocuments()
  return {
    data: JSON.parse(JSON.stringify(users)) as IUser[],
    totalPages: Math.ceil(usersCount / limit),
  }
}

export async function getUserById(userId: string) {
  await connectToDatabase()
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')
  return JSON.parse(JSON.stringify(user)) as IUser
}

// UPDATE EMAIL
export async function updateUserEmail({
  newEmail,
  password,
}: {
  newEmail: string
  password: string
}) {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('User not authenticated')
    }

    const user = await User.findById(session.user.id)
    if (!user) {
      throw new Error('User not found')
    }

    // Vérifier le mot de passe
    if (!user.password) {
      throw new Error('Password verification not available for this account')
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid password')
    }

    // Vérifier que le nouvel email n'existe pas déjà
    const existingUser = await User.findOne({ email: newEmail })
    if (existingUser && existingUser._id.toString() !== session.user.id) {
      throw new Error('Email already in use')
    }

    // Valider l'email
    const validatedEmail = Email.parse(newEmail)

    // Mettre à jour l'email
    user.email = validatedEmail
    await user.save()

    revalidatePath('/account/manage')
    return {
      success: true,
      message: 'Email mis à jour avec succès',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// UPDATE PASSWORD
export async function updateUserPassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string
  newPassword: string
}) {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('User not authenticated')
    }

    const user = await User.findById(session.user.id)
    if (!user) {
      throw new Error('User not found')
    }

    // Vérifier l'ancien mot de passe
    if (!user.password) {
      throw new Error('Password verification not available for this account')
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid current password')
    }

    // Valider le nouveau mot de passe
    const validatedPassword = Password.parse(newPassword)

    // Hasher et mettre à jour le mot de passe
    user.password = await bcrypt.hash(validatedPassword, 5)
    await user.save()

    revalidatePath('/account/manage')
    return {
      success: true,
      message: 'Mot de passe mis à jour avec succès',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// DELETE USER ACCOUNT (RGPD)
export async function deleteUserAccount() {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('User not authenticated')
    }

    const userId = session.user.id

    // Supprimer toutes les adresses associées
    const Address = (await import('../db/models/address.model')).default
    await Address.deleteMany({ user: userId })

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(userId)

    // Déconnexion sera gérée côté client après redirection
    return {
      success: true,
      message: 'Compte supprimé avec succès',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
