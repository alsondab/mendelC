import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectToDatabase } from '@/lib/db'
import Wishlist from '@/lib/db/models/wishlist.model'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 })
    }

    await connectToDatabase()

    // First, clean up orphaned wishlist entries
    const wishlist = await Wishlist.find({ user: session.user.id }).populate({
      path: 'product',
      model: 'Product',
    })

    const orphanedIds = wishlist
      .filter((item) => item.product === null)
      .map((item) => item._id)

    if (orphanedIds.length > 0) {
      await Wishlist.deleteMany({ _id: { $in: orphanedIds } })
      console.log(`Cleaned up ${orphanedIds.length} orphaned wishlist entries`)
    }

    // Count only valid wishlist entries
    const count = await Wishlist.countDocuments({ user: session.user.id })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching wishlist count:', error)
    return NextResponse.json({ count: 0 })
  }
}
