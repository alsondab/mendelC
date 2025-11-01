import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import PasswordForm from './password-form'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Account')
  return {
    title: t('Update Password'),
  }
}

export default async function PasswordPage() {
  const t = await getTranslations('Account')

  return (
    <div className='p-1 xs:p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto'>
      <div className='mb-6 xs:mb-8'>
        <nav className='flex items-center gap-2 text-sm xs:text-base mb-4'>
          <Link
            href='/account'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            {t('Your Account')}
          </Link>
          <span className='text-muted-foreground'>›</span>
          <Link
            href='/account/manage'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            {t('Login & Security')}
          </Link>
          <span className='text-muted-foreground'>›</span>
          <span className='text-foreground font-medium'>
            {t('Update Password')}
          </span>
        </nav>

        <div>
          <h1 className='text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-2'>
            {t('Update Password')}
          </h1>
          <p className='text-sm xs:text-base text-muted-foreground'>
            {t('Update Password Description')}
          </p>
        </div>
      </div>

      <div className='max-w-2xl'>
        <PasswordForm />
      </div>
    </div>
  )
}

