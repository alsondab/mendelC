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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <Mail className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('Verify your email')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('Check your inbox for verification email')}
          </p>
        </div>

        {/* Message de succès visible quand on vient de l'inscription */}
        {showSuccessMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
                  {t('Account created')}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {t('VerificationEmailSentCheckInbox')}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  {t('ClickVerificationButtonInEmail')}
                </p>
              </div>
            </div>
          </div>
        )}

        {isSuccess ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm font-medium">
                {t('Verification email sent successfully')}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {t('Did not receive email? Enter your email below to resend')}
              </p>
            </div>

            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <Label htmlFor="email">{t('Email address')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('Enter your email')}
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <XCircle className="h-4 w-4" />
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('Sending')}
                  </>
                ) : (
                  t('Resend verification email')
                )}
              </Button>
            </form>
          </>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/sign-in"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('Back to sign in')}
          </Link>
        </div>
      </div>
    </div>
  )
}
