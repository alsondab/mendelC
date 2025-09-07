'use server'

import { connectToDatabase } from '@/lib/db'
import Wishlist from '@/lib/db/models/wishlist.model'
import Product from '@/lib/db/models/product.model'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function addToWishlist(productId: string) {
  try {
    await connectToDatabase()
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Utilisateur non connecté')
    }

    // Vérifier si le produit existe
    const product = await Product.findById(productId)
    if (!product) {
      throw new Error('Produit non trouvé')
    }

    // Vérifier si déjà en favoris
    const existingWishlist = await Wishlist.findOne({
      user: session.user.id,
      product: productId,
    })

    if (existingWishlist) {
      throw new Error('Produit déjà en favoris')
    }

    // Ajouter aux favoris
    await Wishlist.create({
      user: session.user.id,
      product: productId,
    })

    revalidatePath('/wishlist')
    revalidatePath('/')

    return { success: true, message: 'Produit ajouté aux favoris' }
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Une erreur est survenue',
    }
  }
}

export async function removeFromWishlist(productId: string) {
  try {
    await connectToDatabase()
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Utilisateur non connecté')
    }

    // Supprimer des favoris
    const result = await Wishlist.findOneAndDelete({
      user: session.user.id,
      product: productId,
    })

    if (!result) {
      throw new Error('Produit non trouvé dans les favoris')
    }

    revalidatePath('/wishlist')
    revalidatePath('/')

    return { success: true, message: 'Produit supprimé des favoris' }
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Une erreur est survenue',
    }
  }
}

export async function getUserWishlist() {
  try {
    await connectToDatabase()
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Utilisateur non connecté',
        wishlist: [],
      }
    }

    const wishlist = await Wishlist.find({ user: session.user.id })
      .populate({
        path: 'product',
        model: 'Product',
      })
      .sort({ createdAt: -1 })

    // Convert MongoDB objects to plain JavaScript objects
    const plainWishlist = wishlist.map((item) => ({
      _id: item._id.toString(),
      user: item.user.toString(),
      product: {
        _id: item.product._id.toString(),
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        image: item.product.image,
        countInStock: item.product.countInStock,
      },
      createdAt: item.createdAt,
    }))

    return { success: true, wishlist: plainWishlist }
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Une erreur est survenue',
      wishlist: [],
    }
  }
}

export async function isInWishlist(productId: string) {
  try {
    await connectToDatabase()
    const session = await auth()

    if (!session?.user?.id) {
      return false
    }

    const wishlistItem = await Wishlist.findOne({
      user: session.user.id,
      product: productId,
    })

    return !!wishlistItem
  } catch {
    return false
  }
}
