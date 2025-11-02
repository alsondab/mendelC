'use client'

import dynamic from 'next/dynamic'

// 🚀 Lazy load des composants lourds - chargés uniquement quand nécessaire
export const FloatingCartButton = dynamic(
  () => import('./header/floating-cart-button'),
  {
    ssr: false,
    loading: () => null,
  }
)

export const MobileBottomNav = dynamic(() => import('./mobile-bottom-nav'), {
  ssr: false,
  loading: () => null,
})
