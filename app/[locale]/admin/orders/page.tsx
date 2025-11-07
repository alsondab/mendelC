import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import OrdersList from './orders-list'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Admin')
  return {
    title: t('Orders'),
  }
}

export default async function OrdersPage() {
  return <OrdersList />
}
