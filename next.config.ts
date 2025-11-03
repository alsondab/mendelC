import type { NextConfig } from 'next'
import withNextIntl from 'next-intl/plugin'

const nextConfig: NextConfig = withNextIntl()({
  // ⚡ Optimization: Activer React Strict Mode pour meilleures performances
  reactStrictMode: true,
  // ⚡ Optimization: SWC minify est activé par défaut dans Next.js 15 (pas besoin de le configurer)

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
    // ⚡ Optimization: Formats modernes pour meilleure performance
    formats: ['image/avif', 'image/webp'],
    // Tailles optimisées pour différents devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // ⚡ Optimization: Augmenter le cache TTL pour réduire les requêtes (1 an = 31536000)
    minimumCacheTTL: 31536000,
  },

  // ⚡ Optimization: Optimiser les imports de packages volumineux
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      'recharts',
      'embla-carousel-react',
    ],
    // ⚡ Optimization: Activer optimizeCss avec critters pour extraire le CSS critique et réduire le render blocking
    // Critters est déjà installé dans package.json
    optimizeCss: true,
  },

  // ⚡ Optimization: Modulariser les imports pour réduire la taille des bundles
  modularizeImports: {
    'framer-motion': {
      transform: 'framer-motion/dist/es/{{member}}',
      skipDefaultConversion: true,
    },
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      skipDefaultConversion: true,
    },
  },

  // Optimize compiler
  compiler: {
    // ⚡ Optimization: Supprimer les console.log en production pour réduire la taille
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
  // ⚡ Optimization: Optimiser webpack pour production avec meilleur code splitting
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Production optimizations
      config.optimization = {
        ...config.optimization,
        // ⚡ Optimization: IDs détermininistes pour meilleur caching
        moduleIds: 'deterministic',
        // ⚡ Optimization: Runtime chunk séparé pour meilleur caching
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          // ⚡ Optimization: Réduire maxInitialRequests pour réduire la chaîne de dépendances critiques (20 au lieu de 25)
          maxInitialRequests: 20,
          maxAsyncRequests: 30,
          // ⚡ Optimization: Taille minimale pour éviter les micro-chunks inutiles (20 KB)
          minSize: 20000,
          // ⚡ Optimization: Seuil pour forcer le splitting des gros chunks (50 KB)
          enforceSizeThreshold: 50000,
          cacheGroups: {
            default: false,
            vendors: false,
            // ⚡ Optimization: Vendor chunk optimisé (réduire la taille)
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
              // ⚡ Optimization: Limiter la taille pour éviter les gros bundles (réduit de 200 KB à 150 KB)
              maxSize: 150000, // 150 KB
            },
            // ⚡ Optimization: Framer Motion dans un chunk séparé (lazy load)
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              priority: 20,
              reuseExistingChunk: true,
            },
            // ⚡ Optimization: Recharts dans un chunk séparé (admin seulement, lazy load)
            recharts: {
              test: /[\\/]node_modules[\\/]recharts[\\/]/,
              name: 'recharts',
              priority: 20,
              reuseExistingChunk: true,
            },
            // ⚡ Optimization: Radix UI dans un chunk séparé (composants UI)
            radixUI: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix-ui',
              priority: 15,
              reuseExistingChunk: true,
            },
            // ⚡ Optimization: Embla Carousel dans un chunk séparé (carousels)
            emblaCarousel: {
              test: /[\\/]node_modules[\\/]embla-carousel[\\/]/,
              name: 'embla-carousel',
              priority: 15,
              reuseExistingChunk: true,
            },
            // ⚡ Optimization: Common chunks pour code partagé
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
              // ⚡ Optimization: Limiter la taille des chunks communs
              maxSize: 200000, // 200 KB
            },
          },
        },
      }
    }
    return config
  },
  // ⚡ Optimization: Headers pour optimiser le cache des assets statiques
  async headers() {
    return [
      {
        // Cache pour toutes les images statiques
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache pour les icônes
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache pour les fichiers statiques Next.js
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache pour les fonts
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
})

export default nextConfig
