'use client'

import React from 'react'
import { ThemeProvider } from './theme-provider'
import { Toaster } from '../ui/toaster'
import AppInitializer from './app-initializer'
import ThemeInitializer from './theme-initializer'
import { ClientSetting } from '@/types'

export default function ClientFeatures({
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
        {children}
        <Toaster />
      </ThemeProvider>
    </AppInitializer>
  )
}
