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
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-950 px-4'>
      <div className='w-full max-w-md p-8 rounded-2xl shadow-lg bg-white dark:bg-neutral-900 text-center border border-gray-100 dark:border-neutral-800'>
        <div className='flex flex-col items-center mb-4'>
          <div className='bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-3'>
            <AlertTriangle className='h-10 w-10 text-red-500' />
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white'>
            {t('Error.Error')}
          </h1>
        </div>

        <p className='text-destructive text-sm sm:text-base mb-6 break-words'>
          {error.message}
        </p>

        <div className='flex flex-col sm:flex-row justify-center gap-3'>
          <Button
            variant='destructive'
            className='w-full sm:w-auto'
            onClick={() => reset()}
          >
            {t('Error.Try again')}
          </Button>
          <Button
            variant='outline'
            className='w-full sm:w-auto'
            onClick={() => (window.location.href = '/')}
          >
            {t('Error.Back To Home')}
          </Button>
        </div>
      </div>
    </div>
  )
}
