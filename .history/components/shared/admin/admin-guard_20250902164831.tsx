'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/sign-in')
      return
    }

    if (session.user?.role !== 'Admin') {
      router.push('/')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='flex items-center gap-2'>
          <Loader2 className='h-6 w-6 animate-spin' />
          <span>Vérification des permissions...</span>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'Admin') {
    return null // Will redirect
  }

  return <>{children}</>
}
