import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import client from '@/lib/db/client'
import { verifyAdminAccess } from '@/lib/auth/admin-auth'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await verifyAdminAccess()
    if (!authResult.authorized) {
      console.warn(
        `🔒 Accès refusé à /api/admin/cleanup-database: ${authResult.error}`
      )
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    console.log(
      `🔓 Accès autorisé à /api/admin/cleanup-database pour l'utilisateur: ${authResult.user?.email}`
    )

    await connectToDatabase()
    const db = client.db()

    const results = {
      duplicatesRemoved: 0,
      orphanedRemoved: 0,
      timestamp: new Date().toISOString(),
    }

    // 1. Nettoyer les comptes dupliqués
    console.log('🧹 Nettoyage des comptes dupliqués...')

    const duplicateAccounts = await db
      .collection('accounts')
      .aggregate([
        {
          $group: {
            _id: '$providerAccountId',
            count: { $sum: 1 },
            accounts: { $push: '$_id' },
          },
        },
        {
          $match: {
            count: { $gt: 1 },
          },
        },
      ])
      .toArray()

    for (const duplicate of duplicateAccounts) {
      // Garder le premier compte, supprimer les autres
      const accountsToRemove = duplicate.accounts.slice(1)

      const result = await db.collection('accounts').deleteMany({
        _id: { $in: accountsToRemove },
      })

      results.duplicatesRemoved += result.deletedCount || 0
    }

    // 2. Nettoyer les comptes orphelins
    console.log('🧹 Nettoyage des comptes orphelins...')

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

    if (orphanedAccounts.length > 0) {
      const accountIds = orphanedAccounts.map((acc) => acc._id)
      const result = await db.collection('accounts').deleteMany({
        _id: { $in: accountIds },
      })

      results.orphanedRemoved = result.deletedCount || 0
    }

    console.log('✅ Nettoyage terminé:', results)

    return NextResponse.json({
      success: true,
      message: 'Nettoyage de la base de données terminé avec succès',
      results,
    })
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors du nettoyage de la base de données',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    )
  }
}
