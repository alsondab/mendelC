import { Card, CardContent } from '@/components/ui/card'
import { Home, PackageCheckIcon, User, Settings } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

const PAGE_TITLE = 'Votre Compte'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}
export default function AccountPage() {
  return (
    <div className='p-1 xs:p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto'>
      <div className='mb-6 xs:mb-8'>
        <h1 className='text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-2'>
          {PAGE_TITLE}
        </h1>
        <p className='text-sm xs:text-base text-muted-foreground'>
          Gérez vos commandes, paramètres de compte et préférences
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 mb-8 xs:mb-12'>
        <Card className='group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-sm'>
          <Link href='/account/orders'>
            <CardContent className='flex items-start gap-3 xs:gap-4 p-4 xs:p-6'>
              <div className='flex-shrink-0'>
                <div className='w-10 h-10 xs:w-12 xs:h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors'>
                  <PackageCheckIcon className='w-5 h-5 xs:w-6 xs:h-6 text-blue-600' />
                </div>
              </div>
              <div className='flex-1 min-w-0'>
                <h2 className='text-lg xs:text-xl font-bold text-foreground mb-1 xs:mb-2'>
                  Commandes
                </h2>
                <p className='text-xs xs:text-sm text-muted-foreground leading-relaxed'>
                  Suivez, retournez, annulez une commande, téléchargez une
                  facture ou rachetez
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className='group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-sm'>
          <Link href='/account/manage'>
            <CardContent className='flex items-start gap-3 xs:gap-4 p-4 xs:p-6'>
              <div className='flex-shrink-0'>
                <div className='w-10 h-10 xs:w-12 xs:h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors'>
                  <User className='w-5 h-5 xs:w-6 xs:h-6 text-green-600' />
                </div>
              </div>
              <div className='flex-1 min-w-0'>
                <h2 className='text-lg xs:text-xl font-bold text-foreground mb-1 xs:mb-2'>
                  Connexion & sécurité
                </h2>
                <p className='text-xs xs:text-sm text-muted-foreground leading-relaxed'>
                  Gérez votre mot de passe, email et numéro de téléphone
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className='group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-sm'>
          <Link href='/account/addresses'>
            <CardContent className='flex items-start gap-3 xs:gap-4 p-4 xs:p-6'>
              <div className='flex-shrink-0'>
                <div className='w-10 h-10 xs:w-12 xs:h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors'>
                  <Home className='w-5 h-5 xs:w-6 xs:h-6 text-orange-600' />
                </div>
              </div>
              <div className='flex-1 min-w-0'>
                <h2 className='text-lg xs:text-xl font-bold text-foreground mb-1 xs:mb-2'>
                  Adresses
                </h2>
                <p className='text-xs xs:text-sm text-muted-foreground leading-relaxed'>
                  Modifiez, supprimez ou définissez une adresse par défaut
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className='group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-sm'>
          <Link href='/account/settings'>
            <CardContent className='flex items-start gap-3 xs:gap-4 p-4 xs:p-6'>
              <div className='flex-shrink-0'>
                <div className='w-10 h-10 xs:w-12 xs:h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors'>
                  <Settings className='w-5 h-5 xs:w-6 xs:h-6 text-purple-600' />
                </div>
              </div>
              <div className='flex-1 min-w-0'>
                <h2 className='text-lg xs:text-xl font-bold text-foreground mb-1 xs:mb-2'>
                  Réglages
                </h2>
                <p className='text-xs xs:text-sm text-muted-foreground leading-relaxed'>
                  Préférences, notifications, confidentialité et paramètres
                  avancés
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div className='mt-8 xs:mt-12'></div>
    </div>
  )
}
