import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

import { ProfileForm } from './profile-form'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Manage')
  return {
    title: t('Update Name'),
  }
}

export default async function ProfilePage() {
  const session = await auth()
  const { site } = await getSetting()
  const t = await getTranslations('Manage')
  const tAccount = await getTranslations('Account')
  
  return (
    <div className='p-1 xs:p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto mb-24'>
      <SessionProvider session={session}>
        <div className='mb-6 xs:mb-8'>
          <nav className='flex items-center gap-2 text-sm xs:text-base mb-4'>
            <Link
              href='/account'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              {tAccount('Your Account')}
            </Link>
            <span className='text-muted-foreground'>›</span>
            <Link
              href='/account/manage'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              {t('Login & Security')}
            </Link>
            <span className='text-muted-foreground'>›</span>
            <span className='text-foreground font-medium'>{t('Update Name')}</span>
          </nav>

          <div>
            <h1 className='text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-2'>
              {t('Update Name')}
            </h1>
            <p className='text-sm xs:text-base text-muted-foreground'>
              {t('Update Name Description')}
            </p>
          </div>
        </div>

        <div className='max-w-4xl'>
          <Card className='shadow-sm'>
            <CardContent className='p-4 xs:p-6'>
              <div className='mb-6'>
                <p className='text-sm xs:text-base text-muted-foreground leading-relaxed'>
                  {t('Update Name Instructions', { name: site.name })}
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
