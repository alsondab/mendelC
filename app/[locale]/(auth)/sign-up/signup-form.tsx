'use client'
import { useSearchParams, useRouter } from 'next/navigation'

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
import { IUserSignUp } from '@/types'
import { registerUser, signInWithCredentials } from '@/lib/actions/user.actions'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSignUpSchema } from '@/lib/validator'
import { Separator } from '@/components/ui/separator'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

const signUpDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'john doe',
        email: 'john@me.com',
        password: '123456',
        confirmPassword: '123456',
      }
    : {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      }

export default function CredentialsSignInForm() {
  const {
    setting: { site },
  } = useSettingStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const t = useTranslations('Auth')

  const form = useForm<IUserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: signUpDefaultValues,
  })

  const { control, handleSubmit } = form

  const onSubmit = async (data: IUserSignUp) => {
    try {
      const res = await registerUser(data)
      if (!res.success) {
        toast({
          title: t('Error'),
          description: res.error,
          variant: 'destructive',
        })
        return
      }

      // Si l'email nécessite une vérification, afficher le toast puis rediriger
      if (res.requiresVerification) {
        // Afficher le toast immédiatement
        toast({
          title: t('Account created'),
          description: t('VerificationEmailSentCheckInbox'),
        })

        // Attendre un peu pour que le toast soit visible, puis rediriger
        setTimeout(() => {
          router.push(
            `/verify-email-pending?fromSignup=true&email=${encodeURIComponent(data.email)}`
          )
        }, 1000) // 1 seconde pour que le toast soit visible
        return
      }

      // Sinon, connecter l'utilisateur directement
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      })
      router.push(callbackUrl)
    } catch (error) {
      if (isRedirectError(error)) {
        throw error
      }
      toast({
        title: t('Error'),
        description: t('Invalid email or password'),
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t('Full Name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('Enter your full name')}
                    maxLength={50}
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
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t('Email')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('Enter your email address')}
                    type="email"
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
                    placeholder={t('Enter your password')}
                    autoComplete="new-password"
                    maxLength={128}
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <div className="text-xs text-muted-foreground mt-1">
                  {t('Password must contain')}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t('Confirm password')}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t('Confirm your password')}
                    autoComplete="new-password"
                    maxLength={128}
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
                  <span>{t('Creating account')}</span>
                </div>
              ) : (
                t('Sign Up')
              )}
            </Button>
          </div>
          <div className="text-sm">
            {t('By creating an account')} {site.name}&apos;s{' '}
            <Link href="/page/conditions-of-use">{t('Conditions of Use')}</Link>{' '}
            {t('and')}{' '}
            <Link href="/page/privacy-policy">{t('Privacy Notice')}.</Link>
          </div>
          <Separator className="mb-4" />
          <div className="text-sm">
            {t('Already have an account?')}{' '}
            <Link className="link" href={`/sign-in?callbackUrl=${callbackUrl}`}>
              {t('Sign In')}
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}
