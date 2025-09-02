'use client'
import { BadgeDollarSign, Barcode, CreditCard, Users, TrendingUp, BarChart3, PieChart, ShoppingCart, Calendar, ArrowRight } from 'lucide-react'
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
    <div className='p-1 xs:p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto'>
      {/* Header Section */}
      <div className='bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 sm:p-6 mb-6'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center'>
              <BarChart3 className='h-6 w-6 text-primary' />
            </div>
            <div>
              <h1 className='text-xl sm:text-2xl font-bold text-foreground'>
                {t('Dashboard')}
              </h1>
              <p className='text-sm text-muted-foreground'>
                Aperçu des performances et statistiques
              </p>
            </div>
          </div>
          <CalendarDateRangePicker defaultDate={date} setDate={setDate} />
        </div>
      </div>

      <div className='space-y-4 sm:space-y-6'>
        {/* Stats Cards */}
        <div className='grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4'>
          <Card className='group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-green-50 to-green-100/50 border-green-200'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs sm:text-sm font-medium text-green-800'>
                {t('Total Revenue')}
              </CardTitle>
              <div className='w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center'>
                <BadgeDollarSign className='h-4 w-4 text-green-600' />
              </div>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-lg sm:text-2xl font-bold text-green-900'>
                <ProductPrice price={data.totalSales} plain />
              </div>
              <Link 
                className='text-xs text-green-700 hover:text-green-800 flex items-center gap-1 transition-colors' 
                href='/admin/orders'
              >
                {t('View revenue')}
                <ArrowRight className='h-3 w-3' />
              </Link>
            </CardContent>
          </Card>

          <Card className='group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs sm:text-sm font-medium text-blue-800'>
                {t('Sales')}
              </CardTitle>
              <div className='w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center'>
                <CreditCard className='h-4 w-4 text-blue-600' />
              </div>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-lg sm:text-2xl font-bold text-blue-900'>
                {formatNumber(data.ordersCount)}
              </div>
              <Link 
                className='text-xs text-blue-700 hover:text-blue-800 flex items-center gap-1 transition-colors' 
                href='/admin/orders'
              >
                {t('View orders')}
                <ArrowRight className='h-3 w-3' />
              </Link>
            </CardContent>
          </Card>

          <Card className='group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs sm:text-sm font-medium text-purple-800'>
                {t('Customers')}
              </CardTitle>
              <div className='w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center'>
                <Users className='h-4 w-4 text-purple-600' />
              </div>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-lg sm:text-2xl font-bold text-purple-900'>
                {data.usersCount}
              </div>
              <Link 
                className='text-xs text-purple-700 hover:text-purple-800 flex items-center gap-1 transition-colors' 
                href='/admin/users'
              >
                {t('View customers')}
                <ArrowRight className='h-3 w-3' />
              </Link>
            </CardContent>
          </Card>

          <Card className='group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs sm:text-sm font-medium text-orange-800'>
                {t('Products')}
              </CardTitle>
              <div className='w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center'>
                <Barcode className='h-4 w-4 text-orange-600' />
              </div>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-lg sm:text-2xl font-bold text-orange-900'>
                {data.productsCount}
              </div>
              <Link 
                className='text-xs text-orange-700 hover:text-orange-800 flex items-center gap-1 transition-colors' 
                href='/admin/products'
              >
                {t('View products')}
                <ArrowRight className='h-3 w-3' />
              </Link>
            </CardContent>
          </Card>
        </div>
        {/* Sales Overview Chart */}
        <Card className='bg-card rounded-xl border shadow-sm overflow-hidden'>
          <CardHeader className='bg-gradient-to-r from-primary/5 to-primary/10 border-b'>
            <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
              <TrendingUp className='h-5 w-5 text-primary' />
              {t('Sales Overview')}
            </CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>
              Évolution des ventes sur la période sélectionnée
            </CardDescription>
          </CardHeader>
          <CardContent className='p-3 sm:p-6'>
            <SalesAreaChart data={data.salesChartData} />
          </CardContent>
        </Card>

        {/* Revenue and Performance Section */}
        <div className='grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2'>
          <Card className='bg-card rounded-xl border shadow-sm overflow-hidden'>
            <CardHeader className='bg-gradient-to-r from-green-50 to-green-100/50 border-b'>
              <CardTitle className='flex items-center gap-2 text-base sm:text-lg font-semibold text-green-800'>
                <Calendar className='h-5 w-5 text-green-600' />
                Revenus mensuels
              </CardTitle>
              <CardDescription className='text-xs sm:text-sm text-green-700'>
                {t('Estimated')} · {t('Last 6 months')}
              </CardDescription>
            </CardHeader>
            <CardContent className='p-3 sm:p-6'>
              <TableChart data={data.monthlySales} labelType='month' />
            </CardContent>
          </Card>

          <Card className='bg-card rounded-xl border shadow-sm overflow-hidden'>
            <CardHeader className='bg-gradient-to-r from-blue-50 to-blue-100/50 border-b'>
              <CardTitle className='flex items-center gap-2 text-base sm:text-lg font-semibold text-blue-800'>
                <BarChart3 className='h-5 w-5 text-blue-600' />
                {t('Product Performance')}
              </CardTitle>
              <CardDescription className='text-xs sm:text-sm text-blue-700'>
                {formatDateTime(date!.from!).dateOnly} to{' '}
                {formatDateTime(date!.to!).dateOnly}
              </CardDescription>
            </CardHeader>
            <CardContent className='p-3 sm:p-6'>
              <TableChart data={data.topSalesProducts} labelType='product' />
            </CardContent>
          </Card>
        </div>

        {/* Categories and Recent Sales Section */}
        <div className='grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2'>
          <Card className='bg-card rounded-xl border shadow-sm overflow-hidden'>
            <CardHeader className='bg-gradient-to-r from-purple-50 to-purple-100/50 border-b'>
              <CardTitle className='flex items-center gap-2 text-base sm:text-lg font-semibold text-purple-800'>
                <PieChart className='h-5 w-5 text-purple-600' />
                {t('Best-Selling Categories')}
              </CardTitle>
              <CardDescription className='text-xs sm:text-sm text-purple-700'>
                Répartition des ventes par catégorie
              </CardDescription>
            </CardHeader>
            <CardContent className='p-3 sm:p-6'>
              <SalesCategoryPieChart data={data.topSalesCategories} />
            </CardContent>
          </Card>

          <Card className='bg-card rounded-xl border shadow-sm overflow-hidden'>
            <CardHeader className='bg-gradient-to-r from-orange-50 to-orange-100/50 border-b'>
              <CardTitle className='flex items-center gap-2 text-base sm:text-lg font-semibold text-orange-800'>
                <ShoppingCart className='h-5 w-5 text-orange-600' />
                {t('Recent Sales')}
              </CardTitle>
              <CardDescription className='text-xs sm:text-sm text-orange-700'>
                Dernières commandes traitées
              </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow className='border-b bg-muted/30'>
                      <TableHead className='text-xs sm:text-sm font-medium'>
                        {t('Buyer')}
                      </TableHead>
                      <TableHead className='text-xs sm:text-sm font-medium'>
                        {t('Date')}
                      </TableHead>
                      <TableHead className='text-xs sm:text-sm font-medium'>
                        {t('Total')}
                      </TableHead>
                      <TableHead className='text-xs sm:text-sm font-medium'>
                        {t('Actions')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.latestOrders.map((order: IOrderList) => (
                      <TableRow key={order._id} className='border-b last:border-b-0 hover:bg-muted/30 transition-colors'>
                        <TableCell className='text-xs sm:text-sm py-3'>
                          <div className='flex items-center gap-2'>
                            <div className='w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center'>
                              <Users className='h-3 w-3 text-primary' />
                            </div>
                            <span className='font-medium'>
                              {order.user ? order.user.name : t('Deleted User')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='text-xs sm:text-sm py-3'>
                          <div className='flex items-center gap-2'>
                            <Calendar className='h-3 w-3 text-muted-foreground' />
                            <span>{formatDateTime(order.createdAt).dateOnly}</span>
                          </div>
                        </TableCell>
                        <TableCell className='text-xs sm:text-sm py-3'>
                          <div className='font-medium'>
                            <ProductPrice price={order.totalPrice} plain />
                          </div>
                        </TableCell>
                        <TableCell className='text-xs sm:text-sm py-3'>
                          <Link 
                            href={`/admin/orders/${order._id}`}
                            className='inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors'
                          >
                            {t('Details')}
                            <ArrowRight className='h-3 w-3' />
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
