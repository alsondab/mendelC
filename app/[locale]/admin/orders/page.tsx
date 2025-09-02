import { Metadata } from 'next'
import OrdersList from './orders-list'

export const metadata: Metadata = {
  title: 'Admin Orders',
}

export default async function OrdersPage() {
  return <OrdersList />
}
