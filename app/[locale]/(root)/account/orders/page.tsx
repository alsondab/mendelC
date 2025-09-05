import { Metadata } from 'next'
import Link from 'next/link'
import { PackageCheckIcon } from 'lucide-react'

import Pagination from '@/components/shared/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getMyOrders } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime, formatId } from '@/lib/utils'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductPrice from '@/components/shared/product/product-price'

const PAGE_TITLE = 'Vos Commandes'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}
export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1
  const orders = await getMyOrders({
    page,
  })
  return (
    <div className='p-1 xs:p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto'>
      <div className='mb-6 xs:mb-8'>
        <nav className='flex items-center gap-2 text-sm xs:text-base mb-4'>
          <Link
            href='/account'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            Votre compte
          </Link>
          <span className='text-muted-foreground'>›</span>
          <span className='text-foreground font-medium'>{PAGE_TITLE}</span>
        </nav>

        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-2'>
              {PAGE_TITLE}
            </h1>
            <p className='text-sm xs:text-base text-muted-foreground'>
              Gérez et suivez vos commandes
            </p>
          </div>
          {orders.data.length > 0 && (
            <div className='text-sm xs:text-base text-muted-foreground'>
              {orders.data.length} commande{orders.data.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      <div className='bg-card rounded-xl border shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-border/50'>
                <TableHead className='text-xs sm:text-sm font-semibold'>
                  ID
                </TableHead>
                <TableHead className='text-xs sm:text-sm font-semibold'>
                  Date
                </TableHead>
                <TableHead className='text-xs sm:text-sm font-semibold'>
                  Total
                </TableHead>
                <TableHead className='text-xs sm:text-sm font-semibold hidden sm:table-cell'>
                  Payé
                </TableHead>
                <TableHead className='text-xs sm:text-sm font-semibold hidden sm:table-cell'>
                  Livré
                </TableHead>
                <TableHead className='text-xs sm:text-sm font-semibold'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className='text-center py-8 xs:py-12'>
                    <div className='flex flex-col items-center gap-3'>
                      <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center'>
                        <PackageCheckIcon className='w-8 h-8 text-muted-foreground' />
                      </div>
                      <div>
                        <p className='text-sm xs:text-base font-medium text-foreground mb-1'>
                          Aucune commande
                        </p>
                        <p className='text-xs xs:text-sm text-muted-foreground'>
                          Vous n&apos;avez pas encore passé de commande
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {orders.data.map((order: IOrder) => (
                <TableRow
                  key={order._id}
                  className='hover:bg-muted/50 transition-colors'
                >
                  <TableCell className='text-xs sm:text-sm'>
                    <Link
                      href={`/account/orders/${order._id}`}
                      className='text-primary hover:text-primary/80 transition-colors font-medium'
                    >
                      {formatId(order._id)}
                    </Link>
                  </TableCell>
                  <TableCell className='text-xs sm:text-sm text-muted-foreground'>
                    {order.isCancelled ? (
                      <div className='flex flex-col'>
                        <span className='text-red-600 font-medium'>
                          Commande annulée
                        </span>
                        <span className='text-xs'>
                          le {formatDateTime(order.cancelledAt!).dateTime}
                        </span>
                      </div>
                    ) : (
                      <div className='flex flex-col'>
                        <span className='font-medium'>
                          Commande {formatId(order._id)}
                        </span>
                        <span className='text-xs'>
                          Passée le {formatDateTime(order.createdAt!).dateTime}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className='text-xs sm:text-sm font-medium'>
                    <ProductPrice price={order.totalPrice} plain />
                  </TableCell>
                  <TableCell className='hidden sm:table-cell text-xs sm:text-sm'>
                    {order.isCancelled ? (
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                        <span className='text-red-600'>
                          Annulée le{' '}
                          {formatDateTime(order.cancelledAt!).dateTime}
                        </span>
                      </div>
                    ) : order.isPaid && order.paidAt ? (
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                        <span className='text-green-600'>
                          {formatDateTime(order.paidAt).dateTime}
                        </span>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                        <span className='text-red-600'>Non</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className='hidden sm:table-cell text-xs sm:text-sm'>
                    {order.isCancelled ? (
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                        <span className='text-red-600'>
                          Annulée le{' '}
                          {formatDateTime(order.cancelledAt!).dateTime}
                        </span>
                      </div>
                    ) : order.isDelivered && order.deliveredAt ? (
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                        <span className='text-green-600'>
                          {formatDateTime(order.deliveredAt).dateTime}
                        </span>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                        <span className='text-orange-600'>En cours</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/account/orders/${order._id}`}
                      className='inline-flex items-center px-2 xs:px-3 py-1 xs:py-2 text-xs xs:text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors'
                    >
                      Détails
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {orders.totalPages > 1 && (
          <div className='border-t border-border/50 p-3 xs:p-4'>
            <Pagination page={page} totalPages={orders.totalPages} />
          </div>
        )}
      </div>

      <div className='mt-8 xs:mt-12'>
        <BrowsingHistoryList />
      </div>
    </div>
  )
}
