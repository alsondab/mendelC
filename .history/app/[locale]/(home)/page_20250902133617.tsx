import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import { HomeCard } from '@/components/shared/home/home-card'
import { HomeCarousel } from '@/components/shared/home/home-carousel'
import ProductSlider from '@/components/shared/product/product-slider'
import { Card, CardContent } from '@/components/ui/card'

import {
  getProductsForCard,
  getProductsByTag,
  getProductsByCategory,
} from '@/lib/actions/product.actions'
import { getCategoryTree } from '@/lib/actions/category.actions'
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
        <Card className='w-full rounded-none group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]'>
          <CardContent className='p-4 items-center gap-3 relative overflow-hidden'>
            {/* Effet de brillance animé */}
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out'></div>

            {/* Contenu avec animation d'entrée */}
            <div className='relative z-10 animate-fade-in-up'>
              <ProductSlider
                title={t('Best Selling Products')}
                products={bestSellingProducts}
                hideDetails
              />
            </div>

            {/* Particules flottantes */}
            <div className='absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-60'></div>
            <div className='absolute bottom-4 left-4 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40'></div>
            <div className='absolute top-1/2 right-8 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping opacity-30'></div>
          </CardContent>
        </Card>
      </div>

      <div className='p-4 bg-background'>
        <BrowsingHistoryList />
      </div>
    </>
  )
}
