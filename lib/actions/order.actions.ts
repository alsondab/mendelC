'use server'

import { Cart, IOrderList, OrderItem, ShippingAddress } from '@/types'
import { formatError } from '../utils'
import { connectToDatabase } from '../db'
import { auth } from '@/auth'
import { OrderInputSchema } from '../validator'
import Order, { IOrder } from '../db/models/order.model'
import { revalidatePath, revalidateTag } from 'next/cache'
import {
  sendAskReviewOrderItems,
  sendPurchaseReceipt,
  sendOrderConfirmation,
  sendOrderCancellationNotification,
} from '@/emails'
import { DateRange } from 'react-day-picker'
import Product from '../db/models/product.model'
import User from '../db/models/user.model'
import mongoose from 'mongoose'
import { getSetting } from './setting.actions'

// CREATE
export const createOrder = async (clientSideCart: Cart) => {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session) throw new Error('User not authenticated')
    // recalculate price and delivery date on the server
    const createdOrder = await createOrderFromCart(
      clientSideCart,
      session.user.id!
    )

    // Send confirmation email for Cash On Delivery orders
    if (
      clientSideCart.paymentMethod === 'Cash On Delivery' ||
      clientSideCart.paymentMethod === 'CashOnDelivery'
    ) {
      try {
        // Utiliser .lean() pour obtenir un objet JavaScript pur au lieu d'un Document Mongoose
        const populatedOrder = await Order.findById(createdOrder._id)
          .populate<{
            user: { email: string; name: string }
          }>('user', 'name email')
          .lean()

        if (!populatedOrder) {
          throw new Error('Order not found after creation')
        }

        // Utiliser l'email de l'adresse de livraison s'il est fourni, sinon utiliser l'email de l'utilisateur
        // Avec .lean(), shippingAddress est maintenant un objet JavaScript pur
        const shippingAddr = populatedOrder.shippingAddress as
          | { email?: string; [key: string]: unknown }
          | null
          | undefined

        // Extraire l'email de l'adresse de livraison
        let shippingEmail: string | undefined = undefined
        if (shippingAddr && typeof shippingAddr === 'object') {
          // Essayer plusieurs façons d'accéder à l'email
          if ('email' in shippingAddr) {
            const emailValue = shippingAddr.email
            if (typeof emailValue === 'string' && emailValue.trim() !== '') {
              shippingEmail = emailValue.trim()
            }
          }
        }

        // Extraire l'email de l'utilisateur
        const userEmail =
          populatedOrder.user && typeof populatedOrder.user === 'object'
            ? (populatedOrder.user as { email?: string })?.email
            : undefined

        const recipientEmail = shippingEmail || userEmail

        if (!recipientEmail) {
          // Créer un message d'erreur plus détaillé
          const debugInfo = {
            hasShippingAddress: !!shippingAddr,
            shippingAddressKeys: shippingAddr ? Object.keys(shippingAddr) : [],
            shippingEmailValue: shippingAddr?.email,
            hasUser: !!populatedOrder.user,
            userEmailValue: (populatedOrder.user as { email?: string })?.email,
          }
          throw new Error(
            `No email address found. Debug info: ${JSON.stringify(debugInfo)}`
          )
        }

        // Convertir en IOrder pour sendOrderConfirmation
        const orderForEmail = populatedOrder as unknown as IOrder
        await sendOrderConfirmation({ order: orderForEmail })
      } catch (error) {
        // Log error but don't fail the order creation
        // The error will be visible in server logs
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Unknown error sending confirmation email'
        // Return a warning in the response but still mark order as successful
        return {
          success: true,
          message: 'Commande passée avec succès',
          data: { orderId: createdOrder._id.toString() },
          warning: `Commande créée mais l'email de confirmation n'a pas pu être envoyé: ${errorMessage}`,
        }
      }
    }

    return {
      success: true,
      message: 'Commande passée avec succès',
      data: { orderId: createdOrder._id.toString() },
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
export const createOrderFromCart = async (
  clientSideCart: Cart,
  userId: string
) => {
  const cart = {
    ...clientSideCart,
    ...calcDeliveryDateAndPrice({
      items: clientSideCart.items,
      shippingAddress: clientSideCart.shippingAddress,
      deliveryDateIndex: clientSideCart.deliveryDateIndex,
    }),
  }

  // S'assurer que shippingAddress inclut l'email s'il est fourni
  // L'email peut être une chaîne vide, donc on vérifie qu'il n'est pas vide
  const shippingAddressWithEmail = cart.shippingAddress
    ? {
        ...cart.shippingAddress,
        ...(cart.shippingAddress.email &&
        typeof cart.shippingAddress.email === 'string' &&
        cart.shippingAddress.email.trim() !== ''
          ? { email: cart.shippingAddress.email.trim() }
          : {}),
      }
    : undefined

  const order = OrderInputSchema.parse({
    user: userId,
    items: cart.items,
    shippingAddress: shippingAddressWithEmail,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    totalPrice: cart.totalPrice,
    expectedDeliveryDate: cart.expectedDeliveryDate,
  })
  const createdOrder = await Order.create(order)

  // Vérifier que l'email est bien sauvegardé (pour débogage)
  if (shippingAddressWithEmail?.email) {
    const savedOrder = await Order.findById(createdOrder._id).lean()
    if (savedOrder?.shippingAddress) {
      const savedEmail = (savedOrder.shippingAddress as { email?: string })
        ?.email
      if (!savedEmail || savedEmail.trim() === '') {
        // L'email n'a pas été sauvegardé, mais on continue quand même
      }
    }
  }

  return createdOrder
}

export async function updateOrderToPaid(orderId: string) {
  try {
    await connectToDatabase()
    const order = await Order.findById(orderId).populate<{
      user: { email: string; name: string }
    }>('user', 'name email')
    if (!order) throw new Error('Commande non trouvée')
    if (order.isPaid) throw new Error('La commande est déjà payée')
    order.isPaid = true
    order.paidAt = new Date()
    await order.save()
    if (!process.env.MONGODB_URI?.startsWith('mongodb://localhost'))
      await updateProductStock(order._id)
    // Invalider tous les caches
    revalidateTag('stock')
    const { invalidateAdminOrdersCache } = await import('../cache/admin-cache')
    invalidateAdminOrdersCache()
    if (order.user && order.user.email) {
      try {
        await sendPurchaseReceipt({ order })
      } catch {
        // Don't fail the order update if email fails
      }
    }
    revalidatePath(`/account/orders/${orderId}`)
    return { success: true, message: 'Commande payée avec succès' }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}
const updateProductStock = async (orderId: string) => {
  const session = await mongoose.connection.startSession()

  try {
    session.startTransaction()
    const opts = { session }

    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { isPaid: true, paidAt: new Date() },
      opts
    )
    if (!order) throw new Error('Commande non trouvée')

    // Stocker les données avant modification pour l'historique
    const stockChanges: Array<{
      productId: string
      productName: string
      quantityBefore: number
      quantityAfter: number
      quantity: number
    }> = []

    for (const item of order.items) {
      const product = await Product.findById(item.product).session(session)
      if (!product) throw new Error('Product not found')

      const quantityBefore = product.countInStock
      product.countInStock -= item.quantity
      const quantityAfter = product.countInStock

      await Product.updateOne(
        { _id: product._id },
        { countInStock: product.countInStock },
        opts
      )

      // Stocker les données pour l'historique
      stockChanges.push({
        productId: product._id.toString(),
        productName: product.name,
        quantityBefore,
        quantityAfter,
        quantity: item.quantity,
      })
    }
    await session.commitTransaction()
    session.endSession()

    // Enregistrer dans l'historique pour chaque produit (en arrière-plan)
    const { recordStockMovement } = await import('./stock-history.actions')
    const { auth } = await import('@/auth')
    const sessionAuth = await auth()

    for (const change of stockChanges) {
      recordStockMovement({
        productId: change.productId,
        productName: change.productName,
        movementType: 'sale',
        quantityBefore: change.quantityBefore,
        quantityAfter: change.quantityAfter,
        orderId: orderId,
        reason: `Vente - Commande ${orderId}`,
        userId: sessionAuth?.user?.id,
        metadata: {
          orderId: orderId,
          quantity: change.quantity.toString(),
        },
      }).catch(() => {
        // Ignore history errors
      })
    }

    // Invalider le cache après la mise à jour du stock
    const { revalidateTag } = await import('next/cache')
    revalidateTag('stock')
    return true
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}
export async function deliverOrder(orderId: string) {
  try {
    await connectToDatabase()
    const order = await Order.findById(orderId).populate<{
      user: { email: string; name: string }
    }>('user', 'name email')
    if (!order) throw new Error('Commande non trouvée')
    if (!order.isPaid) throw new Error("La commande n'est pas payée")
    order.isDelivered = true
    order.deliveredAt = new Date()
    await order.save()
    // Invalider le cache des commandes
    const { invalidateAdminOrdersCache } = await import('../cache/admin-cache')
    invalidateAdminOrdersCache()

    // Envoyer l'email de demande d'avis (ne pas faire échouer la mise à jour si l'email échoue)
    if (order.user && order.user.email) {
      try {
        await sendAskReviewOrderItems({ order })
      } catch {
        // Ne pas faire échouer la mise à jour du statut si l'email échoue
      }
    }

    revalidatePath(`/account/orders/${orderId}`)
    return { success: true, message: 'Commande livrée avec succès' }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

export async function cancelOrder(orderId: string) {
  try {
    await connectToDatabase()
    const order = await Order.findById(orderId).populate<{
      user: { email: string; name: string }
    }>('user', 'name email')
    if (!order) throw new Error('Commande non trouvée')
    if (order.isDelivered)
      throw new Error("Impossible d'annuler une commande déjà livrée")
    if (order.isPaid)
      throw new Error("Impossible d'annuler une commande déjà payée")
    if (order.isCancelled) throw new Error('Cette commande est déjà annulée')

    // Envoyer un email de notification d'annulation
    if (order.user && order.user.email) {
      try {
        await sendOrderCancellationNotification({ order })
      } catch {
        // Don't fail the order cancellation if email fails
      }
    }

    // Marquer la commande comme annulée
    order.isCancelled = true
    order.cancelledAt = new Date()
    await order.save()
    // Invalider le cache des commandes
    const { invalidateAdminOrdersCache } = await import('../cache/admin-cache')
    invalidateAdminOrdersCache()
    revalidatePath(`/account/orders`)
    revalidatePath(`/account/orders/${orderId}`)
    revalidatePath(`/admin/orders`)
    return {
      success: true,
      message: 'Commande annulée avec succès. Redirection...',
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

// DELETE
export async function deleteOrder(id: string) {
  try {
    await connectToDatabase()
    const res = await Order.findByIdAndDelete(id)
    if (!res) throw new Error('Commande non trouvée')
    revalidatePath('/admin/orders')
    return {
      success: true,
      message: 'Commande supprimée avec succès',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// GET ALL ORDERS
// Utilise le cache si disponible
export async function getAllOrders({
  limit,
  page,
  useCache = false, // Désactivé par défaut pour éviter les problèmes côté client
}: {
  limit?: number
  page: number
  useCache?: boolean
}): Promise<{
  data: IOrderList[]
  totalPages: number
}> {
  // Utiliser le cache si activé et côté serveur uniquement
  if (useCache && typeof window === 'undefined') {
    try {
      const { getCachedAllOrders } = await import('../cache/admin-cache')
      return await getCachedAllOrders({ limit, page })
    } catch {
      // Fallback si cache échoue
    }
  }

  // Requête directe (pas de cache ou fallback)
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  await connectToDatabase()
  const skipAmount = (Number(page) - 1) * limit
  const orders = await Order.find()
    .populate('user', 'name')
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const ordersCount = await Order.countDocuments()
  return {
    data: JSON.parse(JSON.stringify(orders)) as IOrderList[],
    totalPages: Math.ceil(ordersCount / limit),
  }
}
export async function getMyOrders({
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
  const session = await auth()
  if (!session) {
    throw new Error('User is not authenticated')
  }
  const skipAmount = (Number(page) - 1) * limit
  const orders = await Order.find({
    user: session?.user?.id,
  })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const ordersCount = await Order.countDocuments({ user: session?.user?.id })

  return {
    data: JSON.parse(JSON.stringify(orders)),
    totalPages: Math.ceil(ordersCount / limit),
  }
}
export async function getOrderById(orderId: string): Promise<IOrder> {
  await connectToDatabase()
  const order = await Order.findById(orderId)
  return JSON.parse(JSON.stringify(order))
}

export const calcDeliveryDateAndPrice = async ({
  items,
  shippingAddress,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number
  items: OrderItem[]
  shippingAddress?: ShippingAddress
}) => {
  const { availableDeliveryDates } = await getSetting()

  // Calculer directement en CFA (devise par défaut)
  // item.price est déjà en CFA dans le panier (les prix dans la DB sont en CFA)
  // Donc on additionne directement sans conversion
  const itemsPriceCFA = Math.round(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  const deliveryDate =
    availableDeliveryDates[
      deliveryDateIndex === undefined
        ? availableDeliveryDates.length - 1
        : deliveryDateIndex
    ]

  // shippingPrice est stocké en CFA (devise par défaut)
  const shippingPrice =
    !shippingAddress || !deliveryDate
      ? undefined
      : deliveryDate.shippingPrice === 0
        ? 0
        : deliveryDate.shippingPrice

  // Calculer le total directement en CFA
  const totalPriceCFA =
    shippingPrice !== undefined ? itemsPriceCFA + shippingPrice : itemsPriceCFA

  // Retourner les prix en CFA (devise par défaut)
  return {
    availableDeliveryDates,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? availableDeliveryDates.length - 1
        : deliveryDateIndex,
    // Prix en CFA (devise par défaut) - tous les calculs se font en CFA
    itemsPrice: itemsPriceCFA,
    shippingPrice,
    totalPrice: totalPriceCFA,
  }
}

// GET ORDERS BY USER
export async function getOrderSummary(date: DateRange) {
  await connectToDatabase()

  const ordersCount = await Order.countDocuments({
    createdAt: {
      $gte: date.from,
      $lte: date.to,
    },
  })
  const productsCount = await Product.countDocuments({
    createdAt: {
      $gte: date.from,
      $lte: date.to,
    },
  })
  const usersCount = await User.countDocuments({
    createdAt: {
      $gte: date.from,
      $lte: date.to,
    },
  })

  const totalSalesResult = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
    { $project: { totalSales: { $ifNull: ['$sales', 0] } } },
  ])
  const totalSales = totalSalesResult[0] ? totalSalesResult[0].totalSales : 0

  const today = new Date()
  const sixMonthEarlierDate = new Date(
    today.getFullYear(),
    today.getMonth() - 5,
    1
  )
  const monthlySales = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: sixMonthEarlierDate,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        label: '$_id',
        value: '$totalSales',
      },
    },

    { $sort: { label: -1 } },
  ])
  const topSalesCategories = await getTopSalesCategories(date)
  const topSalesProducts = await getTopSalesProducts(date)

  const {
    common: { pageSize },
  } = await getSetting()
  const limit = pageSize
  const latestOrders = await Order.find()
    .populate('user', 'name')
    .sort({ createdAt: 'desc' })
    .limit(limit)
  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    monthlySales: JSON.parse(JSON.stringify(monthlySales)),
    salesChartData: JSON.parse(JSON.stringify(await getSalesChartData(date))),
    topSalesCategories: JSON.parse(JSON.stringify(topSalesCategories)),
    topSalesProducts: JSON.parse(JSON.stringify(topSalesProducts)),
    latestOrders: JSON.parse(JSON.stringify(latestOrders)) as IOrderList[],
  }
}

async function getSalesChartData(date: DateRange) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $concat: [
            { $toString: '$_id.year' },
            '/',
            { $toString: '$_id.month' },
            '/',
            { $toString: '$_id.day' },
          ],
        },
        totalSales: 1,
      },
    },
    { $sort: { date: 1 } },
  ])

  return result
}

