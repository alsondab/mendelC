import { Metadata } from 'next'
import WebPagesList from './web-pages-list'

export const metadata: Metadata = {
  title: 'Admin Web Pages',
}

export default async function WebPageAdminPage() {
  return <WebPagesList />
}
