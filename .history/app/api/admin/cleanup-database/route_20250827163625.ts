import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import client from '@/lib/db/client'

export async function POST() {
  try {
    // Vérifier l'authentification et les permissions admin
    // TODO: Ajouter la vérification des permissions admin

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
