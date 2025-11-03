'use client'

import { useEffect } from 'react'
import useSettingStore from '@/hooks/use-setting-store'

export function NetworkOptimizations() {
  const { setting } = useSettingStore()

  useEffect(() => {
    // ⚡ Optimization: Preconnect pour Google Fonts
    const preconnectGoogleFonts = document.createElement('link')
    preconnectGoogleFonts.rel = 'preconnect'
    preconnectGoogleFonts.href = 'https://fonts.googleapis.com'
    document.head.appendChild(preconnectGoogleFonts)

    const preconnectGoogleFontsStatic = document.createElement('link')
    preconnectGoogleFontsStatic.rel = 'preconnect'
    preconnectGoogleFontsStatic.href = 'https://fonts.gstatic.com'
    preconnectGoogleFontsStatic.crossOrigin = 'anonymous'
    document.head.appendChild(preconnectGoogleFontsStatic)

    // ⚡ Optimization: Preconnect et dns-prefetch pour UploadThing CDN
    const preconnectUtfs = document.createElement('link')
    preconnectUtfs.rel = 'preconnect'
    preconnectUtfs.href = 'https://utfs.io'
    document.head.appendChild(preconnectUtfs)

    const dnsPrefetchUtfs = document.createElement('link')
    dnsPrefetchUtfs.rel = 'dns-prefetch'
    dnsPrefetchUtfs.href = 'https://utfs.io'
    document.head.appendChild(dnsPrefetchUtfs)

    // ⚡ Optimization: Preload de l'image LCP (première image du carousel)
    const firstCarouselImage =
      setting?.carousels &&
      setting.carousels.length > 0 &&
      setting.carousels[0]?.image
        ? setting.carousels[0].image
        : null

    if (firstCarouselImage) {
      const preloadImage = document.createElement('link')
      preloadImage.rel = 'preload'
      preloadImage.as = 'image'
      preloadImage.href = firstCarouselImage
      preloadImage.setAttribute('fetchpriority', 'high')
      document.head.appendChild(preloadImage)
    }

    return () => {
      // Cleanup lors du démontage
      document.head.removeChild(preconnectGoogleFonts)
      document.head.removeChild(preconnectGoogleFontsStatic)
      document.head.removeChild(preconnectUtfs)
      document.head.removeChild(dnsPrefetchUtfs)
      if (firstCarouselImage) {
        const existingPreload = document.querySelector(
          `link[href="${firstCarouselImage}"]`
        )
        if (existingPreload) {
          document.head.removeChild(existingPreload)
        }
      }
    }
  }, [setting?.carousels])

  return null
}
