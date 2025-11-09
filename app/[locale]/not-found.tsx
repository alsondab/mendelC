'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Home, SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white dark:bg-neutral-900 text-center border border-gray-100 dark:border-neutral-800">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-3">
            <SearchX className="h-10 w-10 text-blue-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Page not found
          </h1>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-6 break-words">
          Could not find the requested resource.
        </p>

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => (window.location.href = '/')}
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
