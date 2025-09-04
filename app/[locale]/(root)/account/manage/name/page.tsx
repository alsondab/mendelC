import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

import { ProfileForm } from './profile-form'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { getSetting } from '@/lib/actions/setting.actions'

const PAGE_TITLE = 'Modifier Votre Nom'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

export default async function ProfilePage() {
  const session = await auth()
  const { site } = await getSetting()
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
            <Link
              href='/account/manage'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Connexion & sécurité
            </Link>
            <span className='text-muted-foreground'>›</span>
            <span className='text-foreground font-medium'>{PAGE_TITLE}</span>
          </nav>

          <div>
            <h1 className='text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-2'>
              {PAGE_TITLE}
            </h1>
            <p className='text-sm xs:text-base text-muted-foreground'>
              Modifiez le nom associé à votre compte
            </p>
          </div>
        </div>

        <div className='max-w-4xl'>
          <Card className='shadow-sm'>
            <CardContent className='p-4 xs:p-6'>
              <div className='mb-6'>
                <p className='text-sm xs:text-base text-muted-foreground leading-relaxed'>
                  Si vous souhaitez modifier le nom associé à votre compte{' '}
                  {site.name}, vous pouvez le faire ci-dessous. Assurez-vous de
                  cliquer sur le bouton &quot;Enregistrer les
                  modifications&quot; lorsque vous avez terminé.
                </p>
              </div>
              <ProfileForm />
            </CardContent>
          </Card>
        </div>
      </SessionProvider>
    </div>
  )
}