async function getTopSalesProducts(date: DateRange) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    // Step 1: Unwind orderItems array
    { $unwind: '$items' },

    // Step 2: Group by productId to calculate total sales per product
    {
      $group: {
        _id: {
          name: '$items.name',
          image: '$items.image',
          _id: '$items.product',
        },
        totalSales: {
          $sum: { $multiply: ['$items.quantity', '$items.price'] },
        }, // Assume quantity field in orderItems represents units sold
      },
    },
    {
      $sort: {
        totalSales: -1,
      },
    },
    { $limit: 6 },

    // Step 3: Replace productInfo array with product name and format the output
    {
      $project: {
        _id: 0,
        id: '$_id._id',
        label: '$_id.name',
        image: '$_id.image',
        value: '$totalSales',
      },
    },

    // Step 4: Sort by totalSales in descending order
    { $sort: { _id: 1 } },
  ])

  return result
}

async function getTopSalesCategories(date: DateRange, limit = 5) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    // Step 1: Unwind orderItems array
    { $unwind: '$items' },
    // Step 2: Group by productId to calculate total sales per product
    {
      $group: {
        _id: '$items.category',
        totalSales: { $sum: '$items.quantity' }, // Assume quantity field in orderItems represents units sold
      },
    },
    // Step 3: Sort by totalSales in descending order
    { $sort: { totalSales: -1 } },
    // Step 4: Limit to top N products
    { $limit: limit },
  ])

  return result
}

export const getCompanyStats = async () => {
  try {
    await connectToDatabase()

    // Récupérer le nombre total de clients uniques
    const uniqueCustomers = await Order.aggregate([
      { $group: { _id: '$user' } },
      { $count: 'total' },
    ])

    // Récupérer le nombre total de commandes
    const totalOrders = await Order.countDocuments()

    // Récupérer le nombre total de produits
    const totalProducts = await Product.countDocuments({ isPublished: true })

    // Récupérer le montant total des ventes
    const totalSales = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ])

    return {
      totalCustomers: uniqueCustomers[0]?.total || 0,
      totalOrders: totalOrders,
      totalProducts: totalProducts,
      totalSales: totalSales[0]?.total || 0,
    }
  } catch {
    return {
      totalCustomers: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalSales: 0,
    }
  }
}

export async function hasUserPurchasedProduct({
  userId,
  productId,
}: {
  userId: string
  productId: string
}): Promise<boolean> {
  await connectToDatabase()

  const order = await Order.findOne({
    user: userId,
    'items.product': productId,
    isPaid: true, // Commande payée uniquement
    isCancelled: { $ne: true }, // Pas annulée
  })

  return !!order
}
