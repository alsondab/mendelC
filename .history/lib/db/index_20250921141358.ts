import mongoose from 'mongoose'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI
) => {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection')
    return cached.conn
  }

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

  console.log('🔄 Connecting to MongoDB...')
  
  try {
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      retryWrites: true,
      retryReads: true,
    })

    cached.conn = await cached.promise
    console.log('✅ MongoDB connected successfully')
    return cached.conn
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    cached.promise = null
    throw error
  }
}
