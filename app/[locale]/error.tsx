'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { AlertTriangle } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const t = useTranslations()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-950 px-2 xs:px-4">
      <div className="w-full max-w-md p-4 xs:p-6 sm:p-8 rounded-xl xs:rounded-2xl shadow-lg bg-white dark:bg-neutral-900 text-center border border-gray-100 dark:border-neutral-800">
        <div className="flex flex-col items-center mb-3 xs:mb-4">
          <div className="bg-red-100 dark:bg-red-900/30 p-2 xs:p-3 sm:p-4 rounded-full mb-2 xs:mb-3">
            <AlertTriangle className="h-6 w-6 xs:h-8 xs:w-8 sm:h-10 sm:w-10 text-red-500" />
          </div>
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('Error.Error')}
          </h1>
        </div>

        <p className="text-destructive text-xs xs:text-sm sm:text-base mb-4 xs:mb-6 break-words">
          {error.message}
        </p>

        <div className="flex flex-col xs:flex-row justify-center gap-2 xs:gap-3">
          <Button
            variant="destructive"
            size="sm"
            className="w-full xs:w-auto text-xs xs:text-sm h-8 xs:h-9 sm:h-10 px-3 xs:px-4"
            onClick={() => reset()}
          >
            {t('Error.Try again')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full xs:w-auto text-xs xs:text-sm h-8 xs:h-9 sm:h-10 px-3 xs:px-4"
            onClick={() => (window.location.href = '/')}
          >
            {t('Error.Back To Home')}
          </Button>
        </div>
      </div>
    </div>
  )
}
