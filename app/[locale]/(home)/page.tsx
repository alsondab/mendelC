import { HomeCard } from '@/components/shared/home/home-card'
import { Card, CardContent } from '@/components/ui/card'
import dynamic from 'next/dynamic'
// ⚡ Optimization LCP: Import direct du HomeCarousel pour éviter le lazy-load qui retarde le LCP
import { HomeCarousel } from '@/components/shared/home/home-carousel'
import { LCPImagePreload } from '@/components/shared/lcp-image-preload'

import {
  getCachedProductsForCard,
  getCachedProductsByTag,
} from '@/lib/cache/product-cache'
import { getCachedCategoryTree } from '@/lib/cache/category-cache'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

// ⚡ Optimization LCP: Générer metadata avec preload de l'image LCP
export async function generateMetadata(): Promise<Metadata> {
  const { carousels } = await getSetting()
  const firstCarouselImage =
    carousels && carousels.length > 0 && carousels[0]?.image
      ? carousels[0].image
      : null

  return {
    other: {
      ...(firstCarouselImage && {
        'preload-image': firstCarouselImage,
      }),
    },
  }
}

// ⚡ Optimization: Lazy load ProductSlider (contient Embla Carousel) pour réduire le bundle initial
const ProductSlider = dynamic(
  () => import('@/components/shared/product/product-slider'),
  {
    ssr: true, // ⚡ Optimization: SSR possible pour le contenu statique
    loading: () => (
      <div className='w-full h-64 bg-muted animate-pulse flex items-center justify-center'>
        <span className='text-muted-foreground'>Chargement...</span>
      </div>
    ),
  }
)

export default async function HomePage() {
  const t = await getTranslations('Home')
  const { carousels } = await getSetting()

  // ⚡ Optimization LCP: Obtenir la première image du carousel pour le preload
  const firstCarouselImage =
    carousels && carousels.length > 0 && carousels[0]?.image
      ? carousels[0].image
      : null

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

  return (
    <>
      {/* ⚡ Optimization LCP: Preload de l'image du carousel via composant client */}
      {firstCarouselImage && (
        <LCPImagePreload imageUrl={firstCarouselImage} />
      )}
      <HomeCarousel items={carousels} />
      <div className='md:p-4 md:space-y-4 bg-border'>
        <HomeCard cards={cards} />
        <Card className='w-full'>
          <CardContent className='p-4 sm:p-6'>
            <ProductSlider title={t("Today's Deals")} products={todaysDeals} />
          </CardContent>
        </Card>
        <Card className='w-full'>
          <CardContent className='p-4 sm:p-6'>
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
