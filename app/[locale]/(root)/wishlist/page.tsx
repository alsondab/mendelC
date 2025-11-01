'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WishlistPage() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers home avec le query param pour ouvrir le slider
    router.replace('/?openWishlist=true')
  }, [router])

  // Afficher un loader pendant la redirection
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Chargement des favoris...</p>
      </div>
    </div>
  )
}
