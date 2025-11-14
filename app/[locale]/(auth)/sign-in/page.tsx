import Link from 'next/link'
import { redirect as nextRedirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'

import { auth } from '@/auth'
import SeparatorWithOr from '@/components/shared/separator-or'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import CredentialsSignInForm from './credentials-signin-form'
import { GoogleSignInForm } from './google-signin-form'
import { Button } from '@/components/ui/button'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export default async function SignInPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    callbackUrl?: string
    logout?: string
  }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { site } = await getSetting()
  const t = await getTranslations('Auth')
  const locale = params.locale || (await getLocale())

  const { callbackUrl = '/', logout } = await searchParams
  const isLogout = logout === 'true'

  const session = await auth()
  // Ne pas rediriger automatiquement si l'utilisateur vient de se déconnecter (logout=true)
  // Après déconnexion, l'admin doit rester sur la page de connexion et se reconnecter manuellement
  if (session && !isLogout) {
    // Déterminer l'URL de redirection
    let redirectUrl = callbackUrl
    // Si c'est un admin, rediriger vers /admin/overview (dashboard)
    if (session.user.role === 'Admin') {
      redirectUrl = '/admin/overview'
    }
    // Construire l'URL avec la locale pour préserver l'internationalisation
    const cleanUrl = redirectUrl.startsWith('/')
      ? redirectUrl
      : `/${redirectUrl}`
    const localizedUrl = `/${locale}${cleanUrl}`
    nextRedirect(localizedUrl)
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('Sign In')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <CredentialsSignInForm />
            <SeparatorWithOr />
            <div className="mt-4">
              <GoogleSignInForm />
            </div>
          </div>
        </CardContent>
      </Card>
      <SeparatorWithOr>
        {t('New to')} {site.name}?
      </SeparatorWithOr>

      <Link href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
        <Button className="w-full" variant="outline">
          {t('Create your')} {site.name} {t('account')}
        </Button>
      </Link>
    </div>
  )
}
