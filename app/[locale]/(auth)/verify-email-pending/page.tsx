'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { resendVerificationEmail } from '@/lib/actions/verification.actions'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Mail, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

export default function VerifyEmailPendingPage() {
  const t = useTranslations('Auth')
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasShownInitialToast, setHasShownInitialToast] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Afficher le toast et le message de succès automatiquement si on vient de l'inscription
  useEffect(() => {
    const fromSignup = searchParams.get('fromSignup')
    const userEmail = searchParams.get('email')

    if (fromSignup === 'true' && !hasShownInitialToast) {
      setHasShownInitialToast(true)
      setShowSuccessMessage(true)
      if (userEmail) {
        setEmail(decodeURIComponent(userEmail))
      }
      toast({
        title: t('Account created'),
        description: t('VerificationEmailSentCheckInbox'),
      })
    }
  }, [searchParams, hasShownInitialToast, t])

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      const result = await resendVerificationEmail(email)

      if (result.success) {
        setIsSuccess(true)
        toast({
          title: t('Email sent'),
          description: result.message,
        })
      } else {
        setError(result.error || t('An error occurred'))
        toast({
          title: t('Error'),
          description: result.error || t('An error occurred'),
          variant: 'destructive',
        })
      }
    } catch {
      setError(t('An error occurred'))
      toast({
        title: t('Error'),
        description: t('An error occurred'),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8 sm:py-12">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12">
        <div className="text-center mb-6 sm:mb-8">
          <Mail className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-blue-500 mx-auto mb-4 sm:mb-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            {t('Verify your email')}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
            {t('Check your inbox for verification email')}
          </p>
        </div>

        {/* Message de succès visible quand on vient de l'inscription */}
        {showSuccessMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-semibold text-green-800 dark:text-green-200 mb-1 sm:mb-2">
                  {t('Account created')}
                </p>
                <p className="text-sm sm:text-base text-green-700 dark:text-green-300 mb-2 sm:mb-3">
                  {t('VerificationEmailSentCheckInbox')}
                </p>
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                  {t('ClickVerificationButtonInEmail')}
                </p>
              </div>
            </div>
          </div>
        )}

        {isSuccess ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 text-green-800 dark:text-green-200">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
              <p className="text-sm sm:text-base font-medium">
                {t('Verification email sent successfully')}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
              <p className="text-sm sm:text-base md:text-lg text-yellow-800 dark:text-yellow-200 text-center sm:text-left">
                {t('Did not receive email? Enter your email below to resend')}
              </p>
            </div>

            <form
              onSubmit={handleResend}
              className="space-y-4 sm:space-y-5 md:space-y-6"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm sm:text-base font-medium"
                >
                  {t('Email address')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('Enter your email')}
                  required
                  disabled={isLoading}
                  className="h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3 text-red-800 dark:text-red-200">
                    <XCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base break-words">{error}</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    {t('Sending')}
                  </>
                ) : (
                  t('Resend verification email')
                )}
              </Button>
            </form>
          </>
        )}

        <div className="mt-6 sm:mt-8 md:mt-10 text-center">
          <Link
            href="/sign-in"
            className="inline-block text-sm sm:text-base md:text-lg text-blue-600 dark:text-blue-400 hover:underline transition-colors"
          >
            {t('Back to sign in')}
          </Link>
        </div>
      </div>
    </div>
  )
}
