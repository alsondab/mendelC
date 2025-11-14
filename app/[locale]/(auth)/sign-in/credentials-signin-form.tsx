'use client'
import { useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PasswordInput from '@/components/ui/password-input'
import Link from 'next/link'
import useSettingStore from '@/hooks/use-setting-store'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { IUserSignIn } from '@/types'
import { signInWithCredentials } from '@/lib/actions/user.actions'
import { Loader2 } from 'lucide-react'

import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSignInSchema } from '@/lib/validator'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { useTranslations } from 'next-intl'

const signInDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        email: 'admin@example.com',
        password: '123456',
      }
    : {
        email: '',
        password: '',
      }

export default function CredentialsSignInForm() {
  const {
    setting: { site },
  } = useSettingStore()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const t = useTranslations('Auth')
  const locale = useLocale()
  const { data: session, update: updateSession } = useSession()

  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: signInDefaultValues,
  })

  const { control, handleSubmit } = form

  // Rediriger si la session est disponible et que l'utilisateur est Admin
  // MAIS ne pas rediriger si l'utilisateur vient de se déconnecter (logout=true)
  useEffect(() => {
    const logoutParam = searchParams.get('logout')
    const isLogout = logoutParam === 'true'
    
    // Ne pas rediriger si l'utilisateur vient de se déconnecter
    if (isLogout) {
      return
    }

    if (session?.user?.role === 'Admin') {
      // Utiliser window.location pour la redirection admin car le router i18n est strict sur les types
      window.location.href = `/${locale}/admin/overview`
    } else if (session) {
      // Utiliser window.location car le router next-intl est strict et ne permet pas toutes les routes
      const redirectUrl = callbackUrl.startsWith('/')
        ? `/${locale}${callbackUrl}`
        : `/${locale}/${callbackUrl}`
      window.location.href = redirectUrl
    }
  }, [session, callbackUrl, locale, searchParams])

  const onSubmit = async (data: IUserSignIn) => {
    try {
      const result = await signInWithCredentials({
        email: data.email,
        password: data.password,
      })

      // Si la connexion réussit, attendre un peu pour que la session soit créée
      // puis rafraîchir la session
      if (result) {
        // Attendre un court instant pour que NextAuth crée la session
        await new Promise((resolve) => setTimeout(resolve, 100))
        await updateSession()
      }
    } catch (error) {
      if (isRedirectError(error)) {
        throw error
      }

      // Gérer l'erreur EMAIL_NOT_VERIFIED
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('EMAIL_NOT_VERIFIED')) {
        toast({
          title: t('Email not verified'),
          description: t('Please verify your email before signing in'),
          variant: 'destructive',
          action: (
            <Link href="/verify-email-pending">
              <Button variant="outline" size="sm">
                {t('Resend verification email')}
              </Button>
            </Link>
          ),
        })
        return
      }

      toast({
        title: t('Error'),
        description: t('Invalid email or password'),
        variant: 'destructive',
      })
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <div className="space-y-6">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t('Email')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('Enter email address')}
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t('Password')}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t('Enter password')}
                      autoComplete="current-password"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t('Signing in')}</span>
                  </div>
                ) : (
                  t('Sign In')
                )}
              </Button>
            </div>
            <div className="text-sm">
              {t('By signing in, you agree to')} {site.name}&apos;s{' '}
              <Link href="/page/conditions-of-use">
                {t('Conditions of Use')}
              </Link>{' '}
              {t('and')}{' '}
              <Link href="/page/privacy-policy">{t('Privacy Notice')}.</Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
