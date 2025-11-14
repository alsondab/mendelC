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

import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const {
    site: { slogan, name, description, url, logo },
  } = await getSetting()

  const logoUrl = logo.startsWith('http') ? logo : `${url}${logo}`

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
    openGraph: {
      title: `${name}. ${slogan}`,
      description: description,
      url: url,
      siteName: name,
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
      type: 'website',
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name}. ${slogan}`,
      description: description,
      images: [logoUrl],
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
      <head>
        {/* ⚡ Optimization: Preconnect to third-party origins for faster resource loading */}
        <link rel="preconnect" href="https://utfs.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://utfs.io" />
      </head>
      <body
        className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased pb-16 md:pb-0`}
      >
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
