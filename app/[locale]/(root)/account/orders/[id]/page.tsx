import { notFound } from 'next/navigation'
import React from 'react'
import { ChevronLeft, Package, MapPin, CreditCard } from 'lucide-react'

import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import OrderDetailsForm from '@/components/shared/order/order-details-form'
import Link from 'next/link'
import { formatId, formatDateTime } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params

  return {
    title: `Commande ${formatId(params.id)}`,
  }
}

export default async function OrderDetailsPage(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  return (
    <div className='p-1 xs:p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto'>
      {/* Breadcrumb Navigation */}
      <nav className='flex items-center gap-2 text-sm text-muted-foreground mb-4 xs:mb-6'>
        <Link
          href='/account'
          className='hover:text-foreground transition-colors flex items-center gap-1'
        >
          <ChevronLeft className='h-4 w-4' />
          Mon compte
        </Link>
        <span>›</span>
        <Link
          href='/account/orders'
          className='hover:text-foreground transition-colors'
        >
          Mes commandes
        </Link>
        <span>›</span>
        <span className='text-foreground font-medium'>
          Commande {formatId(order._id)}
        </span>
      </nav>

      {/* Header Section */}
      <div className='bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 sm:p-6 mb-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center'>
              <Package className='h-6 w-6 text-primary' />
            </div>
            <div>
              <h1 className='text-xl sm:text-2xl font-bold text-foreground'>
                {order.isCancelled
                  ? 'Commande annulée'
                  : `Commande ${formatId(order._id)}`}
              </h1>
              <p className='text-sm text-muted-foreground'>
                {order.isCancelled
                  ? `Annulée le ${formatDateTime(order.cancelledAt!).dateTime}`
                  : `Passée le ${formatDateTime(order.createdAt).dateTime}`}
              </p>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {order.isCancelled ? (
              <Badge variant='destructive' className='flex items-center gap-1'>
                <CreditCard className='h-3 w-3' />
                Annulée le {formatDateTime(order.cancelledAt!).dateTime}
              </Badge>
            ) : (
              <>
                <Badge
                  variant={order.isPaid ? 'default' : 'destructive'}
                  className='flex items-center gap-1'
                >
                  <CreditCard className='h-3 w-3' />
                  {order.isPaid ? 'Payée' : 'Non payée'}
                </Badge>
                <Badge
                  variant={order.isDelivered ? 'default' : 'secondary'}
                  className='flex items-center gap-1'
                >
                  <MapPin className='h-3 w-3' />
                  {order.isDelivered ? 'Livrée' : 'En cours'}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Form */}
      <OrderDetailsForm
        order={order}
        isAdmin={session?.user?.role === 'Admin' || false}
      />
    </div>
  )
}
