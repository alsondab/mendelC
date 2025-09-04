'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  MapPin,
  CreditCard,
  Package,
  Truck,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime } from '@/lib/utils'
import ProductPrice from '../product/product-price'
import ActionButton from '../action-button'
import { deliverOrder, updateOrderToPaid } from '@/lib/actions/order.actions'

export default function OrderDetailsForm({
  order,
  isAdmin,
}: {
  order: IOrder
  isAdmin: boolean
}) {
  const t = useTranslations('Checkout')
  const {
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    expectedDeliveryDate,
  } = order

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
      {/* Main Content */}
      <div className='lg:col-span-2 space-y-4 sm:space-y-6'>
        {/* Shipping Address Card */}
        <Card className='bg-card rounded-xl border shadow-sm overflow-hidden'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
              <MapPin className='h-5 w-5 text-blue-500' />
              Adresse de livraison
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='bg-muted/30 rounded-lg p-3 xs:p-4'>
              <p className='font-medium text-sm xs:text-base'>
                {shippingAddress.fullName}
              </p>
              <p className='text-muted-foreground text-xs xs:text-sm'>
                {shippingAddress.phone}
              </p>
              <p className='text-muted-foreground text-xs xs:text-sm mt-2'>
                {shippingAddress.street}, {shippingAddress.city},{' '}
                {shippingAddress.province}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </p>
            </div>

            <div className='flex items-center gap-2'>
              {isDelivered ? (
                <>
                  <CheckCircle className='h-4 w-4 text-green-500' />
                  <Badge className='bg-green-100 text-green-800 border-green-200'>
                    Livrée le {formatDateTime(deliveredAt!).dateTime}
                  </Badge>
                </>
              ) : (
                <>
                  <Truck className='h-4 w-4 text-orange-500' />
                  <Badge
                    variant='secondary'
                    className='bg-orange-100 text-orange-800 border-orange-200'
                  >
                    En cours de livraison
                  </Badge>
                </>
              )}
            </div>
            {!isDelivered && expectedDeliveryDate && (
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Calendar className='h-4 w-4' />
                <span>
                  Livraison prévue le{' '}
                  {formatDateTime(expectedDeliveryDate).dateTime}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method Card */}
        <Card className='bg-card rounded-xl border shadow-sm overflow-hidden'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
              <CreditCard className='h-5 w-5 text-purple-500' />
              Méthode de paiement
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='bg-muted/30 rounded-lg p-3 xs:p-4'>
              <p className='font-medium text-sm xs:text-base'>
                {t(paymentMethod)}
              </p>
            </div>

            <div className='flex items-center gap-2'>
              {isPaid ? (
                <>
                  <CheckCircle className='h-4 w-4 text-green-500' />
                  <Badge className='bg-green-100 text-green-800 border-green-200'>
                    Payée le {formatDateTime(paidAt!).dateTime}
                  </Badge>
                </>
              ) : (
                <>
                  <XCircle className='h-4 w-4 text-red-500' />
                  <Badge variant='destructive'>Non payée</Badge>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Items Card */}
        <Card className='bg-card rounded-xl border shadow-sm overflow-hidden'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
              <Package className='h-5 w-5 text-indigo-500' />
              Articles commandés
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow className='border-b'>
                    <TableHead className='text-xs sm:text-sm font-medium min-w-[200px]'>
                      Article
                    </TableHead>
                    <TableHead className='text-xs sm:text-sm font-medium text-center w-16'>
                      Qté
                    </TableHead>
                    <TableHead className='text-xs sm:text-sm font-medium text-right w-24'>
                      Prix
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.slug}
                      className='border-b last:border-b-0'
                    >
                      <TableCell className='py-2 sm:py-3'>
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex items-center gap-2 sm:gap-3 hover:bg-muted/50 rounded-lg p-1 -m-1 transition-colors'
                        >
                          <div className='relative w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex-shrink-0'>
                            {item.image && item.image.trim() !== '' ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes='(max-width: 640px) 40px, (max-width: 1024px) 48px, 64px'
                                className='object-contain rounded-md'
                              />
                            ) : (
                              <div className='w-full h-full bg-muted flex items-center justify-center rounded-md'>
                                <span className='text-muted-foreground text-xs'>
                                  No image
                                </span>
                              </div>
                            )}
                          </div>
                          <div className='min-w-0 flex-1'>
                            <p className='text-xs sm:text-sm font-medium line-clamp-2'>
                              {item.name}
                            </p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className='text-center text-xs sm:text-sm font-medium'>
                        {item.quantity}
                      </TableCell>
                      <TableCell className='text-right text-xs sm:text-sm font-medium'>
                        <ProductPrice price={item.price} plain />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary Sidebar */}
      <div className='lg:col-span-1'>
        <Card className='bg-card rounded-xl border shadow-sm overflow-hidden sticky top-4'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg font-semibold'>
              Résumé de la commande
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-muted-foreground'>Articles</span>
                <ProductPrice price={itemsPrice} plain />
              </div>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-muted-foreground'>Taxes</span>
                <ProductPrice price={taxPrice} plain />
              </div>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-muted-foreground'>Livraison</span>
                <ProductPrice price={shippingPrice} plain />
              </div>
              <div className='border-t pt-3'>
                <div className='flex justify-between items-center text-base font-semibold'>
                  <span>Total</span>
                  <ProductPrice price={totalPrice} plain />
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className='space-y-2 pt-4 border-t'>
                {!isPaid &&
                  (paymentMethod === 'CashOnDelivery' ||
                    paymentMethod === 'Cash On Delivery') && (
                    <ActionButton
                      caption='Marquer comme payée'
                      action={() => updateOrderToPaid(order._id)}
                      className='w-full'
                    />
                  )}
                {isPaid && !isDelivered && (
                  <ActionButton
                    caption='Marquer comme livrée'
                    action={() => deliverOrder(order._id)}
                    className='w-full'
                  />
                )}
                {isPaid && isDelivered && (
                  <div className='text-center text-sm text-muted-foreground py-2'>
                    Commande livrée le{' '}
                    {deliveredAt
                      ? new Date(deliveredAt).toLocaleDateString('fr-FR')
                      : 'N/A'}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
