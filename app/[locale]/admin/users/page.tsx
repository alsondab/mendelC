import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import UsersList from './users-list'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Admin')
  return {
    title: t('Users'),
  }
}

export default async function AdminUser() {
  return <UsersList />
}
