import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/auth'
import Link from 'next/link'
import EmailForm from './email-form'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Account')
  return {
    title: t('Update Email'),
  }
}

export default async function EmailPage() {
  const session = await auth()
  const t = await getTranslations('Account')

  if (!session?.user?.email) {
    return (
      <div className="p-1 xs:p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        <p>{t('Not authenticated')}</p>
      </div>
    )
  }

  return (
    <div className="p-1 xs:p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="mb-6 xs:mb-8">
        <nav className="flex items-center gap-2 text-sm xs:text-base mb-4">
          <Link
            href="/account"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('Your Account')}
          </Link>
          <span className="text-muted-foreground">›</span>
          <Link
            href="/account/manage"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('Login & Security')}
          </Link>
          <span className="text-muted-foreground">›</span>
          <span className="text-foreground font-medium">
            {t('Update Email')}
          </span>
        </nav>

        <div>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {t('Update Email')}
          </h1>
          <p className="text-sm xs:text-base text-muted-foreground">
            {t('Update Email Description')}
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <EmailForm currentEmail={session.user.email} />
      </div>
    </div>
  )
}
