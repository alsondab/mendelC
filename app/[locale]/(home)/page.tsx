import { HomeCard } from '@/components/shared/home/home-card'
import { Card, CardContent } from '@/components/ui/card'
import dynamic from 'next/dynamic'

import {
  getCachedProductsForCard,
  getCachedProductsByTag,
} from '@/lib/cache/product-cache'
import { getCachedCategoryTree } from '@/lib/cache/category-cache'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { LCPImagePreload } from '@/components/shared/lcp-image-preload'

// ⚡ Optimization: Lazy load HomeCarousel (contient Embla Carousel) pour réduire le bundle initial
const HomeCarousel = dynamic(
  () =>
    import('@/components/shared/home/home-carousel').then((mod) => ({
      default: mod.HomeCarousel,
    })),
  {
    // ⚡ Optimization: SSR activé pour meilleur SEO, le composant gère son propre lazy loading client
    ssr: true,
    loading: () => (
      // ⚡ Optimization: Skeleton avec dimensions fixes pour éviter CLS
      <div className="w-full aspect-[16/6] bg-muted animate-pulse flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Chargement...</span>
      </div>
    ),
  }
)

// ⚡ Optimization: Lazy load ProductSlider (contient Embla Carousel) pour réduire le bundle initial
const ProductSlider = dynamic(
  () => import('@/components/shared/product/product-slider'),
  {
    ssr: true, // ⚡ Optimization: SSR possible pour le contenu statique
    loading: () => (
      // ⚡ Optimization: Skeleton avec dimensions fixes pour éviter CLS
      <div className="w-full h-64 bg-muted animate-pulse flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Chargement...</span>
      </div>
    ),
  }
)

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getSetting()
  const baseUrl = setting.site.url
  const logoUrl = setting.site.logo.startsWith('http')
    ? setting.site.logo
    : `${baseUrl}${setting.site.logo}`

  // ⚡ Optimization: Preload LCP image (première image du carousel) pour améliorer LCP
  // L'image LCP est généralement la première image du carousel sur la page d'accueil
  const firstCarouselImage =
    setting.carousels &&
    setting.carousels.length > 0 &&
    setting.carousels[0].image
      ? setting.carousels[0].image.startsWith('http')
        ? setting.carousels[0].image
        : `${baseUrl}${setting.carousels[0].image}`
      : null

  return {
    title: setting.site.name,
    description: setting.site.description,
    keywords: setting.site.keywords?.split(',').map((k) => k.trim()) || [],
    openGraph: {
      title: `${setting.site.name}. ${setting.site.slogan}`,
      description: setting.site.description,
      url: baseUrl,
      siteName: setting.site.name,
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: setting.site.name,
        },
      ],
      type: 'website',
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${setting.site.name}. ${setting.site.slogan}`,
      description: setting.site.description,
      images: [logoUrl],
    },
    // ⚡ Optimization: Preload LCP image pour améliorer Largest Contentful Paint
    ...(firstCarouselImage && {
      other: {
        'preload-lcp-image': firstCarouselImage,
      },
    }),
  }
}

export default async function HomePage() {
  const t = await getTranslations('Home')
  const { carousels } = await getSetting()

  // Utiliser le cache pour tous les produits
  const [
    todaysDeals,
    bestSellingProducts,
    categories,
    newArrivals,
    featureds,
    bestSellers,
  ] = await Promise.all([
    getCachedProductsByTag({ tag: 'todays-deal' }),
    getCachedProductsByTag({ tag: 'best-seller' }),
    getCachedCategoryTree(),
    getCachedProductsForCard({ tag: 'new-arrival' }),
    getCachedProductsForCard({ tag: 'featured' }),
    getCachedProductsForCard({ tag: 'best-seller' }),
  ])

  const categoryCards = categories.slice(0, 4).map((category) => ({
    name: category.name,
    image: category.image || `/images/categories/${category.slug}.jpg`,
    href: `/search?category=${category.name}`,
  }))
  const cards = [
    {
      title: t('Categories to explore'),
      link: {
        text: t('See More'),
        href: '/search',
      },
      items: categoryCards, // ✅ Utiliser les nouvelles données
    },
    {
      title: t('Explore New Arrivals'),
      items: newArrivals,
      link: {
        text: t('View All'),
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: t('Discover Best Sellers'),
      items: bestSellers,
      link: {
        text: t('View All'),
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: t('Featured Products'),
      items: featureds,
      link: {
        text: t('Shop Now'),
        href: '/search?tag=new-arrival',
      },
    },
  ]

  // ⚡ Optimization: Preload LCP image (première image du carousel)
  const setting = await getSetting()
  const firstCarouselImage =
    carousels && carousels.length > 0 && carousels[0].image
      ? carousels[0].image.startsWith('http')
        ? carousels[0].image
        : `${setting.site.url}${carousels[0].image}`
      : null

  return (
    <>
      {/* ⚡ Optimization: Preload LCP image pour améliorer Largest Contentful Paint */}
      <LCPImagePreload imageUrl={firstCarouselImage} />
      <HomeCarousel items={carousels} />
      <div className="md:p-4 md:space-y-4 bg-border">
        <HomeCard cards={cards} />
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6">
            <ProductSlider title={t("Today's Deals")} products={todaysDeals} />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6">
            <ProductSlider
              title={t('Best Selling Products')}
              products={bestSellingProducts}
              hideDetails
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
