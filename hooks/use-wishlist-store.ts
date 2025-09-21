'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  _id: string
  name: string
  slug: string
  price: number
  image: string
  countInStock: number
  brand: string
  category: string
}

interface WishlistState {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          // Vérifier si l'item existe déjà
          const exists = state.items.some(
            (existingItem) => existingItem._id === item._id
          )
          if (exists) {
            return state // Ne pas ajouter de doublons
          }
          return {
            items: [...state.items, item],
          }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        })),

      isInWishlist: (productId) => {
        const state = get()
        return state.items.some((item) => item._id === productId)
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
)
