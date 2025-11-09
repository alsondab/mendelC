'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import useCartSliderStore from '@/hooks/use-cart-slider-store'
import { useWishlistSliderStore } from '@/hooks/use-wishlist-slider-store'

export default function SliderAutoOpener() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { open: openCart } = useCartSliderStore()
  const { open: openWishlist } = useWishlistSliderStore()

  useEffect(() => {
    const openCartParam = searchParams.get('openCart')
    const openWishlistParam = searchParams.get('openWishlist')

    // Si les deux sont présents, ouvrir les deux et nettoyer
    if (openCartParam === 'true' && openWishlistParam === 'true') {
      openCart()
      openWishlist()
      router.replace(window.location.pathname)
      return
    }

    if (openCartParam === 'true') {
      openCart()
      // Nettoyer l'URL
      router.replace(window.location.pathname)
    }

    if (openWishlistParam === 'true') {
      openWishlist()
      // Nettoyer l'URL
      router.replace(window.location.pathname)
    }
  }, [searchParams, router, openCart, openWishlist])

  return null
}
