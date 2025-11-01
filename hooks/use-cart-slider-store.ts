import { create } from 'zustand'

interface CartSliderStore {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

// Import dynamique pour éviter les dépendances circulaires
let getWishlistStore: (() => { close: () => void; isOpen: boolean }) | null = null

const useCartSliderStore = create<CartSliderStore>((set, get) => {
  // Fonction pour fermer le wishlist
  const closeWishlistIfOpen = () => {
    if (getWishlistStore) {
      const wishlistStore = getWishlistStore()
      if (wishlistStore?.isOpen) {
        wishlistStore.close()
      }
    }
  }

  return {
    isOpen: false,
    open: () => {
      closeWishlistIfOpen()
      set({ isOpen: true })
    },
    close: () => set({ isOpen: false }),
    toggle: () => {
      const currentState = get().isOpen
      const newState = !currentState
      
      // Si on ouvre le cart, fermer le wishlist
      if (newState) {
        closeWishlistIfOpen()
      }
      
      set({ isOpen: newState })
    },
  }
})

// Fonction pour enregistrer la référence au store wishlist
export const setWishlistStoreRef = (ref: () => { close: () => void; isOpen: boolean }) => {
  getWishlistStore = ref
}

export default useCartSliderStore

