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
} from '@react-email/components'

import { formatCurrency } from '@/lib/utils'
import { IOrder } from '@/lib/db/models/order.model'
import { getSetting } from '@/lib/actions/setting.actions'

type OrderInformationProps = {
  order: IOrder
}

OrderConfirmationEmail.PreviewProps = {
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
}

const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' })

export default async function OrderConfirmationEmail({
  order,
}: OrderInformationProps) {
  const { site } = await getSetting()
  return (
    <Html>
      <Preview>Order Confirmation - Cash On Delivery</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading className='text-2xl font-bold text-green-600 mb-4'>
              🎉 Order Confirmed!
            </Heading>
            
            <Text className='text-lg mb-4'>
              Hi {order.user.name},
            </Text>
            
            <Text className='mb-4'>
              Thank you for your order! Your order has been successfully placed and will be delivered to your address.
            </Text>
            
            <Text className='mb-4 text-orange-600 font-semibold'>
              💳 Payment Method: Cash On Delivery
            </Text>
            
            <Text className='mb-4'>
              Please have the exact amount ready when your order arrives. You'll receive a receipt upon delivery.
            </Text>
            
            <Section className='border border-solid border-gray-300 rounded-lg p-4 md:p-6 my-4 bg-gray-50'>
              <Text className='font-bold text-lg mb-3'>Order Details</Text>
              <Row>
                <Column>
                  <Text className='mb-0 text-gray-600 text-sm'>
                    Order ID
                  </Text>
                  <Text className='mt-0 font-mono text-sm'>{order._id.toString()}</Text>
                </Column>
                <Column>
                  <Text className='mb-0 text-gray-600 text-sm'>
                    Order Date
                  </Text>
                  <Text className='mt-0 text-sm'>
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column>
                  <Text className='mb-0 text-gray-600 text-sm'>
                    Expected Delivery
                  </Text>
                  <Text className='mt-0 text-sm'>
                    {dateFormatter.format(order.expectedDeliveryDate)}
                  </Text>
                </Column>
              </Row>
            </Section>
            
            <Section className='border border-solid border-gray-300 rounded-lg p-4 md:p-6 my-4'>
              <Text className='font-bold text-lg mb-3'>Items Ordered</Text>
              {order.items.map((item) => (
                <Row key={item.product} className='mt-4 first:mt-0'>
                  <Column className='w-20'>
                    <Link href={`${site.url}/product/${item.slug}`}>
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
                    </Link>
                  </Column>
                  <Column className='align-top'>
                    <Link href={`${site.url}/product/${item.slug}`}>
                      <Text className='mx-2 my-0 font-medium'>
                        {item.name}
                      </Text>
                      <Text className='mx-2 my-0 text-sm text-gray-600'>
                        Quantity: {item.quantity}
                      </Text>
                    </Link>
                  </Column>
                  <Column align='right' className='align-top'>
                    <Text className='m-0 font-semibold'>{formatCurrency(item.price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
            
            <Section className='border border-solid border-gray-300 rounded-lg p-4 md:p-6 my-4 bg-blue-50'>
              <Text className='font-bold text-lg mb-3'>Order Summary</Text>
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
              <Row className='py-2 border-t border-gray-300 mt-2'>
                <Column className='font-bold text-lg'>Total Amount Due:</Column>
                <Column align='right' width={70} className='align-top'>
                  <Text className='m-0 font-bold text-lg text-green-600'>
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>
            
            <Section className='border border-solid border-gray-300 rounded-lg p-4 md:p-6 my-4 bg-yellow-50'>
              <Text className='font-bold text-lg mb-3'>Delivery Information</Text>
              <Text className='mb-2'>
                <strong>Delivery Address:</strong>
              </Text>
              <Text className='mb-2'>
                {order.shippingAddress.fullName}<br />
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </Text>
              <Text className='mb-2'>
                <strong>Phone:</strong> {order.shippingAddress.phone}
              </Text>
              <Text className='mb-2'>
                <strong>Expected Delivery:</strong> {dateFormatter.format(order.expectedDeliveryDate)}
              </Text>
            </Section>
            
            <Section className='text-center my-6'>
              <Text className='text-sm text-gray-600 mb-2'>
                Need help? Contact our support team
              </Text>
              <Link 
                href={`${site.url}/page/contact-us`}
                className='text-blue-600 hover:text-blue-800 underline'
              >
                Contact Support
              </Link>
            </Section>
            
            <Text className='text-sm text-gray-500 text-center'>
              Thank you for choosing {site.name}!
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
