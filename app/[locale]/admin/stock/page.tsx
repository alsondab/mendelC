import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  getLowStockProducts,
  getOutOfStockProducts,
  getStockStatistics,
} from '@/lib/actions/stock.actions'
import { StockStatus } from '@/components/shared/product/stock-status'
import { StockAlerts } from '@/components/shared/notifications/stock-alerts'
import { RefreshStockButton } from '@/components/shared/notifications/refresh-stock-button'
import {
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle,
  TrendingUp,
  DollarSign,
} from 'lucide-react'
import Link from 'next/link'

export default async function StockManagementPage() {
  const [lowStockResult, outOfStockResult, statisticsResult] =
    await Promise.all([
      getLowStockProducts(),
      getOutOfStockProducts(),
      getStockStatistics(),
    ])

  const lowStockProducts = lowStockResult.success ? lowStockResult.products : []
  const outOfStockProducts = outOfStockResult.success
    ? outOfStockResult.products
    : []
  const statistics = statisticsResult.success
    ? statisticsResult.statistics
    : null

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Gestion des Stocks</h1>
          <p className='text-muted-foreground'>
            Surveillez et gérez les niveaux de stock de vos produits
          </p>
        </div>
        <RefreshStockButton />
      </div>

      {/* Alertes de Stock */}
      <StockAlerts
        lowStockProducts={lowStockProducts || []}
        outOfStockProducts={outOfStockProducts || []}
      />

      {/* Statistiques */}
      {statistics && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Produits
              </CardTitle>
              <Package className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {statistics.totalProducts}
              </div>
              <p className='text-xs text-muted-foreground'>Produits publiés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>En Stock</CardTitle>
              <CheckCircle className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {statistics.inStockProducts}
              </div>
              <p className='text-xs text-muted-foreground'>Stock suffisant</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Stock Faible
              </CardTitle>
              <AlertTriangle className='h-4 w-4 text-orange-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-orange-600'>
                {statistics.lowStockProducts}
              </div>
              <p className='text-xs text-muted-foreground'>Attention requise</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Rupture</CardTitle>
              <XCircle className='h-4 w-4 text-red-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-600'>
                {statistics.outOfStockProducts}
              </div>
              <p className='text-xs text-muted-foreground'>
                Réapprovisionnement urgent
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Valeur totale du stock */}
      {statistics && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <DollarSign className='h-5 w-5' />
              Valeur Totale du Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>
              {statistics.totalStockValue.toLocaleString('fr-FR')} €
            </div>
            <p className='text-sm text-muted-foreground'>
              Valeur calculée au prix de vente actuel
            </p>
          </CardContent>
        </Card>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Produits en rupture de stock */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-red-600'>
              <XCircle className='h-5 w-5' />
              Ruptures de Stock
            </CardTitle>
            <CardDescription>
              Produits nécessitant un réapprovisionnement urgent
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!outOfStockProducts || outOfStockProducts.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <CheckCircle className='h-12 w-12 mx-auto mb-4 text-green-600' />
                <p>Aucune rupture de stock</p>
              </div>
            ) : (
              <div className='space-y-3'>
                {outOfStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className='flex items-center justify-between p-3 border rounded-lg'
                  >
                    <div className='flex-1'>
                      <h4 className='font-medium'>{product.name}</h4>
                      <p className='text-sm text-muted-foreground'>
                        Stock: {product.countInStock}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <StockStatus
                        countInStock={product.countInStock}
                        stockStatus={product.stockStatus}
                        size='sm'
                      />
                      <Button asChild size='sm' variant='outline'>
                        <Link href={`/admin/products/${product.id}`}>
                          Modifier
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Produits avec stock faible */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-orange-600'>
              <AlertTriangle className='h-5 w-5' />
              Stock Faible
            </CardTitle>
            <CardDescription>
              Produits nécessitant une attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!lowStockProducts || lowStockProducts.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <CheckCircle className='h-12 w-12 mx-auto mb-4 text-green-600' />
                <p>Aucun produit en stock faible</p>
              </div>
            ) : (
              <div className='space-y-3'>
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className='flex items-center justify-between p-3 border rounded-lg'
                  >
                    <div className='flex-1'>
                      <h4 className='font-medium'>{product.name}</h4>
                      <p className='text-sm text-muted-foreground'>
                        Stock: {product.countInStock} / Seuil:{' '}
                        {product.minStockLevel}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <StockStatus
                        countInStock={product.countInStock}
                        stockStatus={product.stockStatus}
                        size='sm'
                      />
                      <Button asChild size='sm' variant='outline'>
                        <Link href={`/admin/products/${product.id}`}>
                          Modifier
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Gestion rapide des stocks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-4'>
            <Button asChild>
              <Link href='/admin/products'>
                <Package className='h-4 w-4 mr-2' />
                Gérer tous les produits
              </Link>
            </Button>
            <Button asChild variant='outline'>
              <Link href='/admin/products/create'>
                <TrendingUp className='h-4 w-4 mr-2' />
                Ajouter un produit
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
