import { MongoDBAdapter } from '@auth/mongodb-adapter'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from './lib/db'
import client from './lib/db/client'
import User from './lib/db/models/user.model'
import {
  verifySessionToken,
  consumeSessionToken,
} from './lib/actions/verification.actions'

import NextAuth, { type DefaultSession } from 'next-auth'
import authConfig from './auth.config'

declare module 'next-auth' {
  interface Session {
    user: {
      role: string
    } & DefaultSession['user']
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: MongoDBAdapter(client),
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        await connectToDatabase()
        if (credentials == null) return null

        // Récupérer l'utilisateur
        const user = await User.findOne({ email: credentials.email })

        if (!user) return null

        // Vérifier que l'utilisateur a un mot de passe (pas un compte OAuth uniquement)
        if (!user.password) {
          return null
        }

        // Vérifier si c'est un token de session temporaire (pour connexion après vérification email)
        const passwordValue =
          typeof credentials.password === 'string'
            ? credentials.password
            : String(credentials.password || '')
        if (passwordValue.startsWith('verify_token_')) {
          const sessionToken = passwordValue.replace('verify_token_', '')
          const sessionData = await verifySessionToken(sessionToken)

          if (
            sessionData.valid &&
            sessionData.email === credentials.email &&
            user.emailVerified
          ) {
            // Consommer le token (usage unique)
            await consumeSessionToken(sessionToken)
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
          return null
        }

        // Connexion normale avec mot de passe
        if (user.password) {
          const passwordToCompare =
            typeof credentials.password === 'string'
              ? credentials.password
              : String(credentials.password || '')

          const isMatch = await bcrypt.compare(passwordToCompare, user.password)

          if (isMatch) {
            // Vérifier si l'email est vérifié
            if (!user.emailVerified) {
              throw new Error('EMAIL_NOT_VERIFIED')
            }
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
          // Si le mot de passe ne correspond pas, retourner null (NextAuth affichera "Invalid credentials")
        }
        return null
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === 'google') {
        await connectToDatabase()

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email: user.email })

        if (!existingUser) {
          // Créer un nouvel utilisateur avec votre schéma personnalisé
          // Cela garantit que tous les champs du schéma sont respectés
          const newUser = await User.create({
            email: user.email,
            name: user.name,
            role: 'User',
            emailVerified: true,
            image: user.image,
          })

          // Mettre à jour l'ID de l'utilisateur pour NextAuth
          user.id = newUser._id.toString()
        } else {
          // Mettre à jour l'utilisateur existant
          await User.findByIdAndUpdate(existingUser._id, {
            name: user.name,
            image: user.image,
            emailVerified: true,
          })

          // Mettre à jour l'ID de l'utilisateur pour NextAuth
          user.id = existingUser._id.toString()
        }
      }
      return true
    },
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        if (!user.name) {
          await connectToDatabase()
          await User.findByIdAndUpdate(user.id, {
            name: user.name || user.email!.split('@')[0],
            role: 'User',
          })
        }
        token.name = user.name || user.email!.split('@')[0]
        token.role = (user as { role: string }).role || 'User'
      }

      if (session?.user?.name && trigger === 'update') {
        token.name = session.user.name
      }
      return token
    },
    session: async ({ session, user, trigger, token }) => {
      session.user.id = token.sub as string
      session.user.role = token.role as string
      session.user.name = token.name
      if (trigger === 'update') {
        session.user.name = user.name
      }
      return session
    },
  },
})
