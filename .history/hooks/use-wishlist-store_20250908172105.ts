'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  _id: string
  product: {
    _id: string
    name: string
    slug: string
    price: number
    image: string
    countInStock: number
  }
  createdAt: string
}

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  setItems: (items: WishlistItem[]) => void
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  setIsLoading: (loading: boolean) => void
  isInWishlist: (productId: string) => boolean
  syncWithDatabase: () => Promise<void>
  clearLocalItems: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      setItems: (items) => set({ items }),

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        })),

      setIsLoading: (isLoading) => set({ isLoading }),

      isInWishlist: (productId) => {
        const state = get()
        return state.items.some((item) => item.product._id === productId)
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)





