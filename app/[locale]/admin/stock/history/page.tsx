import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  getCachedStockHistory,
  getCachedStockHistoryStatistics,
} from '@/lib/cache/stock-cache'
import { formatDateTime } from '@/lib/utils'
import {
  Package,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Wrench,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/shared/pagination'
import { getTranslations } from 'next-intl/server'

interface PageProps {
  searchParams: Promise<{
    page?: string
    movementType?: string
    productId?: string
  }>
}

// Cette fonction sera utilisée dans le composant pour obtenir les labels traduits
async function getMovementTypeLabels() {
  const t = await getTranslations('Admin.StockHistory.MovementType')
  return {
    sale: {
      label: t('Sale'),
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
    adjustment: {
      label: t('Adjustment'),
      icon: Wrench,
      color:
        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    },
    // Types futurs (seront implémentés dans une prochaine version) :
    // restock: { label: t('Restock'), icon: TrendingUp, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    // return: { label: t('Return'), icon: ArrowLeftRight, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-800' },
    // damage: { label: t('Damage'), icon: Package, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    // transfer: { label: t('Transfer'), icon: RefreshCw, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
  }
}

export default async function StockHistoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const movementType = params.movementType
  const productId = params.productId

  const t = await getTranslations('Admin.StockHistory')
  const movementTypeLabels = await getMovementTypeLabels()

  const [historyResult, statisticsResult] = await Promise.all([
    getCachedStockHistory({
      page,
      limit: 20,
      movementType,
      productId,
    }),
    getCachedStockHistoryStatistics(),
  ])

  const history = historyResult.success ? historyResult.history : []
  const totalPages = historyResult.totalPages || 1
  const total = historyResult.total || 0
  const statistics = statisticsResult.success
    ? statisticsResult.statistics
    : null

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Link href="/admin/stock">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('Back')}
              </Button>
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            {t('Title')}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mt-1">
            {t('Description')}
          </p>
        </div>
      </div>

      {/* Statistiques */}
      {statistics && (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {t('TotalMovements')}
              </CardTitle>
              <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {statistics.totalMovements.toLocaleString('fr-FR')}
              </div>
            </CardContent>
          </Card>

          {statistics.movementsByType &&
            statistics.movementsByType.length > 0 &&
            statistics.movementsByType
              .slice(0, 3)
              .map(
                (movement: {
                  _id: string
                  count: number
                  totalQuantity: number
                }) => {
                  const typeConfig = (movementTypeLabels[
                    movement._id as keyof typeof movementTypeLabels
                  ] as (typeof movementTypeLabels)[keyof typeof movementTypeLabels]) || {
                    label: movement._id,
                    icon: Package,
                    color: 'bg-gray-100 text-gray-800',
                  }
                  const Icon = typeConfig.icon
                  return (
                    <Card key={movement._id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">
                          {typeConfig.label}
                        </CardTitle>
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                          {movement.count.toLocaleString('fr-FR')}
                        </div>
                        {movement.totalQuantity !== 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {movement.totalQuantity > 0 ? '+' : ''}
                            {movement.totalQuantity.toLocaleString(
                              'fr-FR'
                            )}{' '}
                            {t('Units')}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )
                }
              )}
        </div>
      )}

      {/* Liste de l'historique */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">
            {t('Movements')} ({total.toLocaleString('fr-FR')})
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {t('ChronologicalList')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <Package className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-sm sm:text-base">{t('NoMovements')}</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {history.map((entry) => {
                const typeConfig =
                  (movementTypeLabels[
                    entry.movementType as keyof typeof movementTypeLabels
                  ] as (typeof movementTypeLabels)[keyof typeof movementTypeLabels]) ||
                  movementTypeLabels['adjustment']
                const Icon = typeConfig.icon
                const user =
                  typeof entry.userId === 'object' && entry.userId
                    ? entry.userId
                    : null

                return (
                  <div
                    key={entry._id}
                    className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={typeConfig.color}>
                            <Icon className="h-3 w-3 mr-1" />
                            {typeConfig.label}
                          </Badge>
                          <span className="text-sm sm:text-base font-medium truncate">
                            {entry.productName}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {entry.reason || t('DefaultReason')}
                        </p>
                        {user && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('By')}: {user.name || user.email}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="text-center">
                          <div className="text-muted-foreground">
                            {t('Before')}
                          </div>
                          <div className="font-semibold">
                            {entry.quantityBefore}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {entry.quantityChange > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={`font-semibold ${
                              entry.quantityChange > 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {entry.quantityChange > 0 ? '+' : ''}
                            {entry.quantityChange}
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground">
                            {t('After')}
                          </div>
                          <div className="font-semibold">
                            {entry.quantityAfter}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDateTime(entry.createdAt).dateTime}</span>
                      {entry.orderId && (
                        <>
                          <span>•</span>
                          <span>
                            {t('Order')}:{' '}
                            {typeof entry.orderId === 'object' &&
                            entry.orderId &&
                            'orderNumber' in entry.orderId
                              ? (entry.orderId as { orderNumber: string })
                                  .orderNumber
                              : String(entry.orderId)}
                          </span>
                        </>
                      )}
                      {entry.productId &&
                        typeof entry.productId === 'object' && (
                          <>
                            <span>•</span>
                            <Link
                              href={`/admin/products/${(entry.productId as { _id?: string })._id || String(entry.productId)}`}
                              className="hover:text-primary transition-colors"
                            >
                              {t('ViewProduct')}
                            </Link>
                          </>
                        )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination page={page} totalPages={totalPages} urlParamName="page" />
        </div>
      )}
    </div>
  )
}
