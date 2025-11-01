'use client'

import { useEffect } from 'react'
import useCartSliderStore, { setWishlistStoreRef } from '@/hooks/use-cart-slider-store'
import { useWishlistSliderStore, setCartStoreRef } from '@/hooks/use-wishlist-slider-store'

/**
 * Composant qui initialise les références croisées entre les stores
 * pour permettre la fermeture mutuelle des sliders
 */
export default function SliderStoreInit() {
  const cartStore = useCartSliderStore()
  const wishlistStore = useWishlistSliderStore()

  useEffect(() => {
    // Enregistrer les références pour permettre la fermeture mutuelle
    setWishlistStoreRef(() => wishlistStore)
    setCartStoreRef(() => cartStore)
  }, [cartStore, wishlistStore])

  return null
}


