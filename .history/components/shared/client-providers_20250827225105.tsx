'use client'
import React from 'react'
import { ThemeProvider } from './theme-provider'
import { Toaster } from '../ui/toaster'
import AppInitializer from './app-initializer'
import ThemeInitializer from './theme-initializer'
import CartSidebarWrapper from './cart-sidebar-wrapper'
import { ClientSetting } from '@/types'

export default function ClientProviders({
  setting,
  children,
}: {
  setting: ClientSetting
  children: React.ReactNode
}) {
  return (
    <AppInitializer setting={setting}>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        <ThemeInitializer setting={setting} />
        <div className='min-h-screen'>
          {children}
        </div>
        <Toaster />
      </ThemeProvider>
    </AppInitializer>
  )
}
