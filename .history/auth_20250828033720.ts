import { MongoDBAdapter } from '@auth/mongodb-adapter'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from './lib/db'
import client from './lib/db/client'
import User from './lib/db/models/user.model'

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
        console.log('🔐 [DEBUG] authorize() appelé avec:', { email: credentials?.email })
        
        try {
          await connectToDatabase()
          console.log('🔐 [DEBUG] Connexion à la base réussie')
          
          if (credentials == null) {
            console.log('❌ [DEBUG] Credentials null')
            return null
          }

          const user = await User.findOne({ email: credentials.email })
          console.log('🔐 [DEBUG] Utilisateur trouvé:', user ? 'OUI' : 'NON')

          if (user && user.password) {
            console.log('🔐 [DEBUG] Vérification du mot de passe...')
            const isMatch = await bcrypt.compare(
              credentials.password as string,
              user.password
            )
            console.log('🔐 [DEBUG] Mot de passe valide:', isMatch)
            
            if (isMatch) {
              console.log('✅ [DEBUG] Authentification réussie pour:', user.email)
              return {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
              }
            }
          }
          
          console.log('❌ [DEBUG] Authentification échouée')
          return null
        } catch (error) {
          console.error('❌ [DEBUG] Erreur dans authorize():', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        if (!user.name) {
          await connectToDatabase()
          await User.findByIdAndUpdate(user.id, {
            name: user.name || user.email!.split('@')[0],
            role: 'user',
          })
        }
        token.name = user.name || user.email!.split('@')[0]
        token.role = (user as { role: string }).role
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
