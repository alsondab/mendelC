'use server'

import { connectToDatabase } from '../db'
import StockHistory from '../db/models/stock-history.model'
import { formatError } from '../utils'
import { revalidateTag } from 'next/cache'

export interface StockHistoryEntry {
  _id: string
  productId: string
  productName: string
  movementType: 'sale' | 'adjustment' // 'restock' | 'return' | 'damage' | 'transfer' seront implémentés dans une prochaine version
  quantityBefore: number
  quantityAfter: number
  quantityChange: number
  reason?: string
  orderId?: string
  userId?: string | { name: string; email: string }
  createdAt: Date
  updatedAt: Date
}

/**
 * Enregistre un mouvement de stock dans l'historique
 * Ne bloque pas l'opération principale en cas d'erreur
 */
export async function recordStockMovement({
  productId,
  productName,
  movementType,
  quantityBefore,
  quantityAfter,
  reason,
  orderId,
  userId,
  metadata,
}: {
  productId: string
  productName: string
  movementType: 'sale' | 'adjustment' // 'restock' | 'return' | 'damage' | 'transfer' seront implémentés dans une prochaine version
  quantityBefore: number
  quantityAfter: number
  reason?: string
  orderId?: string
  userId?: string
  metadata?: Record<string, string>
}) {
  try {
    await connectToDatabase()

    const historyEntry = await StockHistory.create({
      productId,
      productName,
      movementType,
      quantityBefore,
      quantityAfter,
      quantityChange: quantityAfter - quantityBefore,
      reason,
      orderId,
      userId,
      metadata: metadata ? new Map(Object.entries(metadata)) : undefined,
    })

    // Invalider le cache de l'historique après enregistrement
    revalidateTag('stock-history')

    return {
      success: true,
      historyEntry: historyEntry.toObject(),
    }
  } catch (error) {
    // Ne pas bloquer l'opération principale en cas d'erreur d'historique
    console.error("Erreur lors de l'enregistrement de l'historique:", error)
    return { success: false, message: formatError(error) }
  }
}

/**
 * Récupère l'historique d'un produit spécifique
 */
export async function getProductStockHistory(
  productId: string,
  limit: number = 50
) {
  try {
    await connectToDatabase()

    const history = await StockHistory.find({ productId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email')
      .populate('orderId', 'orderNumber')
      .lean()

    const mappedHistory: StockHistoryEntry[] = history.map((entry) => {
      let userId: string | { name: string; email: string } | undefined =
        undefined
      if (entry.userId) {
        if (
          typeof entry.userId === 'object' &&
          'name' in entry.userId &&
          'email' in entry.userId
        ) {
          userId = {
            name: String(entry.userId.name),
            email: String(entry.userId.email),
          }
        } else {
          userId = String(entry.userId)
        }
      }

      return {
        _id: String(entry._id),
        productId: String(entry.productId),
        productName: String(entry.productName),
        movementType: entry.movementType as 'sale' | 'adjustment',
        quantityBefore: entry.quantityBefore,
        quantityAfter: entry.quantityAfter,
        quantityChange: entry.quantityChange,
        reason: entry.reason,
        orderId: entry.orderId
          ? typeof entry.orderId === 'object' && 'orderNumber' in entry.orderId
            ? String(entry.orderId.orderNumber)
            : String(entry.orderId)
          : undefined,
        userId,
        createdAt:
          entry.createdAt instanceof Date
            ? entry.createdAt
            : new Date(entry.createdAt),
        updatedAt:
          entry.updatedAt instanceof Date
            ? entry.updatedAt
            : new Date(entry.updatedAt),
      }
    })

    return {
      success: true,
      history: mappedHistory,
    }
  } catch (error) {
    return { success: false, message: formatError(error), history: [] }
  }
}

/**
 * Récupère l'historique global (tous produits)
 * Avec pagination et filtres optionnels
 */
export async function getAllStockHistory({
  page = 1,
  limit = 50,
  movementType,
  productId,
}: {
  page?: number
  limit?: number
  movementType?: string
  productId?: string
} = {}) {
  try {
    await connectToDatabase()

    const query: { movementType?: string; productId?: string } = {}
    if (movementType) query.movementType = movementType
    if (productId) query.productId = productId

    const skip = (page - 1) * limit

    const [history, total] = await Promise.all([
      StockHistory.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email')
        .populate('orderId', 'orderNumber')
        .populate('productId', 'name slug')
        .lean(),
      StockHistory.countDocuments(query),
    ])

    const mappedHistory: StockHistoryEntry[] = history.map((entry) => {
      let productId: string
      let productName: string

      if (
        entry.productId &&
        typeof entry.productId === 'object' &&
        '_id' in entry.productId
      ) {
        productId = String(entry.productId._id)
        productName =
          'name' in entry.productId
            ? String(entry.productId.name)
            : String(entry.productName)
      } else {
        productId = String(entry.productId)
        productName = String(entry.productName)
      }

      let userId: string | { name: string; email: string } | undefined =
        undefined
      if (entry.userId) {
        if (
          typeof entry.userId === 'object' &&
          'name' in entry.userId &&
          'email' in entry.userId
        ) {
          userId = {
            name: String(entry.userId.name),
            email: String(entry.userId.email),
          }
        } else {
          userId = String(entry.userId)
        }
      }

      return {
        _id: String(entry._id),
        productId,
        productName,
        movementType: entry.movementType as 'sale' | 'adjustment',
        quantityBefore: entry.quantityBefore,
        quantityAfter: entry.quantityAfter,
        quantityChange: entry.quantityChange,
        reason: entry.reason,
        orderId: entry.orderId
          ? typeof entry.orderId === 'object' && 'orderNumber' in entry.orderId
            ? String(entry.orderId.orderNumber)
            : String(entry.orderId)
          : undefined,
        userId,
        createdAt:
          entry.createdAt instanceof Date
            ? entry.createdAt
            : new Date(entry.createdAt),
        updatedAt:
          entry.updatedAt instanceof Date
            ? entry.updatedAt
            : new Date(entry.updatedAt),
      }
    })

    return {
      success: true,
      history: mappedHistory,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
      history: [],
      totalPages: 0,
      currentPage: page,
      total: 0,
    }
  }
}

/**
 * Récupère les statistiques de l'historique
 */
export async function getStockHistoryStatistics() {
  try {
    await connectToDatabase()

    const [totalMovements, movementsByType, recentMovements] =
      await Promise.all([
        StockHistory.countDocuments(),
        StockHistory.aggregate([
          {
            $group: {
              _id: '$movementType',
              count: { $sum: 1 },
              totalQuantity: { $sum: '$quantityChange' },
            },
          },
          { $sort: { count: -1 } },
        ]),
        StockHistory.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .populate('productId', 'name')
          .populate('userId', 'name email')
          .lean(),
      ])

    return {
      success: true,
      statistics: {
        totalMovements,
        movementsByType,
        recentMovements,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
      statistics: {
        totalMovements: 0,
        movementsByType: [],
        recentMovements: [],
      },
    }
  }
}
