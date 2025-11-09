import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'
import { getWebPageBySlug } from '@/lib/actions/web-page.actions'
import { getCompanyStats } from '@/lib/actions/order.actions'
import { formatCurrency } from '@/lib/utils'
import { Users, ShoppingCart, Package, DollarSign } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params

  const { slug } = params

  const webPage = await getWebPageBySlug(slug)
  if (!webPage) {
    return { title: 'Web page not found' }
  }
  return {
    title: webPage.title,
  }
}

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string; color: string; size: string }>
}) {
  const params = await props.params
  const { slug } = params
  const webPage = await getWebPageBySlug(slug)

  if (!webPage) notFound()

  // Récupérer les traductions
  const t = await getTranslations('About')

  // Récupérer les statistiques de l'entreprise
  const stats = await getCompanyStats()

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="h1-bold py-4 text-center">{webPage.title}</h1>

      {/* Section Nos Chiffres */}
      {slug === 'about-us' && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t('Our Numbers')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Clients */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">
                {stats.totalCustomers.toLocaleString()}
              </h3>
              <p className="text-gray-600 font-medium">
                {t('Satisfied Customers')}
              </p>
            </div>

            {/* Commandes */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                {stats.totalOrders.toLocaleString()}
              </h3>
              <p className="text-gray-600 font-medium">
                {t('Orders Processed')}
              </p>
            </div>

            {/* Produits */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">
                {stats.totalProducts.toLocaleString()}
              </h3>
              <p className="text-gray-600 font-medium">
                {t('Available Products')}
              </p>
            </div>

            {/* Ventes */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-orange-600 mb-2">
                {formatCurrency(stats.totalSales)}
              </h3>
              <p className="text-gray-600 font-medium">{t('Revenue')}</p>
            </div>
          </div>
        </section>
      )}

      {/* Contenu de la page */}
      <section className="text-justify text-lg mb-20 web-page-content">
        <ReactMarkdown>{webPage.content}</ReactMarkdown>
      </section>
    </div>
  )
}
