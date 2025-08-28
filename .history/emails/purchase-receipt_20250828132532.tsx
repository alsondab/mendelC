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
        <Head>
          <style>
            {`
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              @keyframes slideInLeft {
                from {
                  opacity: 0;
                  transform: translateX(-20px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
              
              @keyframes pulse {
                0%, 100% {
                  opacity: 1;
                }
                50% {
                  opacity: 0.8;
                }
              }
              
              .animate-fade-in-up {
                animation: fadeInUp 0.6s ease-out;
              }
              
              .animate-slide-in-left {
                animation: slideInLeft 0.6s ease-out;
              }
              
              .animate-pulse {
                animation: pulse 2s infinite;
              }
              
              .gradient-text {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              
              .hover-lift {
                transition: transform 0.2s ease, box-shadow 0.2s ease;
              }
              
              .hover-lift:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
              }
            `}
          </style>
        </Head>
        <Body className='font-sans bg-gradient-to-br from-gray-50 to-blue-50 m-0 p-0'>
          {/* Header avec logo */}
          <Container className='max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden'>
            <Section className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-10 text-center'>
              <Heading className='text-4xl font-bold text-white m-0 mb-3 animate-fade-in-up'>
                {isCashOnDelivery ? 'Order Confirmed' : 'Purchase Complete'}
              </Heading>
              <Text className='text-indigo-100 text-xl m-0 font-medium animate-slide-in-left'>
                {isCashOnDelivery
                  ? 'Your order has been successfully placed'
                  : 'Thank you for your purchase'}
              </Text>
            </Section>

            {/* Informations principales */}
            <Section className='px-6 py-8'>
              {isCashOnDelivery && (
                <div className='bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-6 mb-8 rounded-r-xl shadow-sm animate-fade-in-up'>
                  <Text className='text-amber-800 font-bold text-lg m-0 mb-3'>
                    Payment Method: Cash On Delivery
                  </Text>
                  <Text className='text-amber-700 text-base m-0 leading-relaxed'>
                    Please have the exact amount ready when your order arrives.
                    You'll receive a receipt upon delivery.
                  </Text>
                </div>
              )}

              {!isCashOnDelivery && (
                <div className='bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 p-6 mb-8 rounded-r-xl shadow-sm animate-fade-in-up'>
                  <Text className='text-emerald-800 font-bold text-lg m-0 mb-3'>
                    Payment Status: Confirmed
                  </Text>
                  <Text className='text-emerald-700 text-base m-0 leading-relaxed'>
                    Your payment has been processed successfully and your order
                    is being prepared.
                  </Text>
                </div>
              )}

              {/* Détails de la commande */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                <div className='bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl text-center shadow-sm hover-lift'>
                  <Text className='text-slate-600 text-xs font-semibold uppercase tracking-wider m-0 mb-2'>
                    Order ID
                  </Text>
                  <Text className='text-slate-900 font-mono text-lg font-bold m-0'>
                    #{order._id.toString().slice(-8)}
                  </Text>
                </div>
                <div className='bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl text-center shadow-sm hover-lift'>
                  <Text className='text-slate-600 text-xs font-semibold uppercase tracking-wider m-0 mb-2'>
                    Order Date
                  </Text>
                  <Text className='text-slate-900 text-lg font-semibold m-0'>
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </div>
                <div className='bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl text-center shadow-sm hover-lift'>
                  <Text className='text-slate-600 text-xs font-semibold uppercase tracking-wider m-0 mb-2'>
                    {isCashOnDelivery ? 'Expected Delivery' : 'Total Paid'}
                  </Text>
                  <Text className='text-slate-900 text-lg font-semibold m-0'>
                    {isCashOnDelivery
                      ? dateFormatter.format(order.expectedDeliveryDate)
                      : formatCurrency(order.totalPrice)}
                  </Text>
                </div>
              </div>

              {/* Salutation personnalisée */}
              {isCashOnDelivery && (
                <div className='mb-8 text-center'>
                  <Text className='text-2xl text-slate-800 font-bold m-0 mb-3 gradient-text'>
                    Hi {(order.user as { name: string }).name}!
                  </Text>
                  <Text className='text-slate-600 text-lg m-0 leading-relaxed'>
                    We're excited to confirm your order and get it ready for
                    delivery.
                  </Text>
                </div>
              )}
            </Section>

            {/* Produits commandés */}
            <Section className='px-6 pb-8'>
              <Heading className='text-2xl font-bold text-slate-800 m-0 mb-6 text-center'>
                Items Ordered
              </Heading>
              <div className='space-y-4'>
                {order.items.map((item, index) => (
                  <div
                    key={item.product}
                    className='bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 shadow-sm hover-lift'
                  >
                    <div className='flex items-start space-x-6'>
                      <div className='flex-shrink-0'>
                        <Link href={`${site.url}/product/${item.slug}`}>
                          <Img
                            width='80'
                            height='80'
                            alt={item.name}
                            className='rounded-xl object-cover shadow-md'
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
                          <Text className='text-slate-900 font-bold text-lg m-0 mb-2 hover:text-indigo-600 transition-colors'>
                            {item.name}
                          </Text>
                        </Link>
                        <Text className='text-slate-600 text-base m-0'>
                          Quantity: {item.quantity} • Unit Price:{' '}
                          {formatCurrency(item.price)}
                        </Text>
                      </div>
                      <div className='flex-shrink-0 text-right'>
                        <Text className='text-slate-900 font-bold text-xl m-0'>
                          {formatCurrency(item.price * item.quantity)}
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Résumé financier */}
            <Section className='px-6 pb-8'>
              <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-lg'>
                <Heading className='text-2xl font-bold text-slate-800 m-0 mb-6 text-center'>
                  Order Summary
                </Heading>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center py-3 border-b border-blue-200'>
                    <Text className='text-slate-700 font-medium text-lg m-0'>
                      Items Subtotal
                    </Text>
                    <Text className='text-slate-900 font-semibold text-lg m-0'>
                      {formatCurrency(order.itemsPrice)}
                    </Text>
                  </div>
                  <div className='flex justify-between items-center py-3 border-b border-blue-200'>
                    <Text className='text-slate-700 font-medium text-lg m-0'>
                      Shipping & Handling
                    </Text>
                    <Text className='text-slate-900 font-semibold text-lg m-0'>
                      {formatCurrency(order.shippingPrice)}
                    </Text>
                  </div>
                  <div className='flex justify-between items-center py-3 border-b border-blue-200'>
                    <Text className='text-slate-700 font-medium text-lg m-0'>
                      Tax
                    </Text>
                    <Text className='text-slate-900 font-semibold text-lg m-0'>
                      {formatCurrency(order.taxPrice)}
                    </Text>
                  </div>
                  <div className='flex justify-between items-center py-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg px-4'>
                    <Text className='text-slate-800 font-bold text-xl m-0'>
                      {isCashOnDelivery ? 'Total Amount Due' : 'Total Paid'}
                    </Text>
                    <Text className='text-indigo-600 font-bold text-2xl m-0'>
                      {formatCurrency(order.totalPrice)}
                    </Text>
                  </div>
                </div>
              </div>
            </Section>

            {/* Informations de livraison pour Cash On Delivery */}
            {isCashOnDelivery && (
              <Section className='px-6 pb-8'>
                <div className='bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 shadow-lg'>
                  <Heading className='text-2xl font-bold text-slate-800 m-0 mb-6 text-center'>
                    Delivery Information
                  </Heading>
                  <div className='space-y-6'>
                    <div className='bg-white rounded-lg p-6 shadow-sm'>
                      <Text className='text-slate-700 font-semibold text-lg m-0 mb-3'>
                        Delivery Address
                      </Text>
                      <div className='space-y-2'>
                        <Text className='text-slate-900 font-medium m-0'>
                          {order.shippingAddress.fullName}
                        </Text>
                        <Text className='text-slate-700 m-0'>
                          {order.shippingAddress.street}
                        </Text>
                        <Text className='text-slate-700 m-0'>
                          {order.shippingAddress.city},{' '}
                          {order.shippingAddress.province}{' '}
                          {order.shippingAddress.postalCode}
                        </Text>
                        <Text className='text-slate-700 m-0'>
                          {order.shippingAddress.country}
                        </Text>
                      </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='bg-white rounded-lg p-6 shadow-sm'>
                        <Text className='text-slate-700 font-semibold text-lg m-0 mb-3'>
                          Contact Phone
                        </Text>
                        <Text className='text-slate-900 font-medium text-lg m-0'>
                          {order.shippingAddress.phone}
                        </Text>
                      </div>
                      <div className='bg-white rounded-lg p-6 shadow-sm'>
                        <Text className='text-slate-700 font-semibold text-lg m-0 mb-3'>
                          Expected Delivery
                        </Text>
                        <Text className='text-slate-900 font-medium text-lg m-0'>
                          {dateFormatter.format(order.expectedDeliveryDate)}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* Actions et support */}
            <Section className='px-6 pb-8'>
              <div className='bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-8 text-center shadow-lg'>
                <Text className='text-slate-700 text-xl font-medium m-0 mb-6'>
                  Need help or have questions about your order?
                </Text>
                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                  <Link
                    href={`${site.url}/fr/page/customer-service`}
                    className='inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg text-decoration-none shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105'
                  >
                    Contact Support
                  </Link>
                  <Link
                    href={`${site.url}/account/orders`}
                    className='inline-block bg-gradient-to-r from-slate-600 to-gray-600 text-white px-8 py-4 rounded-xl font-bold text-lg text-decoration-none shadow-lg hover:from-slate-700 hover:to-gray-700 transition-all duration-300 transform hover:scale-105'
                  >
                    View Order Details
                  </Link>
                </div>
              </div>
            </Section>

            {/* Footer */}
            <Section className='px-6 py-8 bg-gradient-to-r from-slate-900 to-gray-900 text-center'>
              <Text className='text-slate-300 text-lg font-medium m-0 mb-3'>
                Thank you for choosing {site.name}!
              </Text>
              <Text className='text-slate-400 text-sm m-0'>
                © {new Date().getFullYear()} {site.name}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
