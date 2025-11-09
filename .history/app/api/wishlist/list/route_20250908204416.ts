import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectToDatabase } from '@/lib/db'
import Wishlist from '@/lib/db/models/wishlist.model'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    await connectToDatabase()

    // Récupérer le sessionId pour les utilisateurs non connectés
    const sessionId = request.cookies.get('wishlist-session-id')?.value

    const wishlist = await Wishlist.find({
      $or: [{ user: session?.user?.id }, { sessionId: sessionId }],
    })
      .populate({
        path: 'product',
        model: 'Product',
      })
      .sort({ createdAt: -1 })

    // Clean up orphaned wishlist entries (products that no longer exist)
    const orphanedIds = wishlist
      .filter((item) => item.product === null)
      .map((item) => item._id)

    if (orphanedIds.length > 0) {
      await Wishlist.deleteMany({ _id: { $in: orphanedIds } })
      console.log(`Cleaned up ${orphanedIds.length} orphaned wishlist entries`)
    }

    // Convert MongoDB objects to plain JavaScript objects
    // Filter out items where product is null (deleted products)
    const plainWishlist = wishlist
      .filter((item) => item.product !== null) // Remove items with deleted products
      .map((item) => ({
        _id: item._id.toString(),
        user: item.user?.toString(),
        sessionId: item.sessionId,
        product: {
          _id: item.product._id.toString(),
          name: item.product.name,
          slug: item.product.slug,
          price: item.product.price,
          image:
            item.product.images && item.product.images.length > 0
              ? item.product.images[0]
              : '/placeholder-product.jpg',
          countInStock: item.product.countInStock,
        },
        createdAt: item.createdAt,
      }))

    return NextResponse.json({ success: true, wishlist: plainWishlist })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json({
      success: false,
      message: 'Une erreur est survenue',
      wishlist: [],
    })
  }
}
