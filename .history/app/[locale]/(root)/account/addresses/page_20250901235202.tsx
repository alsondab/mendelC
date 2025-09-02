import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Home, MapPin, Plus, Edit, Trash2 } from 'lucide-react'

const PAGE_TITLE = 'Addresses'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

// Mock data - replace with actual data fetching
const mockAddresses = [
  {
    id: '1',
    fullName: 'Jean Dupont',
    street: '123 Rue de la Paix',
    city: 'Paris',
    province: 'Île-de-France',
    postalCode: '75001',
    country: 'France',
    phone: '+33 1 23 45 67 89',
    isDefault: true,
  },
  {
    id: '2',
    fullName: 'Marie Martin',
    street: '456 Avenue des Champs',
    city: 'Lyon',
    province: 'Auvergne-Rhône-Alpes',
    postalCode: '69001',
    country: 'France',
    phone: '+33 4 56 78 90 12',
    isDefault: false,
  },
]

export default function AddressesPage() {
  return (
    <div className='p-1 xs:p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto'>
      <div className='mb-6 xs:mb-8'>
        <nav className='flex items-center gap-2 text-sm xs:text-base mb-4'>
          <Link
            href='/account'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            Votre compte
          </Link>
          <span className='text-muted-foreground'>›</span>
          <span className='text-foreground font-medium'>{PAGE_TITLE}</span>
        </nav>

        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-2'>
              {PAGE_TITLE}
            </h1>
            <p className='text-sm xs:text-base text-muted-foreground'>
              Gérez vos adresses de livraison
            </p>
          </div>
          <Button className='rounded-full text-sm xs:text-base'>
            <Plus className='w-4 h-4 mr-2' />
            Ajouter une adresse
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6'>
        {mockAddresses.map((address) => (
          <Card
            key={address.id}
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
                    Par défaut
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
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1 text-xs xs:text-sm'
                >
                  <Edit className='w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2' />
                  Modifier
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1 text-xs xs:text-sm text-red-600 hover:text-red-700 hover:bg-red-50'
                >
                  <Trash2 className='w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2' />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockAddresses.length === 0 && (
        <Card className='shadow-sm'>
          <CardContent className='text-center py-8 xs:py-12'>
            <div className='flex flex-col items-center gap-4'>
              <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center'>
                <Home className='w-8 h-8 text-muted-foreground' />
              </div>
              <div>
                <h3 className='text-base xs:text-lg font-medium text-foreground mb-2'>
                  Aucune adresse
                </h3>
                <p className='text-sm xs:text-base text-muted-foreground mb-4'>
                  Vous n&apos;avez pas encore ajouté d&apos;adresse de livraison
                </p>
                <Button className='rounded-full text-sm xs:text-base'>
                  <Plus className='w-4 h-4 mr-2' />
                  Ajouter votre première adresse
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
