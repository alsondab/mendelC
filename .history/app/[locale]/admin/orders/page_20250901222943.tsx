import { Metadata } from 'next'
import Link from 'next/link'

import { auth } from '@/auth'
import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteOrder, getAllOrders } from '@/lib/actions/order.actions'
import { formatDateTime, formatId } from '@/lib/utils'
import { IOrderList } from '@/types'
import ProductPrice from '@/components/shared/product/product-price'

export const metadata: Metadata = {
  title: 'Admin Orders',
}
export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>
}) {
  const searchParams = await props.searchParams

  const { page = '1' } = searchParams

  const session = await auth()
  if (session?.user.role !== 'Admin')
    throw new Error('Admin permission required')

  const orders = await getAllOrders({
    page: Number(page),
  })
  return (
    <div className='p-2 sm:p-4'>
      <div className='space-y-3 sm:space-y-4'>
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
          <h1 className='font-bold text-lg sm:text-xl'>Commandes</h1>
          <div className='text-sm text-muted-foreground'>
            {orders.data.length} commande(s) trouvée(s)
          </div>
        </div>

        {/* Table Section */}
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-xs sm:text-sm'>ID</TableHead>
                <TableHead className='text-xs sm:text-sm'>Date</TableHead>
                <TableHead className='text-xs sm:text-sm'>Client</TableHead>
                <TableHead className='text-right text-xs sm:text-sm'>Total</TableHead>
                <TableHead className='hidden sm:table-cell text-xs sm:text-sm'>Payé</TableHead>
                <TableHead className='hidden md:table-cell text-xs sm:text-sm'>Livré</TableHead>
                <TableHead className='w-[120px] sm:w-[140px] text-xs sm:text-sm'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.data.map((order: IOrderList) => (
                <TableRow key={order._id}>
                  <TableCell className='text-xs sm:text-sm font-mono'>
                    {formatId(order._id)}
                  </TableCell>
                  <TableCell className='text-xs sm:text-sm'>
                    <div className='flex flex-col'>
                      <span className='font-medium'>
                        {formatDateTime(order.createdAt!).dateOnly}
                      </span>
                      <span className='text-muted-foreground text-xs'>
                        {formatDateTime(order.createdAt!).timeOnly}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='text-xs sm:text-sm'>
                    <div className='flex flex-col'>
                      <span className='font-medium'>
                        {order.user ? order.user.name : 'Utilisateur supprimé'}
                      </span>
                      <div className='flex flex-wrap gap-1 mt-1'>
                        {order.isPaid && (
                          <span className='px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full'>
                            Payé
                          </span>
                        )}
                        {order.isDelivered && (
                          <span className='px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full'>
                            Livré
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-right text-xs sm:text-sm font-medium'>
                    <ProductPrice price={order.totalPrice} plain />
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    <div className='flex items-center gap-2 text-xs sm:text-sm'>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          order.isPaid ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      ></div>
                      {order.isPaid && order.paidAt
                        ? formatDateTime(order.paidAt).dateOnly
                        : 'Non payé'}
                    </div>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <div className='flex items-center gap-2 text-xs sm:text-sm'>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          order.isDelivered ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                      ></div>
                      {order.isDelivered && order.deliveredAt
                        ? formatDateTime(order.deliveredAt).dateOnly
                        : 'En cours'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col sm:flex-row gap-1'>
                      <Button
                        asChild
                        variant='outline'
                        size='sm'
                        className='text-xs'
                      >
                        <Link href={`/admin/orders/${order._id}`}>
                          Détails
                        </Link>
                      </Button>
                      <DeleteDialog id={order._id} action={deleteOrder} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {orders.totalPages > 1 && (
          <div className='pt-4'>
            <Pagination page={page} totalPages={orders.totalPages!} />
          </div>
        )}
      </div>
    </div>
  )
}
