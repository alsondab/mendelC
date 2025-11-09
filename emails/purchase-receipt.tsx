import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

import { formatCurrency } from '@/lib/utils'
import { IOrder } from '@/lib/db/models/order.model'
import { getSetting } from '@/lib/actions/setting.actions'

type OrderInformationProps = {
  order: IOrder
}

PurchaseReceiptEmail.PreviewProps = {
  order: {
    _id: '123',
    isPaid: false,
    totalPrice: 100,
    itemsPrice: 100,
    shippingPrice: 0,
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    shippingAddress: {
      fullName: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      postalCode: '12345',
      country: 'USA',
      phone: '123-456-7890',
      province: 'New York',
    },
    items: [
      {
        clientId: '123',
        name: 'Product 1',
        image: 'https://via.placeholder.com/150',
        price: 100,
        quantity: 1,
        product: '123',
        slug: 'product-1',
        category: 'Category 1',
        countInStock: 10,
      },
    ],
    paymentMethod: 'CashOnDelivery',
    expectedDeliveryDate: new Date(),
    isDelivered: false,
  } as IOrder,
} satisfies OrderInformationProps

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' })

export default async function PurchaseReceiptEmail({
  order,
}: OrderInformationProps) {
  const { site } = await getSetting()

  // ✅ DÉTECTER SI C'EST UNE COMMANDE COD QUI N'EST PAS ENCORE PAYÉE
  const isCashOnDeliveryUnpaid =
    order.paymentMethod === 'CashOnDelivery' && !order.isPaid
  const isCashOnDeliveryPaid =
    order.paymentMethod === 'CashOnDelivery' && order.isPaid

  return (
    <Html>
      <Preview>
        {isCashOnDeliveryUnpaid
          ? `Commande Confirmée - ${site.name}`
          : `Reçu de Paiement - ${site.name}`}
      </Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading className="text-2xl font-bold text-center mb-6">
              {isCashOnDeliveryUnpaid
                ? '🎉 Commande Confirmée !'
                : '✅ Paiement Confirmé !'}
            </Heading>

            {/* Informations de paiement */}
            {isCashOnDeliveryUnpaid && (
              <Section className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <Text className="text-orange-800 font-semibold text-center m-0 mb-2">
                  💳 Paiement à la livraison
                </Text>
                <Text className="text-orange-700 text-center text-sm m-0">
                  Please have the exact amount ready when your order arrives.
                  You&apos;ll receive a receipt upon delivery.
                </Text>
              </Section>
            )}

            {isCashOnDeliveryPaid && (
              <Section className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <Text className="text-green-800 font-semibold text-center m-0 mb-2">
                  ✅ Payment Received
                </Text>
                <Text className="text-green-700 text-center text-sm m-0">
                  Thank you! Your payment has been received and your order is
                  being processed.
                </Text>
              </Section>
            )}

            {/* Salutation personnalisée */}
            {isCashOnDeliveryUnpaid && (
              <Section className="text-center mb-6">
                <Text className="text-lg text-gray-800 m-0 mb-2">
                  Hi {(order.user as { name: string }).name}! 👋
                </Text>
                <Text className="text-gray-600 m-0">
                  We&apos;re excited to confirm your order and get it ready for
                  delivery.
                </Text>
              </Section>
            )}

            {isCashOnDeliveryPaid && (
              <Section className="text-center mb-6">
                <Text className="text-lg text-gray-800 m-0 mb-2">
                  Hi {(order.user as { name: string }).name}! 👋
                </Text>
                <Text className="text-gray-600 m-0">
                  Great news! Your payment has been confirmed and your order is
                  being prepared.
                </Text>
              </Section>
            )}

            {/* Détails de la commande */}
            <Section className="bg-gray-50 rounded-lg p-4 mb-6">
              <Row>
                <Column>
                  <Text className="mb-0 text-gray-500 text-xs font-medium uppercase tracking-wide m-0 mb-1">
                    ID de Commande
                  </Text>
                  <Text className="mt-0 font-mono text-sm m-0">
                    #{order._id.toString().slice(-8)}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-gray-500 text-xs font-medium uppercase tracking-wide m-0 mb-1">
                    Date de Commande
                  </Text>
                  <Text className="mt-0 text-sm m-0">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-gray-500 text-xs font-medium uppercase tracking-wide m-0 mb-1">
                    {isCashOnDeliveryUnpaid ? 'Livraison Prévue' : 'Total Payé'}
                  </Text>
                  <Text className="mt-0 text-sm m-0">
                    {isCashOnDeliveryUnpaid
                      ? dateFormatter.format(order.expectedDeliveryDate)
                      : formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Produits commandés */}
            <Section className="border border-solid border-gray-300 rounded-lg p-4 md:p-6 my-4">
              <Text className="font-bold text-lg mb-4 text-center">
                📦 Articles Commandés
              </Text>
              {order.items.map((item) => (
                <Row key={item.product} className="mt-6 first:mt-0">
                  <Column className="w-20">
                    <Img
                      width="80"
                      alt={item.name}
                      className="rounded"
                      src={
                        item.image.startsWith('/')
                          ? `${site.url}${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className="align-top">
                    <Text className="mx-2 my-0 font-medium">{item.name}</Text>
                    <Text className="mx-2 my-0 text-sm text-gray-600">
                      Quantité: {item.quantity}
                    </Text>
                  </Column>
                  <Column align="right" className="align-top">
                    <Text className="m-0 font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Résumé financier */}
            <Section className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 my-4">
              <Text className="font-bold text-lg mb-4 text-center text-blue-800">
                💰 Résumé de Commande
              </Text>
              {[
                { name: 'Sous-total Articles', price: order.itemsPrice },
                { name: 'Livraison & Manutention', price: order.shippingPrice },
              ].map(({ name, price }) => (
                <Row key={name} className="py-1">
                  <Column>{name}:</Column>
                  <Column align="right" width={70} className="align-top">
                    <Text className="m-0">{formatCurrency(price)}</Text>
                  </Column>
                </Row>
              ))}
              <Row className="py-2 border-t border-blue-300 mt-2">
                <Column className="font-bold text-lg">
                  {isCashOnDeliveryUnpaid ? 'Montant Total Dû' : 'Total Payé'}:
                </Column>
                <Column align="right" width={70} className="align-top">
                  <Text className="m-0 font-bold text-lg text-blue-600">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Informations de livraison pour Paiement à la livraison non payé */}
            {isCashOnDeliveryUnpaid && (
              <Section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 md:p-6 my-4">
                <Text className="font-bold text-lg mb-4 text-center text-yellow-800">
                  🚚 Delivery Information
                </Text>
                <Row>
                  <Column>
                    <Text className="mb-0 text-gray-600 text-sm font-medium m-0 mb-1">
                      Delivery Address
                    </Text>
                    <Text className="mt-0 text-sm m-0">
                      {order.shippingAddress.fullName}
                    </Text>
                    <Text className="mt-0 text-sm m-0">
                      {order.shippingAddress.street}
                    </Text>
                    <Text className="mt-0 text-sm m-0">
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.province}{' '}
                      {order.shippingAddress.postalCode}
                    </Text>
                    <Text className="mt-0 text-sm m-0">
                      {order.shippingAddress.country}
                    </Text>
                  </Column>
                  <Column>
                    <Text className="mb-0 text-gray-600 text-sm font-medium m-0 mb-1">
                      Phone
                    </Text>
                    <Text className="mt-0 text-sm m-0">
                      {order.shippingAddress.phone}
                    </Text>
                    <Text className="mb-0 text-gray-600 text-sm font-medium m-0 mb-1 mt-4">
                      Expected Delivery
                    </Text>
                    <Text className="mt-0 text-sm m-0">
                      {dateFormatter.format(order.expectedDeliveryDate)}
                    </Text>
                  </Column>
                </Row>
              </Section>
            )}

            {/* Actions et support */}
            <Section className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6 my-4 text-center">
              <Text className="text-gray-600 m-0 mb-4">
                Besoin d'aide ou avez-vous des questions sur votre commande ?
              </Text>
              <Row className="justify-center">
                <Column className="text-center">
                  <Text className="m-0">
                    <a
                      href="https://mendel-c.vercel.app/fr/page/customer-service"
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      Contacter le Support
                    </a>
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Footer */}
            <Section className="text-center py-6">
              <Text className="text-gray-500 text-sm m-0 mb-2">
                Merci d'avoir choisi {site.name} !
              </Text>
              <Text className="text-gray-400 text-xs m-0">
                © {new Date().getFullYear()} {site.name}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
