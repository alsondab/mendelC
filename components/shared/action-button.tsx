'use client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export default function ActionButton({
  caption,
  action,
  className = 'w-full',
  variant = 'default',
  size = 'default',
  refreshOnSuccess = false,
  redirectOnSuccess = false,
  redirectPath = '/',
}: {
  caption: string
  action: () => Promise<{ success: boolean; message: string }>
  className?: string
  variant?: 'default' | 'outline' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
  refreshOnSuccess?: boolean
  redirectOnSuccess?: boolean
  redirectPath?: string
}) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()
  const t = useTranslations('Common')

  return (
    <Button
      type='button'
      className={cn('rounded-full', className)}
      variant={variant}
      size={size}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await action()
          toast({
            variant: res.success ? 'default' : 'destructive',
            description: res.message,
          })
          if (res.success) {
            if (refreshOnSuccess) {
              router.refresh()
              // Si c'est une annulation de commande, rediriger vers la liste
              // Utiliser la traduction au lieu de texte hardcodé
              const cancelKeyword = t('CancelOrder')
              if (res.message.toLowerCase().includes(cancelKeyword)) {
                setTimeout(() => {
                  window.location.href = '/account/orders'
                }, 2000)
              }
            }
            if (redirectOnSuccess) {
              setTimeout(() => {
                window.location.href = redirectPath
              }, 1500) // Attendre 1.5 secondes pour que l'utilisateur voie le toast
            }
          }
        })
      }
    >
      {isPending ? t('Processing') : caption}
    </Button>
  )
}
