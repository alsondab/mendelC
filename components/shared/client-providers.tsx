'use client'
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import SliderAutoOpener from './slider-auto-opener'
import SliderStoreInit from './slider-store-init'
import { ThemeProvider } from './theme-provider'
import { Toaster } from '../ui/toaster'
import AppInitializer from './app-initializer'
import { ClientSetting } from '@/types'
import { SessionProvider } from 'next-auth/react'

// Lazy load sliders only when needed (reduces initial bundle by ~50KB)
const CartSidebar = dynamic(() => import('./cart-sidebar'), {
  ssr: false,
})

const WishlistSidebar = dynamic(() => import('./wishlist-sidebar'), {
  ssr: false,
})

export default function ClientProviders({
  setting,
  children,
}: {
  setting: ClientSetting
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AppInitializer setting={setting}>
        <ThemeProvider
          attribute='class'
          defaultTheme={setting.common.defaultTheme.toLocaleLowerCase()}
        >
          <SliderStoreInit />
          <SliderAutoOpener />
          {children}
          {/* Les sliders gèrent leur propre overlay et animations */}
          <Suspense fallback={null}>
            <CartSidebar />
            <WishlistSidebar />
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </AppInitializer>
    </SessionProvider>
  )
}
