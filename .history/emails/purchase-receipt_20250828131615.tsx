import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  Hr,
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

const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export default async function PurchaseReceiptEmail({
  order,
}: OrderInformationProps) {
  const { site } = await getSetting()

  const isCashOnDelivery = order.paymentMethod === 'Cash On Delivery'
  const isPaid = order.isPaid || !isCashOnDelivery

  return (
    <Html>
      <Preview>
        {isCashOnDelivery
          ? `Order Confirmed - ${site.name}`
          : `Purchase Receipt - ${site.name}`}
      </Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-gray-50 m-0 p-0'>
          {/* Header avec logo */}
          <Container className='max-w-2xl mx-auto bg-white'>
            <Section className='bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-center'>
              <Heading className='text-3xl font-bold text-white m-0 mb-2'>
                {isCashOnDelivery
                  ? '🎉 Order Confirmed!'
                  : '✅ Purchase Complete!'}
              </Heading>
              <Text className='text-blue-100 text-lg m-0'>
                {isCashOnDelivery
                  ? 'Your order has been successfully placed'
                  : 'Thank you for your purchase'}
              </Text>
            </Section>

            {/* Informations principales */}
            <Section className='px-6 py-6'>
              {isCashOnDelivery && (
                <div className='bg-orange-50 border-l-4 border-orange-400 p-4 mb-6 rounded-r-lg'>
                  <Text className='text-orange-800 font-semibold m-0 mb-2'>
                    💳 Cash On Delivery
                  </Text>
                  <Text className='text-orange-700 text-sm m-0'>
                    Please have the exact amount ready when your order arrives.
                    You'll receive a receipt upon delivery.
                  </Text>
                </div>
              )}

              {!isCashOnDelivery && (
                <div className='bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg'>
                  <Text className='text-green-800 font-semibold m-0 mb-2'>
                    ✅ Payment Confirmed
                  </Text>
                  <Text className='text-green-700 text-sm m-0'>
                    Your payment has been processed successfully.
                  </Text>
                </div>
              )}

              {/* Détails de la commande */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                <div className='bg-gray-50 p-4 rounded-lg text-center'>
                  <Text className='text-gray-600 text-xs font-medium uppercase tracking-wide m-0 mb-1'>
                    Order ID
                  </Text>
                  <Text className='text-gray-900 font-mono text-sm m-0'>
                    #{order._id.toString().slice(-8)}
                  </Text>
                </div>
                <div className='bg-gray-50 p-4 rounded-lg text-center'>
                  <Text className='text-gray-600 text-xs font-medium uppercase tracking-wide m-0 mb-1'>
                    Order Date
                  </Text>
                  <Text className='text-gray-900 text-sm m-0'>
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </div>
                <div className='bg-gray-50 p-4 rounded-lg text-center'>
                  <Text className='text-gray-600 text-xs font-medium uppercase tracking-wide m-0 mb-1'>
                    {isCashOnDelivery ? 'Expected Delivery' : 'Total Paid'}
                  </Text>
                  <Text className='text-gray-900 text-sm m-0'>
                    {isCashOnDelivery
                      ? dateFormatter.format(order.expectedDeliveryDate)
                      : formatCurrency(order.totalPrice)}
                  </Text>
                </div>
              </div>

              {/* Salutation personnalisée */}
              {isCashOnDelivery && (
                <div className='mb-6'>
                  <Text className='text-xl text-gray-900 m-0 mb-2'>
                    Hi {(order.user as { name: string }).name}! 👋
                  </Text>
                  <Text className='text-gray-600 m-0'>
                    We're excited to confirm your order and get it ready for
                    delivery.
                  </Text>
                </div>
              )}
            </Section>

            {/* Produits commandés */}
            <Section className='px-6 pb-6'>
              <Heading className='text-xl font-semibold text-gray-900 m-0 mb-4'>
                📦 Items Ordered
              </Heading>
              <div className='space-y-4'>
                {order.items.map((item, index) => (
                  <div key={item.product} className='bg-gray-50 rounded-lg p-4'>
                    <div className='flex items-start space-x-4'>
                      <div className='flex-shrink-0'>
                        <Link href={`${site.url}/product/${item.slug}`}>
                          <Img
                            width='60'
                            height='60'
                            alt={item.name}
                            className='rounded-lg object-cover'
                            src={
                              item.image.startsWith('/')
                                ? `${site.url}${item.image}`
                                : item.image
                            }
                          />
                        </Link>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <Link href={`${site.url}/product/${item.slug}`}>
                          <Text className='text-gray-900 font-medium m-0 mb-1'>
                            {item.name}
                          </Text>
                        </Link>
                        <Text className='text-gray-500 text-sm m-0'>
                          Quantity: {item.quantity} •{' '}
                          {formatCurrency(item.price)}
                        </Text>
                      </div>
                      <div className='flex-shrink-0 text-right'>
                        <Text className='text-gray-900 font-semibold m-0'>
                          {formatCurrency(item.price * item.quantity)}
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Résumé financier */}
            <Section className='px-6 pb-6'>
              <div className='bg-blue-50 rounded-lg p-6'>
                <Heading className='text-lg font-semibold text-gray-900 m-0 mb-4'>
                  💰 Order Summary
                </Heading>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <Text className='text-gray-600 m-0'>Items Subtotal</Text>
                    <Text className='text-gray-900 m-0'>
                      {formatCurrency(order.itemsPrice)}
                    </Text>
                  </div>
                  <div className='flex justify-between'>
                    <Text className='text-gray-600 m-0'>
                      Shipping & Handling
                    </Text>
                    <Text className='text-gray-900 m-0'>
                      {formatCurrency(order.shippingPrice)}
                    </Text>
                  </div>
                  <div className='flex justify-between'>
                    <Text className='text-gray-600 m-0'>Tax</Text>
                    <Text className='text-gray-900 m-0'>
                      {formatCurrency(order.taxPrice)}
                    </Text>
                  </div>
                  <Hr className='border-gray-300 my-3' />
                  <div className='flex justify-between'>
                    <Text className='text-lg font-bold text-gray-900 m-0'>
                      {isCashOnDelivery ? 'Total Amount Due' : 'Total Paid'}
                    </Text>
                    <Text className='text-lg font-bold text-blue-600 m-0'>
                      {formatCurrency(order.totalPrice)}
                    </Text>
                  </div>
                </div>
              </div>
            </Section>

            {/* Informations de livraison pour Cash On Delivery */}
            {isCashOnDelivery && (
              <Section className='px-6 pb-6'>
                <div className='bg-yellow-50 rounded-lg p-6'>
                  <Heading className='text-lg font-semibold text-gray-900 m-0 mb-4'>
                    🚚 Delivery Information
                  </Heading>
                  <div className='space-y-3'>
                    <div>
                      <Text className='text-gray-600 text-sm font-medium m-0 mb-1'>
                        Delivery Address
                      </Text>
                      <Text className='text-gray-900 m-0'>
                        {order.shippingAddress.fullName}
                      </Text>
                      <Text className='text-gray-900 m-0'>
                        {order.shippingAddress.street}
                      </Text>
                      <Text className='text-gray-900 m-0'>
                        {order.shippingAddress.city},{' '}
                        {order.shippingAddress.province}{' '}
                        {order.shippingAddress.postalCode}
                      </Text>
                      <Text className='text-gray-900 m-0'>
                        {order.shippingAddress.country}
                      </Text>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <Text className='text-gray-600 text-sm font-medium m-0 mb-1'>
                          Phone
                        </Text>
                        <Text className='text-gray-900 m-0'>
                          {order.shippingAddress.phone}
                        </Text>
                      </div>
                      <div>
                        <Text className='text-gray-600 text-sm font-medium m-0 mb-1'>
                          Expected Delivery
                        </Text>
                        <Text className='text-gray-900 m-0'>
                          {dateFormatter.format(order.expectedDeliveryDate)}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* Actions et support */}
            <Section className='px-6 pb-6'>
              <div className='bg-gray-50 rounded-lg p-6 text-center'>
                <Text className='text-gray-600 m-0 mb-4'>
                  Need help or have questions about your order?
                </Text>
                <div className='space-y-3'>
                  <Link
                    href={`${site.url}/page/contact-us`}
                    className='inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-decoration-none hover:bg-blue-700'
                  >
                    Contact Support
                  </Link>
                  <br />
                  <Link
                    href={`${site.url}/account/orders`}
                    className='inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium text-decoration-none hover:bg-gray-300'
                  >
                    View Order Details
                  </Link>
                </div>
              </div>
            </Section>

            {/* Footer */}
            <Section className='px-6 py-6 bg-gray-900 text-center'>
              <Text className='text-gray-400 text-sm m-0 mb-2'>
                Thank you for choosing {site.name}!
              </Text>
              <Text className='text-gray-500 text-xs m-0'>
                © {new Date().getFullYear()} {site.name}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
