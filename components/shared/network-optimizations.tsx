'use client'

import { useEffect } from 'react'
import useSettingStore from '@/hooks/use-setting-store'

/**
 * ⚡ Optimization: Composant pour optimisations réseau (preconnects, preloads)
 * 
 * Note: Les preconnects statiques sont ajoutés ici car Next.js App Router
 * ne permet pas d'ajouter directement des <link> dans le <head> via Server Components.
 * Ce composant s'exécute immédiatement après le montage pour minimiser l'impact.
 */
export function NetworkOptimizations() {
  const { setting } = useSettingStore()

  useEffect(() => {
    // ⚡ Optimization: Preconnects statiques ajoutés immédiatement (une seule fois)
    // Ces preconnects sont critiques et doivent être ajoutés le plus tôt possible
    const preconnectGoogleFonts = document.createElement('link')
    preconnectGoogleFonts.rel = 'preconnect'
    preconnectGoogleFonts.href = 'https://fonts.googleapis.com'
    if (!document.querySelector('link[href="https://fonts.googleapis.com"]')) {
      document.head.appendChild(preconnectGoogleFonts)
    }

    const preconnectGoogleFontsStatic = document.createElement('link')
    preconnectGoogleFontsStatic.rel = 'preconnect'
    preconnectGoogleFontsStatic.href = 'https://fonts.gstatic.com'
    preconnectGoogleFontsStatic.crossOrigin = 'anonymous'
    if (!document.querySelector('link[href="https://fonts.gstatic.com"]')) {
      document.head.appendChild(preconnectGoogleFontsStatic)
    }

    // ⚡ Optimization: Preconnect et dns-prefetch pour UploadThing CDN
    const preconnectUtfs = document.createElement('link')
    preconnectUtfs.rel = 'preconnect'
    preconnectUtfs.href = 'https://utfs.io'
    if (!document.querySelector('link[href="https://utfs.io"][rel="preconnect"]')) {
      document.head.appendChild(preconnectUtfs)
    }

    const dnsPrefetchUtfs = document.createElement('link')
    dnsPrefetchUtfs.rel = 'dns-prefetch'
    dnsPrefetchUtfs.href = 'https://utfs.io'
    if (!document.querySelector('link[href="https://utfs.io"][rel="dns-prefetch"]')) {
      document.head.appendChild(dnsPrefetchUtfs)
    }

    // ⚡ Optimization: Preload de l'image LCP (première image du carousel) - dynamique
    const firstCarouselImage =
      setting?.carousels &&
      setting.carousels.length > 0 &&
      setting.carousels[0]?.image
        ? setting.carousels[0].image
        : null

    if (firstCarouselImage) {
      const existingPreload = document.querySelector(
        `link[href="${firstCarouselImage}"][rel="preload"]`
      )
      if (!existingPreload) {
        const preloadImage = document.createElement('link')
        preloadImage.rel = 'preload'
        preloadImage.as = 'image'
        preloadImage.href = firstCarouselImage
        preloadImage.setAttribute('fetchpriority', 'high')
        document.head.appendChild(preloadImage)
      }
    }

    // Note: Pas de cleanup nécessaire car ces liens doivent rester dans le head
  }, [setting?.carousels]) // ⚡ Optimization: Re-run seulement si les carousels changent

  return null
}
