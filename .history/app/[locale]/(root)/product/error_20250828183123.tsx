'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Product page error:', error)
  }, [error])

  const isUnpublished = error.message.includes('not published')
  const isNotFound = error.message.includes('not found')
  const isServerError = error.message.includes('server') || error.message.includes('database')

  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] p-6'>
      <div className='max-w-md w-full text-center space-y-6'>
        {/* Icône d'erreur */}
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
          isUnpublished ? 'bg-yellow-100' : 
          isServerError ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          {isUnpublished ? (
            <Shield className='w-8 h-8 text-yellow-600' />
          ) : (
            <AlertTriangle className='w-8 h-8 text-red-600' />
          )}
        </div>

        {/* Titre */}
        <div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            {isUnpublished ? 'Product Not Available' : 
             isServerError ? 'Server Error' : 'Product Not Found'}
          </h1>
          <p className='text-gray-600'>
            {isUnpublished
              ? 'This product exists but is not currently published.'
              : isServerError
              ? 'A server error occurred while loading the product.'
              : 'The product you are looking for could not be found.'}
          </p>
        </div>

        {/* Message d'erreur détaillé */}
        <div className='bg-gray-50 rounded-lg p-4 text-sm text-gray-700'>
          <p className='font-medium mb-2'>Error Details:</p>
          <p className='text-gray-600'>{error.message}</p>
        </div>

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          <Button
            variant='outline'
            onClick={reset}
            className='flex items-center gap-2'
          >
            <ArrowLeft className='w-4 h-4' />
            Try Again
          </Button>
          
          <Button asChild className='flex items-center gap-2'>
            <Link href='/'>
              <Home className='w-4 h-4' />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Message d'aide */}
        {isUnpublished && (
          <div className='text-xs text-gray-500 bg-blue-50 rounded-lg p-3'>
            <p>
              💡 <strong>Tip:</strong> This product may be temporarily unavailable 
              or under review. Please check back later or contact support if you 
              believe this is an error.
            </p>
          </div>
        )}

        {isServerError && (
          <div className='text-xs text-gray-500 bg-red-50 rounded-lg p-3'>
            <p>
              ⚠️ <strong>Server Error:</strong> There was a problem loading this product. 
              Please try again in a few moments or contact support if the problem persists.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
