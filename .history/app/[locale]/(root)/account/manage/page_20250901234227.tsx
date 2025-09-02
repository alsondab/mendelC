import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const PAGE_TITLE = 'Login & Security'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}
export default async function ProfilePage() {
  const session = await auth()
  return (
    <div className='p-1 xs:p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto mb-24'>
      <SessionProvider session={session}>
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
          
          <div>
            <h1 className='text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-2'>
              {PAGE_TITLE}
            </h1>
            <p className='text-sm xs:text-base text-muted-foreground'>
              Gérez vos informations de connexion et de sécurité
            </p>
          </div>
        </div>

        <div className='max-w-4xl'>
          <Card className='shadow-sm'>
            <CardContent className='p-4 xs:p-6'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div className='flex-1'>
                  <h3 className='text-base xs:text-lg font-bold text-foreground mb-1'>
                    Nom
                  </h3>
                  <p className='text-sm xs:text-base text-muted-foreground mb-1'>
                    {session?.user.name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Votre nom d&apos;affichage public
                  </p>
                </div>
                <div className='flex-shrink-0'>
                  <Link href='/account/manage/name'>
                    <Button 
                      className='rounded-full w-full sm:w-32 text-sm xs:text-base' 
                      variant='outline'
                    >
                      Modifier
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
            
            <Separator />
            
            <CardContent className='p-4 xs:p-6'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div className='flex-1'>
                  <h3 className='text-base xs:text-lg font-bold text-foreground mb-1'>
                    Email
                  </h3>
                  <p className='text-sm xs:text-base text-muted-foreground mb-1'>
                    {session?.user.email}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Sera implémenté dans la prochaine version
                  </p>
                </div>
                <div className='flex-shrink-0'>
                  <Link href='#'>
                    <Button
                      disabled
                      className='rounded-full w-full sm:w-32 text-sm xs:text-base'
                      variant='outline'
                    >
                      Modifier
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
            
            <Separator />
            
            <CardContent className='p-4 xs:p-6'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div className='flex-1'>
                  <h3 className='text-base xs:text-lg font-bold text-foreground mb-1'>
                    Mot de passe
                  </h3>
                  <p className='text-sm xs:text-base text-muted-foreground mb-1'>
                    ************
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Sera implémenté dans la prochaine version
                  </p>
                </div>
                <div className='flex-shrink-0'>
                  <Link href='#'>
                    <Button
                      disabled
                      className='rounded-full w-full sm:w-32 text-sm xs:text-base'
                      variant='outline'
                    >
                      Modifier
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SessionProvider>
    </div>
  )
}
