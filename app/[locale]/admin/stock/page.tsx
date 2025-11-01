import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  getCachedLowStockProducts,
  getCachedOutOfStockProducts,
  getCachedStockStatistics,
} from '@/lib/cache/stock-cache'
import { StockStatus } from '@/components/shared/product/stock-status'
import { StockAlerts } from '@/components/shared/notifications/stock-alerts'
import { RefreshStockButton } from '@/components/shared/notifications/refresh-stock-button'
import { StockThresholdConfig } from '@/components/shared/notifications/stock-threshold-config'
import { StockGauge } from '@/components/shared/notifications/stock-gauge'
import { GlobalStockThresholdsConfig } from '@/components/shared/notifications/global-stock-thresholds-config'
import {
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  History,
} from 'lucide-react'
import Link from 'next/link'
import { StockProductActions } from '@/components/shared/product/stock-product-actions'
import { getTranslations } from 'next-intl/server'

export default async function StockManagementPage() {
  const t = await getTranslations('Admin.Stock')
  
  // Utiliser Promise.allSettled pour ne pas bloquer la page si une requête échoue
  const [lowStockResult, outOfStockResult, statisticsResult] =
    await Promise.allSettled([
      getCachedLowStockProducts(),
      getCachedOutOfStockProducts(),
      getCachedStockStatistics(),
    ]).then((results) => [
      // Normaliser les résultats pour garantir une structure cohérente
      results[0].status === 'fulfilled' 
        ? (results[0].value.success && 'products' in results[0].value 
            ? results[0].value 
            : { success: false, products: [], message: results[0].value.message || 'Erreur lors du chargement' })
        : { success: false, products: [], message: 'Erreur lors du chargement' },
      results[1].status === 'fulfilled'
        ? (results[1].value.success && 'products' in results[1].value
            ? results[1].value
            : { success: false, products: [], message: results[1].value.message || 'Erreur lors du chargement' })
        : { success: false, products: [], message: 'Erreur lors du chargement' },
      results[2].status === 'fulfilled'
        ? (results[2].value.success && 'statistics' in results[2].value
            ? results[2].value
            : { success: false, statistics: null, message: results[2].value.message || 'Erreur lors du chargement' })
        : { success: false, statistics: null, message: 'Erreur lors du chargement' },
    ])

  const lowStockProducts = 
    lowStockResult.success && 'products' in lowStockResult
      ? (lowStockResult.products as Array<{
          id: string
          name: string
          slug: string
          countInStock: number
          minStockLevel: number
          maxStockLevel: number
          stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
          lastStockUpdate: string
        }>)
      : []
  const outOfStockProducts = 
    outOfStockResult.success && 'products' in outOfStockResult
      ? (outOfStockResult.products as Array<{
          id: string
          name: string
          slug: string
          countInStock: number
          minStockLevel: number
          maxStockLevel: number
          stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
          lastStockUpdate: string
        }>)
      : []
  const statistics = 
    statisticsResult.success && 'statistics' in statisticsResult
      ? statisticsResult.statistics
      : null

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Header */}
      <div className='flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4'>
        <div className='flex-1 min-w-0'>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold'>{t('Title')}</h1>
          <p className='text-muted-foreground text-xs sm:text-sm lg:text-base mt-1'>
            {t('Description')}
          </p>
        </div>
        <div className='flex-shrink-0'>
          <RefreshStockButton />
        </div>
      </div>

      {/* Alertes de Stock */}
      <StockAlerts
        lowStockProducts={lowStockProducts || []}
        outOfStockProducts={outOfStockProducts || []}
      />

      {/* Statistiques */}
      {statistics && (
        <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
          <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>
              {t('TotalProducts')}
            </CardTitle>
            <Package className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold'>
              {statistics.totalProducts}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>{t('PublishedProducts')}</p>
          </CardContent>
          </Card>

          <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>{t('InStock')}</CardTitle>
            <CheckCircle className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-green-600'>
              {statistics.inStockProducts}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>{t('SufficientStock')}</p>
          </CardContent>
          </Card>

          <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>
              {t('LowStock')}
            </CardTitle>
            <AlertTriangle className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-orange-600'>
              {statistics.lowStockProducts}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>{t('AttentionRequired')}</p>
          </CardContent>
          </Card>

          <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>{t('OutOfStock')}</CardTitle>
            <XCircle className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 flex-shrink-0' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-red-600'>
              {statistics.outOfStockProducts}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              {t('UrgentRestock')}
            </p>
          </CardContent>
          </Card>
        </div>
      )}

      {/* Valeur totale du stock */}
      {statistics && (
        <Card>
          <CardHeader className='pb-3 sm:pb-6'>
            <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
              <DollarSign className='h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0' />
              <span>{t('TotalStockValue')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl sm:text-3xl font-bold'>
              {statistics.totalStockValue.toLocaleString('fr-FR')} €
            </div>
            <p className='text-xs sm:text-sm text-muted-foreground mt-1'>
              {t('ValueCalculatedAtCurrentPrice')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Configuration des Seuils Globaux */}
      <GlobalStockThresholdsConfig />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
        {/* Produits en rupture de stock */}
        <Card>
          <CardHeader className='pb-3 sm:pb-6'>
            <CardTitle className='flex items-center gap-2 text-red-600 text-base sm:text-lg'>
              <XCircle className='h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0' />
              <span>{t('OutOfStockProducts')}</span>
            </CardTitle>
            <CardDescription className='text-xs sm:text-sm'>
              {t('OutOfStockDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!outOfStockProducts || outOfStockProducts.length === 0 ? (
              <div className='text-center py-6 sm:py-8 text-muted-foreground'>
                <CheckCircle className='h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-green-600' />
                <p className='text-sm sm:text-base'>{t('NoOutOfStock')}</p>
              </div>
            ) : (
              <div className='space-y-2 sm:space-y-3'>
                {outOfStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className='flex flex-col gap-2 sm:gap-3 p-2.5 sm:p-3 border rounded-lg hover:bg-muted/50 transition-colors'
                  >
                    <div className='flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2'>
                      <div className='flex-1 min-w-0'>
                        <h4 className='font-medium truncate text-sm sm:text-base'>{product.name}</h4>
                        <p className='text-xs sm:text-sm text-muted-foreground'>
                          {t('Stock')}: {product.countInStock}
                        </p>
                      </div>
                      <div className='flex items-center gap-2 flex-shrink-0'>
                        <StockStatus
                          countInStock={product.countInStock}
                          stockStatus={product.stockStatus}
                          size='sm'
                        />
                        <StockThresholdConfig
                          productId={product.id}
                          productName={product.name}
                          currentMinStockLevel={product.minStockLevel}
                          currentMaxStockLevel={product.maxStockLevel || 100}
                          currentStock={product.countInStock}
                        />
                        <StockProductActions productId={product.id} />
                      </div>
                    </div>
                    {product.maxStockLevel && (
                      <StockGauge
                        currentStock={product.countInStock}
                        minStockLevel={product.minStockLevel}
                        maxStockLevel={product.maxStockLevel}
                        size='sm'
                        showLabel={false}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Produits avec stock faible */}
        <Card>
          <CardHeader className='pb-3 sm:pb-6'>
            <CardTitle className='flex items-center gap-2 text-orange-600 text-base sm:text-lg'>
              <AlertTriangle className='h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0' />
              <span>{t('LowStockProducts')}</span>
            </CardTitle>
            <CardDescription className='text-xs sm:text-sm'>
              {t('LowStockDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!lowStockProducts || lowStockProducts.length === 0 ? (
              <div className='text-center py-6 sm:py-8 text-muted-foreground'>
                <CheckCircle className='h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-green-600' />
                <p className='text-sm sm:text-base'>{t('NoLowStockProducts')}</p>
              </div>
            ) : (
              <div className='space-y-2 sm:space-y-3'>
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className='flex flex-col gap-2 sm:gap-3 p-2.5 sm:p-3 border rounded-lg hover:bg-muted/50 transition-colors'
                  >
                    <div className='flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2'>
                      <div className='flex-1 min-w-0'>
                        <h4 className='font-medium truncate text-sm sm:text-base'>{product.name}</h4>
                        <p className='text-xs sm:text-sm text-muted-foreground'>
                          {t('Stock')}: {product.countInStock} / {t('Threshold')}:{' '}
                          {product.minStockLevel}
                        </p>
                      </div>
                      <div className='flex items-center gap-2 flex-shrink-0'>
                        <StockStatus
                          countInStock={product.countInStock}
                          stockStatus={product.stockStatus}
                          size='sm'
                        />
                        <StockThresholdConfig
                          productId={product.id}
                          productName={product.name}
                          currentMinStockLevel={product.minStockLevel}
                          currentMaxStockLevel={product.maxStockLevel || 100}
                          currentStock={product.countInStock}
                        />
                        <StockProductActions productId={product.id} />
                      </div>
                    </div>
                    {product.maxStockLevel && (
                      <StockGauge
                        currentStock={product.countInStock}
                        minStockLevel={product.minStockLevel}
                        maxStockLevel={product.maxStockLevel}
                        size='sm'
                        showLabel={false}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader className='pb-3 sm:pb-6'>
          <CardTitle className='text-base sm:text-lg'>{t('QuickActions')}</CardTitle>
          <CardDescription className='text-xs sm:text-sm'>{t('QuickActionsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col xs:flex-row flex-wrap gap-2 sm:gap-4'>
            <Button asChild className='w-full xs:w-auto text-xs sm:text-sm'>
              <Link href='/admin/products' className='flex items-center justify-center'>
                <Package className='h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2' />
                <span className='whitespace-nowrap'>{t('ManageAllProducts')}</span>
              </Link>
            </Button>
            <Button asChild variant='outline' className='w-full xs:w-auto text-xs sm:text-sm'>
              <Link href='/admin/products/create' className='flex items-center justify-center'>
                <TrendingUp className='h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2' />
                <span className='whitespace-nowrap'>{t('AddProduct')}</span>
              </Link>
            </Button>
            <Button asChild variant='outline' className='w-full xs:w-auto text-xs sm:text-sm'>
              <Link href='/admin/stock/history' className='flex items-center justify-center'>
                <History className='h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2' />
                <span className='whitespace-nowrap'>{t('ViewHistory')}</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
