/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Configuration pour les images
  images: {
    unoptimized: true, // Désactive l'optimisation automatique pour les images statiques
  },
}

module.exports = nextConfig
