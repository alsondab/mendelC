import { HelpCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='p-2 xs:p-3 sm:p-4'>
      <header className='bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl mb-4 xs:mb-6 border border-primary/20 shadow-sm'>
        <div className='max-w-6xl mx-auto p-3 xs:p-4 sm:p-6'>
          <div className='flex justify-between items-center'>
            <Link href='/' className='flex items-center gap-2'>
              <Image
                src='/icons/logo.png'
                alt='logo'
                width={40}
                height={40}
                className='w-8 xs:w-10 sm:w-12'
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
              <span className='text-sm xs:text-base font-semibold text-muted-foreground hidden xs:block'>
                Retour à l'accueil
              </span>
            </Link>
            <div className='text-center'>
              <h1 className='text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground'>
                Finaliser la commande
              </h1>
              <p className='text-xs xs:text-sm text-muted-foreground hidden sm:block'>
                Sécurisé et rapide
              </p>
            </div>
            <div>
              <Link 
                href='/page/help'
                className='flex items-center gap-1 px-2 xs:px-3 py-1 xs:py-2 rounded-lg hover:bg-primary/10 transition-colors'
              >
                <HelpCircle className='w-4 xs:w-5 sm:w-6 h-4 xs:h-5 sm:h-6' />
                <span className='text-xs xs:text-sm font-medium hidden xs:block'>
                  Aide
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
