import { redirect as nextRedirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'

import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import SignUpForm from './signup-form'
import { getTranslations } from 'next-intl/server'

export default async function SignUpPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    callbackUrl: string
  }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const t = await getTranslations('Auth')
  const locale = params.locale || (await getLocale())

  const { callbackUrl } = searchParams

  const session = await auth()
  if (session) {
    const redirectUrl = callbackUrl || '/'
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
          <CardTitle className="text-2xl">{t('Sign Up')}</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
}
