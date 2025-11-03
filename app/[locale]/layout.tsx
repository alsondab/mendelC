import React from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import ClientProviders from '@/components/shared/client-providers'
import { getDirection } from '@/i18n-config'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { getSetting } from '@/lib/actions/setting.actions'
import { cookies } from 'next/headers'
import {
  FloatingCartButton,
  MobileBottomNav,
} from '@/components/shared/layout-components'
import { NetworkOptimizations } from '@/components/shared/network-optimizations'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export async function generateMetadata() {
  const {
    site: { slogan, name, description, url, logo },
    carousels,
  } = await getSetting()

  // ⚡ Optimization: Obtenir la première image du carousel pour le preload LCP
  const firstCarouselImage =
    carousels && carousels.length > 0 && carousels[0]?.image
      ? carousels[0].image
      : null

  return {
    title: {
      template: `%s | ${name}`,
      default: `${name}. ${slogan}`,
    },
    description: description,
    metadataBase: new URL(url),
    icons: {
      icon: logo,
      shortcut: logo,
      apple: logo,
    },
    // ⚡ Optimization: Preconnects déplacés côté serveur pour meilleure performance (limite à 4)
    // Preconnects pour Google Fonts et UploadThing CDN
    other: {
      ...(firstCarouselImage && {
        'preload-image': firstCarouselImage,
      }),
    },
  }
}

export default async function AppLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>
  children: React.ReactNode
}) {
  const setting = await getSetting()
  const currencyCookie = (await cookies()).get('currency')
  const currency = currencyCookie
    ? currencyCookie.value
    : setting.defaultCurrency

  const { locale } = await params
  // Ensure that the incoming `locale` is valid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={getDirection(locale) === 'rtl' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <body
        className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased pb-16 md:pb-0`}
      >
        <NetworkOptimizations />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders setting={{ ...setting, currency }}>
            {children}
            <FloatingCartButton />
            <MobileBottomNav />
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
