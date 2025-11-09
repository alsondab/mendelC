'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { data: session, status } = useSession()
  const [timeoutReached, setTimeoutReached] = useState(false)

  useEffect(() => {
    // Timeout de sécurité : si la vérification prend trop de temps, rediriger
    const timeoutId = setTimeout(() => {
      if (status === 'loading') {
        setTimeoutReached(true)
        // Utiliser window.location pour forcer la redirection en cas de timeout
        window.location.href = '/sign-in'
      }
    }, 5000) // 5 secondes maximum pour la vérification

    return () => clearTimeout(timeoutId)
  }, [status])

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (timeoutReached) return // Timeout déjà géré

    if (!session) {
      // Utiliser window.location pour éviter les problèmes avec next-intl router
      window.location.href = '/sign-in'
      return
    }

    if (session.user?.role !== 'Admin') {
      window.location.href = '/'
      return
    }
  }, [session, status, timeoutReached])

  if (status === 'loading' && !timeoutReached) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Vérification des permissions...</span>
        </div>
      </div>
    )
  }

  if (timeoutReached) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Redirection en cours...</span>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'Admin') {
    return null // Will redirect
  }

  return <>{children}</>
}
