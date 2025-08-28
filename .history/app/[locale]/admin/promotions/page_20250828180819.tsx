import { Metadata } from 'next'
import PromotionsTable from '@/components/admin/promotions/promotions-table'

export const metadata: Metadata = {
  title: 'Gestion des Promotions - Admin',
  description:
    'Gérez les promotions temporaires et leur expiration automatique',
}

export default function PromotionsPage() {
  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Gestion des Promotions
          </h1>
          <p className='text-muted-foreground'>
            Gérez les promotions temporaires et leur expiration automatique
          </p>
        </div>
      </div>

      <PromotionsTable />
    </div>
  )
}
