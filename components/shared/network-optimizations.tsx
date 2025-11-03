'use client'

import { useEffect } from 'react'

export function NetworkOptimizations() {
  useEffect(() => {
    // Ajouter preconnect et dns-prefetch pour améliorer les performances réseau
    const preconnect = document.createElement('link')
    preconnect.rel = 'preconnect'
    preconnect.href = 'https://utfs.io'
    document.head.appendChild(preconnect)

    const dnsPrefetch = document.createElement('link')
    dnsPrefetch.rel = 'dns-prefetch'
    dnsPrefetch.href = 'https://utfs.io'
    document.head.appendChild(dnsPrefetch)

    return () => {
      document.head.removeChild(preconnect)
      document.head.removeChild(dnsPrefetch)
    }
  }, [])

  return null
}
