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

      syncWithDatabase: async () => {
        const state = get()
        const localItems = state.items.filter(item => item._id.startsWith('local_'))
        
        if (localItems.length === 0) return

        try {
          // Synchroniser chaque favori local avec la base de données
          for (const item of localItems) {
            try {
              const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: item.product._id }),
              })
              
              if (response.ok) {
                // Marquer l'item comme synchronisé
                const updatedItem = {
                  ...item,
                  _id: `api_${item.product._id}_${Date.now()}`,
                }
                
                // Remplacer l'item local par l'item synchronisé
                set((state) => ({
                  items: state.items.map(i => 
                    i._id === item._id ? updatedItem : i
                  )
                }))
              }
            } catch (error) {
              console.error('Error syncing item:', error)
            }
          }
        } catch (error) {
          console.error('Error syncing wishlist:', error)
        }
      },

      clearLocalItems: () => {
        set((state) => ({
          items: state.items.filter(item => !item._id.startsWith('local_'))
        }))
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)





