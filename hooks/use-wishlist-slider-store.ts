import { create } from 'zustand'

interface WishlistSliderStore {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

// Import dynamique pour éviter les dépendances circulaires
let getCartStore: (() => { close: () => void; isOpen: boolean }) | null = null

const useWishlistSliderStore = create<WishlistSliderStore>((set, get) => {
  // Fonction pour fermer le cart
  const closeCartIfOpen = () => {
    if (getCartStore) {
      const cartStore = getCartStore()
      if (cartStore?.isOpen) {
        cartStore.close()
      }
    }
  }

  return {
    isOpen: false,
    open: () => {
      closeCartIfOpen()
      set({ isOpen: true })
    },
    close: () => set({ isOpen: false }),
    toggle: () => {
      const currentState = get().isOpen
      const newState = !currentState
      
      // Si on ouvre le wishlist, fermer le cart
      if (newState) {
        closeCartIfOpen()
      }
      
      set({ isOpen: newState })
    },
  }
})

// Fonction pour enregistrer la référence au store cart
export const setCartStoreRef = (ref: () => { close: () => void; isOpen: boolean }) => {
  getCartStore = ref
}

export { useWishlistSliderStore }

