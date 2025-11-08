'use client'

import { useEffect } from 'react'

/**
 * ⚡ Optimization LCP: Preload de l'image LCP pour améliorer le Largest Contentful Paint
 * Ce composant ajoute un <link rel="preload"> dans le <head> pour précharger l'image critique
 */
export function LCPImagePreload({ imageUrl }: { imageUrl: string }) {
  useEffect(() => {
    // Vérifier si le preload existe déjà
    const existingPreload = document.querySelector(
      `link[rel="preload"][href="${imageUrl}"]`
    )

    if (!existingPreload && imageUrl) {
      const preloadLink = document.createElement('link')
      preloadLink.rel = 'preload'
      preloadLink.as = 'image'
      preloadLink.href = imageUrl
      preloadLink.setAttribute('fetchpriority', 'high')
      document.head.appendChild(preloadLink)

      return () => {
        // Cleanup lors du démontage
        const linkToRemove = document.querySelector(
          `link[rel="preload"][href="${imageUrl}"]`
        )
        if (linkToRemove) {
          document.head.removeChild(linkToRemove)
        }
      }
    }
  }, [imageUrl])

  return null
}

