'use client'
import { useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false)

  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: signInDefaultValues,
  })

  const { control, handleSubmit } = form

  // Afficher l'overlay après 500ms de chargement
  useEffect(() => {
    if (form.formState.isSubmitting) {
      const timer = setTimeout(() => {
        setShowLoadingOverlay(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setShowLoadingOverlay(false)
    }
  }, [form.formState.isSubmitting])

  // Rediriger si la session est disponible et que l'utilisateur est Admin
  useEffect(() => {
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
  }, [session, callbackUrl, locale])

  const onSubmit = async (data: IUserSignIn) => {
    try {
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      })
      // Rafraîchir la session pour obtenir le rôle à jour
      await updateSession()
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
    <div className="relative">
      <AnimatePresence>
        {showLoadingOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 rounded-lg"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-full max-w-xs"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="h-6 w-6 text-primary" />
              </motion.div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {t('Signing in title')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('Please wait')}...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
                  <div className="flex items-center gap-2">
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
