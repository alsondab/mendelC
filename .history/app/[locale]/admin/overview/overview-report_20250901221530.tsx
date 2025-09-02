'use client'
import { BadgeDollarSign, Barcode, CreditCard, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { calculatePastDate, formatDateTime, formatNumber } from '@/lib/utils'

import SalesCategoryPieChart from './sales-category-pie-chart'

import React, { useEffect, useState, useTransition } from 'react'
import { DateRange } from 'react-day-picker'
import { getOrderSummary } from '@/lib/actions/order.actions'
import SalesAreaChart from './sales-area-chart'
import { CalendarDateRangePicker } from './date-range-picker'
import { IOrderList } from '@/types'
import ProductPrice from '@/components/shared/product/product-price'
import { Skeleton } from '@/components/ui/skeleton'
import TableChart from './table-chart'

export default function OverviewReport() {
  const t = useTranslations('Admin')
  const [date, setDate] = useState<DateRange | undefined>({
    from: calculatePastDate(30),
    to: new Date(),
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<{ [key: string]: any }>()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition()
  useEffect(() => {
    if (date) {
      startTransition(async () => {
        setData(await getOrderSummary(date))
      })
    }
  }, [date])

  if (!data)
    return (
      <div className='p-2 sm:p-4 space-y-3 sm:space-y-4'>
        <div>
          <h1 className='h1-bold text-xl sm:text-2xl'>Dashboard</h1>
        </div>
        {/* First Row */}
        <div className='grid gap-2 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4'>
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className='h-32 sm:h-36 w-full' />
          ))}
        </div>

        {/* Second Row */}
        <div>
          <Skeleton className='h-[20rem] sm:h-[30rem] w-full' />
        </div>

        {/* Third Row */}
        <div className='grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2'>
          {[...Array(2)].map((_, index) => (
            <Skeleton key={index} className='h-48 sm:h-60 w-full' />
          ))}
        </div>

        {/* Fourth Row */}
        <div className='grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2'>
          {[...Array(2)].map((_, index) => (
            <Skeleton key={index} className='h-48 sm:h-60 w-full' />
          ))}
        </div>
      </div>
    )
  return (
    <div className='p-2 sm:p-4'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2'>
        <h1 className='h1-bold text-xl sm:text-2xl'>{t('Dashboard')}</h1>
        <CalendarDateRangePicker defaultDate={date} setDate={setDate} />
      </div>
      <div className='space-y-3 sm:space-y-4'>
        <div className='grid gap-2 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4'>
          <Card className='min-h-[120px]'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs sm:text-sm font-medium'>
                {t('Total Revenue')}
              </CardTitle>
              <BadgeDollarSign className='h-4 w-4 sm:h-5 sm:w-5' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-lg sm:text-2xl font-bold'>
                <ProductPrice price={data.totalSales} plain />
              </div>
              <div>
                <Link className='text-xs' href='/admin/orders'>
                  {t('View revenue')}
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card className='min-h-[120px]'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs sm:text-sm font-medium'>
                {t('Sales')}
              </CardTitle>
              <CreditCard className='h-4 w-4 sm:h-5 sm:w-5' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-lg sm:text-2xl font-bold'>
                {formatNumber(data.ordersCount)}
              </div>
              <div>
                <Link className='text-xs' href='/admin/orders'>
                  {t('View orders')}
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card className='min-h-[120px]'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs sm:text-sm font-medium'>
                {t('Customers')}
              </CardTitle>
              <Users className='h-4 w-4 sm:h-5 sm:w-5' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-lg sm:text-2xl font-bold'>
                {data.usersCount}
              </div>
              <div>
                <Link className='text-xs' href='/admin/users'>
                  {t('View customers')}
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card className='min-h-[120px]'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs sm:text-sm font-medium'>
                {t('Products')}
              </CardTitle>
              <Barcode className='h-4 w-4 sm:h-5 sm:w-5' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-lg sm:text-2xl font-bold'>
                {data.productsCount}
              </div>
              <div>
                <Link className='text-xs' href='/admin/products'>
                  {t('View products')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base sm:text-lg'>
                {t('Sales Overview')}
              </CardTitle>
            </CardHeader>
            <CardContent className='p-3 sm:p-6'>
              <SalesAreaChart data={data.salesChartData} />
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm sm:text-base'>
                {t('How much you are earning')}
              </CardTitle>
              <CardDescription className='text-xs sm:text-sm'>
                {t('Estimated')} · {t('Last 6 months')}
              </CardDescription>
            </CardHeader>
            <CardContent className='p-3 sm:p-6'>
              <TableChart data={data.monthlySales} labelType='month' />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm sm:text-base'>
                {t('Product Performance')}
              </CardTitle>
              <CardDescription className='text-xs sm:text-sm'>
                {formatDateTime(date!.from!).dateOnly} to{' '}
                {formatDateTime(date!.to!).dateOnly}
              </CardDescription>
            </CardHeader>
            <CardContent className='p-3 sm:p-6'>
              <TableChart data={data.topSalesProducts} labelType='product' />
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm sm:text-base'>
                {t('Best-Selling Categories')}
              </CardTitle>
            </CardHeader>
            <CardContent className='p-3 sm:p-6'>
              <SalesCategoryPieChart data={data.topSalesCategories} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm sm:text-base'>
                {t('Recent Sales')}
              </CardTitle>
            </CardHeader>
            <CardContent className='p-3 sm:p-6'>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-xs sm:text-sm'>
                        {t('Buyer')}
                      </TableHead>
                      <TableHead className='text-xs sm:text-sm'>
                        {t('Date')}
                      </TableHead>
                      <TableHead className='text-xs sm:text-sm'>
                        {t('Total')}
                      </TableHead>
                      <TableHead className='text-xs sm:text-sm'>
                        {t('Actions')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.latestOrders.map((order: IOrderList) => (
                      <TableRow key={order._id}>
                        <TableCell className='text-xs sm:text-sm'>
                          {order.user ? order.user.name : t('Deleted User')}
                        </TableCell>

                        <TableCell className='text-xs sm:text-sm'>
                          {formatDateTime(order.createdAt).dateOnly}
                        </TableCell>
                        <TableCell className='text-xs sm:text-sm'>
                          <ProductPrice price={order.totalPrice} plain />
                        </TableCell>

                        <TableCell className='text-xs sm:text-sm'>
                          <Link href={`/admin/orders/${order._id}`}>
                            <span className='px-1 sm:px-2'>{t('Details')}</span>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
