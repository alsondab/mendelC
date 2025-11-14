import { verifyEmail } from '@/lib/actions/verification.actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const t = await getTranslations('Auth')
  const params = await searchParams
  const token = params.token

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('Verification token missing')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('No verification token provided')}
          </p>
          <Link href="/sign-in">
            <Button>{t('Go to sign in')}</Button>
          </Link>
        </div>
      </div>
    )
  }

  const result = await verifyEmail(token)

  if (result.success && result.sessionToken) {
    // Rediriger vers la route API qui va connecter automatiquement l'utilisateur
    redirect(`/api/auth/verify-and-signin?token=${result.sessionToken}`)
  }

  if (result.success) {
    // Si la vérification réussit mais qu'on n'a pas le token de session
    redirect('/sign-in?verified=true')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('Verification failed')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{result.error}</p>
        <Link href="/sign-in">
          <Button variant="outline" className="w-full">
            {t('Go to sign in')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
