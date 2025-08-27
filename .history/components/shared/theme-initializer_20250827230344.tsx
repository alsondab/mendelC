'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { ClientSetting } from '@/types'

interface ThemeInitializerProps {
  setting: ClientSetting
}

export default function ThemeInitializer({ setting }: ThemeInitializerProps) {
  const { setTheme } = useTheme()

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (!savedTheme) {
        setTheme(setting.common.defaultTheme.toLowerCase())
      }
    }
  }, [setting.common.defaultTheme, setTheme])

  return null
}
