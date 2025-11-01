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
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
      emailVerified: true, // ✅ Considérer tous les emails comme vérifiés (cohérence avec Google OAuth)
    })
    return { success: true, message: 'Utilisateur créé avec succès' }
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
  return await signIn('credentials', { ...user, redirect: false })
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
