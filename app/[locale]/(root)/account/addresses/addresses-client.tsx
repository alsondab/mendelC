'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Home,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Star,
} from 'lucide-react'
import { IAddress } from '@/types'
import {
  deleteAddress,
  setDefaultAddress,
} from '@/lib/actions/address.actions'
import { toast } from '@/hooks/use-toast'
import AddressDialog from './address-dialog'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface AddressesClientProps {
  addresses: IAddress[]
}

export default function AddressesClient({
  addresses: initialAddresses,
}: AddressesClientProps) {
  const [addresses, setAddresses] = useState<IAddress[]>(initialAddresses)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editAddress, setEditAddress] = useState<IAddress | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const t = useTranslations('Address')

  const handleOpenDialog = (address?: IAddress) => {
    setEditAddress(address || null)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditAddress(null)
    router.refresh() // Refresh pour récupérer les nouvelles données
  }

  const handleDelete = (addressId: string) => {
    setAddressToDelete(addressId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!addressToDelete) return

    startTransition(async () => {
      const result = await deleteAddress(addressToDelete)
      if (result.success) {
        toast({
          title: t('Success'),
          description: result.message || t('Address deleted successfully'),
        })
        setAddresses(addresses.filter((a) => a._id !== addressToDelete))
        setDeleteDialogOpen(false)
        setAddressToDelete(null)
        router.refresh()
      } else {
        toast({
          title: t('Error'),
          description: result.message || t('Failed to delete address'),
          variant: 'destructive',
        })
      }
    })
  }

  const handleSetDefault = (addressId: string) => {
    startTransition(async () => {
      const result = await setDefaultAddress(addressId)
      if (result.success) {
        toast({
          title: t('Success'),
          description: result.message || t('Address set as default successfully'),
        })
        // Mettre à jour l'état local
        setAddresses(
          addresses.map((a) => ({
            ...a,
            isDefault: a._id === addressId,
          }))
        )
        router.refresh()
      } else {
        toast({
          title: t('Error'),
          description: result.message || t('Failed to set default address'),
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <>
      <div className='p-1 xs:p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto'>
        <div className='mb-6 xs:mb-8'>
          <nav className='flex items-center gap-2 text-sm xs:text-base mb-4'>
            <Link
              href='/account'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              {t('Your Account')}
            </Link>
            <span className='text-muted-foreground'>›</span>
            <span className='text-foreground font-medium'>{t('Addresses')}</span>
          </nav>

          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <div>
              <h1 className='text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-2'>
                {t('Addresses')}
              </h1>
              <p className='text-sm xs:text-base text-muted-foreground'>
                {t('Manage your delivery addresses')}
              </p>
            </div>
            <Button
              className='rounded-full text-sm xs:text-base'
              onClick={() => handleOpenDialog()}
            >
              <Plus className='w-4 h-4 mr-2' />
              {t('Add Address')}
            </Button>
          </div>
        </div>

        {addresses.length === 0 ? (
          <Card className='shadow-sm'>
            <CardContent className='text-center py-8 xs:py-12'>
              <div className='flex flex-col items-center gap-4'>
                <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center'>
                  <Home className='w-8 h-8 text-muted-foreground' />
                </div>
                <div>
                  <h3 className='text-base xs:text-lg font-medium text-foreground mb-2'>
                    {t('No Address')}
                  </h3>
                  <p className='text-sm xs:text-base text-muted-foreground mb-4'>
                    {t('No address description')}
                  </p>
                  <Button
                    className='rounded-full text-sm xs:text-base'
                    onClick={() => handleOpenDialog()}
                  >
                    <Plus className='w-4 h-4 mr-2' />
                    {t('Add your first address')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6'>
            {addresses.map((address) => (
              <Card
                key={address._id}
                className='shadow-sm hover:shadow-md transition-shadow'
              >
                <CardHeader className='pb-3'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-base xs:text-lg flex items-center gap-2'>
                      <MapPin className='w-4 h-4 text-muted-foreground' />
                      {address.fullName}
                    </CardTitle>
                    {address.isDefault && (
                      <Badge variant='secondary' className='text-xs'>
                        {t('Default')}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className='pt-0'>
                  <div className='space-y-2 text-sm xs:text-base text-muted-foreground mb-4'>
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.province}, {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                    <p className='text-xs xs:text-sm'>{address.phone}</p>
                  </div>

                  <div className='flex flex-col xs:flex-row gap-2'>
                    {!address.isDefault && (
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex-1 text-xs xs:text-sm'
                        onClick={() => handleSetDefault(address._id)}
                        disabled={isPending}
                      >
                        <Star className='w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2' />
                        {t('Set as default')}
                      </Button>
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex-1 text-xs xs:text-sm'
                      onClick={() => handleOpenDialog(address)}
                    >
                      <Edit className='w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2' />
                      {t('Edit')}
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex-1 text-xs xs:text-sm text-red-600 hover:text-red-700 hover:bg-red-50'
                      onClick={() => handleDelete(address._id)}
                      disabled={isPending}
                    >
                      <Trash2 className='w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2' />
                      {t('Delete')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddressDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        address={editAddress}
        mode={editAddress ? 'edit' : 'create'}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Delete Address')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Delete Address Description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {t('Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className='bg-red-600 hover:bg-red-700'
            >
              {isPending ? t('Deleting') : t('Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

