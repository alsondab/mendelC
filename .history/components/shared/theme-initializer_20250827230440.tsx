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
    const savedTheme = localStorage.getItem('theme')
    if (!savedTheme) {
      setTheme(setting.common.defaultTheme.toLowerCase())
    }
  }, [setting.common.defaultTheme, setTheme])

  return null
}
