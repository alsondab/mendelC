'use client'
import React from 'react'
import CartSidebar from './cart-sidebar'
import WishlistSidebar from './wishlist-sidebar'
import SliderAutoOpener from './slider-auto-opener'
import SliderStoreInit from './slider-store-init'
import { ThemeProvider } from './theme-provider'
import { Toaster } from '../ui/toaster'
import AppInitializer from './app-initializer'
import { ClientSetting } from '@/types'
import { SessionProvider } from 'next-auth/react'

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
          <CartSidebar />
          <WishlistSidebar />
          <Toaster />
        </ThemeProvider>
      </AppInitializer>
    </SessionProvider>
  )
}
