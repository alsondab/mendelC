'use client'
import Link from 'next/link'
import React, { useEffect, useState, useTransition } from 'react'

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
import { Skeleton } from '@/components/ui/skeleton'
import { deleteOrder, getAllOrders } from '@/lib/actions/order.actions'
import { formatDateTime, formatId } from '@/lib/utils'
import { IOrderList } from '@/types'
import ProductPrice from '@/components/shared/product/product-price'

type OrdersListDataProps = {
  data: IOrderList[]
  totalPages: number
}

const OrdersList = () => {
  const [page, setPage] = useState<number>(1)
  const [data, setData] = useState<OrdersListDataProps>()
  const [, startTransition] = useTransition()

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    startTransition(async () => {
      const orders = await getAllOrders({
        page: newPage,
      })
      setData(orders)
    })
  }

  useEffect(() => {
    startTransition(async () => {
      const orders = await getAllOrders({
        page: 1,
      })
      setData(orders)
    })
  }, [])

  if (!data) {
    return (
      <div className='p-2 sm:p-4'>
        <div className='space-y-3 sm:space-y-4'>
          {/* Header Section */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
            <Skeleton className='h-8 w-32' />
            <Skeleton className='h-5 w-48' />
          </div>

          {/* Table Section */}
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-xs sm:text-sm'>ID</TableHead>
                  <TableHead className='text-xs sm:text-sm'>Date</TableHead>
                  <TableHead className='text-xs sm:text-sm'>Client</TableHead>
                  <TableHead className='text-right text-xs sm:text-sm'>
                    Total
                  </TableHead>
                  <TableHead className='hidden sm:table-cell text-xs sm:text-sm'>
                    Payé
                  </TableHead>
                  <TableHead className='hidden md:table-cell text-xs sm:text-sm'>
                    Livré
                  </TableHead>
                  <TableHead className='w-[120px] sm:w-[140px] text-xs sm:text-sm'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className='h-4 w-20' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-24' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-32' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-16' />
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      <Skeleton className='h-4 w-20' />
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      <Skeleton className='h-4 w-20' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-8 w-20' />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-2 sm:p-4'>
      <div className='space-y-3 sm:space-y-4'>
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
          <h1 className='font-bold text-lg sm:text-xl'>Commandes</h1>
          <div className='text-sm text-muted-foreground'>
            {data.data.length} commande(s) trouvée(s)
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
                <TableHead className='text-right text-xs sm:text-sm'>
                  Total
                </TableHead>
                <TableHead className='hidden sm:table-cell text-xs sm:text-sm'>
                  Payé
                </TableHead>
                <TableHead className='hidden md:table-cell text-xs sm:text-sm'>
                  Livré
                </TableHead>
                <TableHead className='w-[120px] sm:w-[140px] text-xs sm:text-sm'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((order: IOrderList) => (
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
                        {order.isCancelled && (
                          <span className='px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded-full'>
                            Annulée
                          </span>
                        )}
                        {order.isPaid && !order.isCancelled && (
                          <span className='px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full'>
                            Payé
                          </span>
                        )}
                        {order.isDelivered && !order.isCancelled && (
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
                          order.isCancelled
                            ? 'bg-red-500'
                            : order.isPaid
                              ? 'bg-green-500'
                              : 'bg-red-500'
                        }`}
                      ></div>
                      {order.isCancelled
                        ? 'Annulée'
                        : order.isPaid && order.paidAt
                          ? formatDateTime(order.paidAt).dateOnly
                          : 'Non payé'}
                    </div>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <div className='flex items-center gap-2 text-xs sm:text-sm'>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          order.isCancelled
                            ? 'bg-red-500'
                            : order.isDelivered
                              ? 'bg-green-500'
                              : 'bg-yellow-500'
                        }`}
                      ></div>
                      {order.isCancelled
                        ? 'Annulée'
                        : order.isDelivered && order.deliveredAt
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
                        <Link href={`/admin/orders/${order._id}`}>Détails</Link>
                      </Button>
                      <DeleteDialog
                        id={order._id}
                        action={deleteOrder}
                        callbackAction={() => {
                          startTransition(async () => {
                            const orders = await getAllOrders({
                              page: page,
                            })
                            setData(orders)
                          })
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className='pt-4'>
            <Pagination
              page={page.toString()}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersList
