import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import client from '@/lib/db/client'
import { verifyAdminAccess } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await verifyAdminAccess(request)
    if (!authResult.authorized) {
      console.warn(`🔒 Accès refusé à /api/admin/database-health: ${authResult.error}`)
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }
    
    console.log(`🔓 Accès autorisé à /api/admin/database-health pour l'utilisateur: ${authResult.user?.email}`)

    await connectToDatabase()
    const db = client.db()

    // Compter les utilisateurs
    const usersCount = await db.collection('users').countDocuments()

    // Compter les comptes OAuth
    const accountsCount = await db.collection('accounts').countDocuments()

    // Trouver les comptes dupliqués
    const duplicateAccounts = await db
      .collection('accounts')
      .aggregate([
        {
          $group: {
            _id: '$providerAccountId',
            count: { $sum: 1 },
          },
        },
        {
          $match: {
            count: { $gt: 1 },
          },
        },
      ])
      .toArray()

    const duplicateCount = duplicateAccounts.reduce((total, group) => {
      return total + (group.count - 1) // -1 car on garde un compte par groupe
    }, 0)

    // Trouver les comptes orphelins
    const orphanedAccounts = await db
      .collection('accounts')
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $match: {
            user: { $size: 0 },
          },
        },
      ])
      .toArray()

    const orphanedCount = orphanedAccounts.length

    const stats = {
      users: usersCount,
      accounts: accountsCount,
      duplicateAccounts: duplicateCount,
      orphanedAccounts: orphanedCount,
      lastCheck: new Date().toISOString(),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
