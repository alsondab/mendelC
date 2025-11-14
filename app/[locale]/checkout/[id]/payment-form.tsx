'use client'

import { Card, CardContent } from '@/components/ui/card'

import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime } from '@/lib/utils'

import CheckoutFooter from '../checkout-footer'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ProductPrice from '@/components/shared/product/product-price'
import { useTranslations } from 'next-intl'
import useSettingStore from '@/hooks/use-setting-store'
import { round2 } from '@/lib/utils'

export default function OrderDetailsForm({ order }: { order: IOrder }) {
  const router = useRouter()
  const t = useTranslations('Checkout')
  const {
    setting: { availableCurrencies },
  } = useSettingStore()
  const { getCurrency } = useSettingStore()
  const currency = getCurrency()

  const {
    shippingAddress,
    items,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    expectedDeliveryDate,
    // isPaid, // Not used in this component
  } = order

  // Fonction pour formater les prix selon la devise choisie
  // Les prix dans la DB sont en CFA, on les formate directement
  const formatPrice = (priceCFA: number) => {
    // Si la devise choisie est XOF (CFA), afficher directement
    if (currency.code === 'XOF') {
      return `${Math.round(priceCFA).toLocaleString('fr-FR')} CFA`
    }

    // Sinon, convertir depuis CFA vers la devise choisie
    const cfaCurrency = availableCurrencies.find((c) => c.code === 'XOF')
    if (!cfaCurrency) {
      return `${Math.round(priceCFA).toLocaleString('fr-FR')} CFA`
    }

    // Convertir depuis CFA vers la devise choisie
    const convertedPrice = round2(
      (priceCFA / cfaCurrency.convertRate) * currency.convertRate
    )

    // Formater selon la devise
    if (currency.code === 'EUR') {
      return `€${convertedPrice.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    }
    if (currency.code === 'USD') {
      return `$${convertedPrice.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    }

    return `${convertedPrice.toLocaleString('fr-FR')} ${currency.symbol}`
  }

  // Ne pas rediriger automatiquement, laisser l'utilisateur voir les détails
  // if (isPaid) {
  //   redirect(`/account/orders/${order._id}`)
  // }

  const CheckoutSummary = () => (
    <Card>
      <CardContent className="p-4">
        <div>
          <div className="text-lg font-bold">{t('OrderSummary')}</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{t('Items')}:</span>
              <span className="font-semibold">{formatPrice(itemsPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('ShippingHandling')}:</span>
              <span>
                {shippingPrice === undefined ? (
                  '--'
                ) : shippingPrice === 0 ? (
                  t('FREE')
                ) : (
                  <span className="font-semibold">
                    {formatPrice(shippingPrice)}
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between"></div>
            <div className="flex justify-between  pt-1 font-bold text-lg">
              <span> {t('OrderTotal')}:</span>
              <span className="font-bold">{formatPrice(totalPrice)}</span>
            </div>

            <Button
              className="w-full rounded-full"
              onClick={() => router.push(`/account/orders/${order._id}`)}
            >
              {t('ViewOrder')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className="max-w-6xl mx-auto px-2 sm:px-4">
      <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="lg:col-span-3">
          {/* Shipping Address */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 my-3 pb-3 gap-2">
              <div className="text-base sm:text-lg font-bold">
                <span>{t('ShippingAddress')}</span>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm sm:text-base">
                  {shippingAddress.fullName} <br />
                  {shippingAddress.street} <br />
                  {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                </p>
              </div>
            </div>
          </div>

          {/* payment method */}
          <div className="border-y">
            <div className="grid grid-cols-1 sm:grid-cols-3 my-3 pb-3 gap-2">
              <div className="text-base sm:text-lg font-bold">
                <span>{t('PaymentMethod')}</span>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm sm:text-base">{t(paymentMethod)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 my-3 pb-3 gap-2">
            <div className="flex text-base sm:text-lg font-bold">
              <span>{t('ItemsAndShipping')}</span>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm sm:text-base">
                {t('DeliveryDate')}:
                {formatDateTime(expectedDeliveryDate).dateOnly}
              </p>
              <ul className="text-sm sm:text-base">
                {items.map((item) => {
                  // Convertir le prix CFA en USD pour ProductPrice
                  const cfaCurrency = availableCurrencies.find(
                    (c) => c.code === 'XOF'
                  )
                  const itemPriceUSD = cfaCurrency
                    ? round2(item.price / cfaCurrency.convertRate)
                    : item.price
                  return (
                    <li key={item.slug} className="truncate">
                      {item.name} x {item.quantity} ={' '}
                      <ProductPrice price={itemPriceUSD} plain />
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="block lg:hidden">
            <CheckoutSummary />
          </div>

          <CheckoutFooter />
        </div>
        <div className="hidden lg:block">
          <CheckoutSummary />
        </div>
      </div>
    </main>
  )
}
