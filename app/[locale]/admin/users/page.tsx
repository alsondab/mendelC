import { Metadata } from 'next'
import UsersList from './users-list'

export const metadata: Metadata = {
  title: 'Admin Users',
}

export default async function AdminUser() {
  return <UsersList />
}
