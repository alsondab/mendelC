import mongoose from 'mongoose'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI,
  retries = 3
): Promise<typeof mongoose> => {
  if (cached.conn) {
    // Vérifier si la connexion est toujours active
    if (mongoose.connection.readyState === 1) {
      return cached.conn
    } else {
      // Réinitialiser la connexion si elle est fermée
      cached.conn = null
      cached.promise = null
    }
  }

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

  // Options de connexion avec timeouts appropriés
  const options: mongoose.ConnectOptions = {
    serverSelectionTimeoutMS: 10000, // 10 secondes pour sélectionner un serveur
    socketTimeoutMS: 45000, // 45 secondes pour les opérations socket
    connectTimeoutMS: 30000, // 30 secondes pour établir la connexion initiale
    maxPoolSize: 10, // Nombre maximum de connexions dans le pool
    minPoolSize: 5, // Nombre minimum de connexions dans le pool
    retryWrites: true, // Réessayer les écritures en cas d'échec
    retryReads: true, // Réessayer les lectures en cas d'échec
    // Options DNS pour éviter les timeouts SRV
    directConnection: false, // Utiliser SRV records
    family: 4, // Forcer IPv4 (peut aider avec certains problèmes DNS)
  }

  // Retry logic pour les erreurs de timeout
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Si une promesse existe déjà et qu'on n'est pas en retry, l'utiliser
      if (cached.promise && attempt === 1) {
        cached.conn = await cached.promise
        return cached.conn
      }

      // Sinon, créer une nouvelle connexion
      cached.promise = mongoose.connect(MONGODB_URI, options)
      cached.conn = await cached.promise

      return cached.conn
    } catch (error: unknown) {
      // Réinitialiser la promesse en cas d'erreur pour permettre un nouveau essai
      cached.promise = null
      cached.conn = null

      // Type guard pour vérifier les propriétés de l'erreur
      const errorObj = error as {
        code?: string
        message?: string
        name?: string
      }

      const isTimeoutError =
        errorObj.code === 'ETIMEOUT' ||
        errorObj.code === 'ENOTFOUND' ||
        errorObj.code === 'ECONNREFUSED' ||
        (errorObj.message?.includes('timeout') ?? false) ||
        (errorObj.message?.includes('querySrv') ?? false) ||
        errorObj.name === 'MongooseServerSelectionError'

      if (isTimeoutError && attempt < retries) {
        // Attendre avant de réessayer (backoff exponentiel)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
        console.warn(
          `[MongoDB] Connection timeout (attempt ${attempt}/${retries}). Retrying in ${delay}ms...`
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      // Si c'est la dernière tentative ou une erreur non-timeout, lancer l'erreur
      console.error('[MongoDB] Connection error:', error)
      const errorMessage = errorObj.message ?? String(error)
      throw new Error(
        `Failed to connect to MongoDB after ${attempt} attempts: ${errorMessage}`
      )
    }
  }

  throw new Error('Failed to connect to MongoDB: Maximum retries exceeded')
}
