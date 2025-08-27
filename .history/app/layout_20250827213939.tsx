import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MendelCorp',
  description: 'An Amazon clone built with Next.js and MongoDB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='e'>
      <body>{children}</body>
    </html>
  )
}
