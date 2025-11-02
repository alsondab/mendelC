import { HomeCard } from '@/components/shared/home/home-card'
import { HomeCarousel } from '@/components/shared/home/home-carousel'
import ProductSlider from '@/components/shared/product/product-slider'
import { Card, CardContent } from '@/components/ui/card'

import {
  getCachedProductsForCard,
  getCachedProductsByTag,
} from '@/lib/cache/product-cache'
import { getCachedCategoryTree } from '@/lib/cache/category-cache'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('Home')
  const { carousels } = await getSetting()
  
  // Utiliser le cache pour tous les produits
  const [todaysDeals, bestSellingProducts, categories, newArrivals, featureds, bestSellers] = await Promise.all([
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
