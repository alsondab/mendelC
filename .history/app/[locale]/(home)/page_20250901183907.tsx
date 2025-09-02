import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import { HomeCard } from '@/components/shared/home/home-card'
import { HomeCarousel } from '@/components/shared/home/home-carousel'
import ProductSlider from '@/components/shared/product/product-slider'
import { Card, CardContent } from '@/components/ui/card'

import {
  getProductsForCard,
  getProductsByTag,
  getAllCategories,
  getProductsByCategory,
} from '@/lib/actions/product.actions'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('Home')
  const { carousels } = await getSetting()
  const todaysDeals = await getProductsByTag({ tag: 'todays-deal' })
  const bestSellingProducts = await getProductsByTag({ tag: 'best-seller' })

  const categories = (await getAllCategories()).slice(0, 4)

  // ✅ Images automatiques : utiliser les images des produits de chaque catégorie
  const categoryCards = await Promise.all(
    categories.map(async (category) => {
      // Récupérer le premier produit de cette catégorie
      const categoryProduct = await getProductsByCategory({
        category,
        limit: 1,
      })

      return {
        name: category,
        // ✅ Image automatique : produit OU fallback intelligent
        image:
          categoryProduct[0]?.images?.[0] ||
          `/images/${category.toLowerCase().replace(/\s+/g, '-')}.jpg`,
        href: `/search?category=${category}`,
      }
    })
  )

  const newArrivals = await getProductsForCard({
    tag: 'new-arrival',
  })
  const featureds = await getProductsForCard({
    tag: 'featured',
  })
  const bestSellers = await getProductsForCard({
    tag: 'best-seller',
  })
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
        <Card className='w-full rounded-2xl shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-background to-muted/20 border border-primary/10'>
          <CardContent className='p-6'>
            <ProductSlider title={t("Today's Deals")} products={todaysDeals} />
          </CardContent>
        </Card>
        <Card className='w-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200/50 overflow-hidden'>
          <CardContent className='p-6 relative'>
            {/* Background decoration */}
            <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/10 to-red-200/10 rounded-full -translate-y-16 translate-x-16'></div>
            <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-100/15 to-red-100/15 rounded-full translate-y-12 -translate-x-12'></div>

            {/* Animated title section */}
            <div className='relative z-10 mb-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg'>
                    <span className='text-white text-sm font-bold'>🔥</span>
                  </div>
                  <h2 className='text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent'>
                    {t('Best Selling Products')}
                  </h2>
                </div>
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 rounded-full bg-orange-500 animate-pulse'></div>
                  <span className='text-sm text-slate-600 font-medium'>
                    {bestSellingProducts.length} produits
                  </span>
                </div>
              </div>
            </div>

            <ProductSlider
              title=''
              products={bestSellingProducts}
              hideDetails
            />
          </CardContent>
        </Card>
      </div>

      <div className='p-4 bg-background'>
        <BrowsingHistoryList />
      </div>
    </>
  )
}
