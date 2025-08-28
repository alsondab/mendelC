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
    taxPrice: 0,
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
    paymentMethod: 'Cash On Delivery',
    expectedDeliveryDate: new Date(),
    isDelivered: false,
  } as IOrder,
} satisfies OrderInformationProps

const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' })

export default async function PurchaseReceiptEmail({
  order,
}: OrderInformationProps) {
  const { site } = await getSetting()

  const isCashOnDelivery = order.paymentMethod === 'Cash On Delivery'

  return (
    <Html>
      <Preview>
        {isCashOnDelivery
          ? `Order Confirmed - ${site.name}`
          : `Purchase Receipt - ${site.name}`}
      </Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading className='text-2xl font-bold text-center mb-6'>
              {isCashOnDelivery ? '🎉 Order Confirmed!' : 'Purchase Receipt'}
            </Heading>

            {/* Informations de paiement */}
            {isCashOnDelivery && (
              <Section className='bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6'>
                <Text className='text-orange-800 font-semibold text-center m-0 mb-2'>
                  💳 Cash On Delivery
                </Text>
                <Text className='text-orange-700 text-center text-sm m-0'>
                  Please have the exact amount ready when your order arrives.
                  You&apos;ll receive a receipt upon delivery.
                </Text>
              </Section>
            )}

            {!isCashOnDelivery && (
              <Section className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
                <Text className='text-green-800 font-semibold text-center m-0 mb-2'>
                  ✅ Payment Confirmed
                </Text>
                <Text className='text-green-700 text-center text-sm m-0'>
                  Your payment has been processed successfully.
                </Text>
              </Section>
            )}

            {/* Salutation personnalisée pour Cash On Delivery */}
            {isCashOnDelivery && (
              <Section className='text-center mb-6'>
                <Text className='text-lg text-gray-800 m-0 mb-2'>
                  Hi {(order.user as { name: string }).name}! 👋
                </Text>
                <Text className='text-gray-600 m-0'>
                  We&apos;re excited to confirm your order and get it ready for
                  delivery.
                </Text>
              </Section>
            )}

            {/* Détails de la commande */}
            <Section className='bg-gray-50 rounded-lg p-4 mb-6'>
              <Row>
                <Column>
                  <Text className='mb-0 text-gray-500 text-xs font-medium uppercase tracking-wide m-0 mb-1'>
                    Order ID
                  </Text>
                  <Text className='mt-0 font-mono text-sm m-0'>
                    #{order._id.toString().slice(-8)}
                  </Text>
                </Column>
                <Column>
                  <Text className='mb-0 text-gray-500 text-xs font-medium uppercase tracking-wide m-0 mb-1'>
                    Order Date
                  </Text>
                  <Text className='mt-0 text-sm m-0'>
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column>
                  <Text className='mb-0 text-gray-500 text-xs font-medium uppercase tracking-wide m-0 mb-1'>
                    {isCashOnDelivery ? 'Expected Delivery' : 'Total Paid'}
                  </Text>
                  <Text className='mt-0 text-sm m-0'>
                    {isCashOnDelivery
                      ? dateFormatter.format(order.expectedDeliveryDate)
                      : formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Produits commandés */}
            <Section className='border border-solid border-gray-300 rounded-lg p-4 md:p-6 my-4'>
              <Text className='font-bold text-lg mb-4 text-center'>
                📦 Items Ordered
              </Text>
              {order.items.map((item) => (
                <Row key={item.product} className='mt-6 first:mt-0'>
                  <Column className='w-20'>
                    <Img
                      width='80'
                      alt={item.name}
                      className='rounded'
                      src={
                        item.image.startsWith('/')
                          ? `${site.url}${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className='align-top'>
                    <Text className='mx-2 my-0 font-medium'>{item.name}</Text>
                    <Text className='mx-2 my-0 text-sm text-gray-600'>
                      Quantity: {item.quantity}
                    </Text>
                  </Column>
                  <Column align='right' className='align-top'>
                    <Text className='m-0 font-semibold'>
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Résumé financier */}
            <Section className='bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 my-4'>
              <Text className='font-bold text-lg mb-4 text-center text-blue-800'>
                💰 Order Summary
              </Text>
              {[
                { name: 'Items Subtotal', price: order.itemsPrice },
                { name: 'Shipping & Handling', price: order.shippingPrice },
                { name: 'Tax', price: order.taxPrice },
              ].map(({ name, price }) => (
                <Row key={name} className='py-1'>
                  <Column>{name}:</Column>
                  <Column align='right' width={70} className='align-top'>
                    <Text className='m-0'>{formatCurrency(price)}</Text>
                  </Column>
                </Row>
              ))}
              <Row className='py-2 border-t border-blue-300 mt-2'>
                <Column className='font-bold text-lg'>
                  {isCashOnDelivery ? 'Total Amount Due' : 'Total Paid'}:
                </Column>
                <Column align='right' width={70} className='align-top'>
                  <Text className='m-0 font-bold text-lg text-blue-600'>
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Informations de livraison pour Cash On Delivery */}
            {isCashOnDelivery && (
              <Section className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 md:p-6 my-4'>
                <Text className='font-bold text-lg mb-4 text-center text-yellow-800'>
                  🚚 Delivery Information
                </Text>
                <Row>
                  <Column>
                    <Text className='mb-0 text-gray-600 text-sm font-medium m-0 mb-1'>
                      Delivery Address
                    </Text>
                    <Text className='mt-0 text-sm m-0'>
                      {order.shippingAddress.fullName}
                    </Text>
                    <Text className='mt-0 text-sm m-0'>
                      {order.shippingAddress.street}
                    </Text>
                    <Text className='mt-0 text-sm m-0'>
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.province}{' '}
                      {order.shippingAddress.postalCode}
                    </Text>
                    <Text className='mt-0 text-sm m-0'>
                      {order.shippingAddress.country}
                    </Text>
                  </Column>
                  <Column>
                    <Text className='mb-0 text-gray-600 text-sm font-medium m-0 mb-1'>
                      Phone
                    </Text>
                    <Text className='mt-0 text-sm m-0'>
                      {order.shippingAddress.phone}
                    </Text>
                    <Text className='mb-0 text-gray-600 text-sm font-medium m-0 mb-1 mt-4'>
                      Expected Delivery
                    </Text>
                    <Text className='mt-0 text-sm m-0'>
                      {dateFormatter.format(order.expectedDeliveryDate)}
                    </Text>
                  </Column>
                </Row>
              </Section>
            )}

            {/* Actions et support */}
            <Section className='bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6 my-4 text-center'>
              <Text className='text-gray-600 m-0 mb-4'>
                Need help or have questions about your order?
              </Text>
              <Row className='justify-center'>
                <Column className='text-center'>
                                     <Text className='m-0'>
                     <a
                       href='https://mendel-c.vercel.app/fr/page/customer-service'
                       className='text-blue-600 hover:text-blue-800 underline font-medium'
                     >
                       Contact Support
                     </a>
                   </Text>
                </Column>
              </Row>
            </Section>

            {/* Footer */}
            <Section className='text-center py-6'>
              <Text className='text-gray-500 text-sm m-0 mb-2'>
                Thank you for choosing {site.name}!
              </Text>
              <Text className='text-gray-400 text-xs m-0'>
                © {new Date().getFullYear()} {site.name}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
