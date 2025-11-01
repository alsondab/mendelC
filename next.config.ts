import type { NextConfig } from 'next'
import withNextIntl from 'next-intl/plugin'

const nextConfig: NextConfig = withNextIntl()({
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
    // Permet de charger les images locales depuis /public
    unoptimized: process.env.NODE_ENV === 'development',
  },
})

export default nextConfig
