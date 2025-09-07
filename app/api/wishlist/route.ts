import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectToDatabase } from '@/lib/db'
import Wishlist from '@/lib/db/models/wishlist.model'
import Product from '@/lib/db/models/product.model'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        message: 'Utilisateur non connecté',
      })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ success: false, message: 'ID produit requis' })
    }

    await connectToDatabase()

    const wishlistItem = await Wishlist.findOne({
      user: session.user.id,
      product: productId,
    })

    return NextResponse.json({ success: true, isInWishlist: !!wishlistItem })
  } catch (error) {
    console.error('Error checking wishlist status:', error)
    return NextResponse.json({
      success: false,
      message: 'Une erreur est survenue',
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        message: 'Utilisateur non connecté',
      })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ success: false, message: 'ID produit requis' })
    }

    await connectToDatabase()

    // Vérifier si le produit existe
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'Produit non trouvé',
      })
    }

    // Vérifier si déjà en favoris
    const existingWishlist = await Wishlist.findOne({
      user: session.user.id,
      product: productId,
    })

    if (existingWishlist) {
      return NextResponse.json({
        success: false,
        message: 'Ce produit est déjà dans vos favoris',
      })
    }

    // Ajouter aux favoris
    await Wishlist.create({
      user: session.user.id,
      product: productId,
    })

    return NextResponse.json({
      success: true,
      message: 'Produit ajouté aux favoris',
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json({
      success: false,
      message: 'Une erreur est survenue',
    })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        message: 'Utilisateur non connecté',
      })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ success: false, message: 'ID produit requis' })
    }

    await connectToDatabase()

    // Supprimer des favoris
    const result = await Wishlist.findOneAndDelete({
      user: session.user.id,
      product: productId,
    })

    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'Produit non trouvé dans les favoris',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Produit supprimé des favoris',
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json({
      success: false,
      message: 'Une erreur est survenue',
    })
  }
}
