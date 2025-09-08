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
        const localItems = state.items.filter((item) =>
          item._id.startsWith('local_')
        )

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
                  items: state.items.map((i) =>
                    i._id === item._id ? updatedItem : i
                  ),
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
          items: state.items.filter((item) => !item._id.startsWith('local_')),
        }))
      },

      // Nettoyer les favoris orphelins (qui n'existent plus en BD)
      cleanupOrphanedItems: async () => {
        const state = get()
        const apiItems = state.items.filter(item => item._id.startsWith('api_'))
        
        if (apiItems.length === 0) return

        try {
          // Vérifier quels favoris existent encore en BD
          const response = await fetch('/api/wishlist/list')
          const data = await response.json()
          
          if (data.success) {
            const existingProductIds = new Set(data.wishlist.map((item: any) => item.product._id))
            
            // Supprimer les favoris qui n'existent plus en BD
            const validItems = state.items.filter(item => 
              item._id.startsWith('local_') || existingProductIds.has(item.product._id)
            )
            
            set({ items: validItems })
          }
        } catch (error) {
          console.error('Error cleaning up orphaned items:', error)
        }
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
