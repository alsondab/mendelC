import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getUserAddresses } from '@/lib/actions/address.actions'
import AddressesClient from './addresses-client'
import type { IAddress } from '@/types'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Address')
  return {
    title: t('Addresses'),
  }
}

export default async function AddressesPage() {
  const result = await getUserAddresses()
  // Transformer les adresses pour garantir que isDefault est toujours un boolean
  const addresses: IAddress[] =
    result.success && result.data
      ? result.data.map((addr) => ({
          ...addr,
          isDefault: addr.isDefault ?? false,
        }))
      : []

  return <AddressesClient addresses={addresses} />
}
