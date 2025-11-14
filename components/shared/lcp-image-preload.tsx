'use client'

import { useEffect } from 'react'

/**
 * ⚡ Optimization: Preload LCP image component
 * Ajoute un <link rel="preload"> pour la première image du carousel (LCP)
 * pour améliorer le Largest Contentful Paint
 */
export function LCPImagePreload({ imageUrl }: { imageUrl: string | null }) {
  useEffect(() => {
    if (!imageUrl) return

    // Vérifier si le link existe déjà
    const existingLink = document.querySelector(
      `link[rel="preload"][as="image"][href="${imageUrl}"]`
    )
    if (existingLink) return

    // Créer et ajouter le link preload
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = imageUrl
    link.setAttribute('fetchPriority', 'high')
    document.head.appendChild(link)

    return () => {
      // Nettoyer le link lors du démontage
      const linkToRemove = document.querySelector(
        `link[rel="preload"][as="image"][href="${imageUrl}"]`
      )
      if (linkToRemove) {
        document.head.removeChild(linkToRemove)
      }
    }
  }, [imageUrl])

  return null
}
