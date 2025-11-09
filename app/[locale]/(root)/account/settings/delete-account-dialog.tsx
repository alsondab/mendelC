'use client'

import { useState, useTransition } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { deleteUserAccount } from '@/lib/actions/user.actions'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface DeleteAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState('')
  const [confirmCheck, setConfirmCheck] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const t = useTranslations('Account')

  const handleDelete = () => {
    if (!confirmCheck || confirmText.toUpperCase() !== 'SUPPRIMER') {
      toast({
        title: t('Error'),
        description: t(
          'Please confirm by checking the box and typing SUPPRIMER'
        ),
        variant: 'destructive',
      })
      return
    }

    startTransition(async () => {
      const result = await deleteUserAccount()
      if (result.success) {
        toast({
          title: t('Success'),
          description: result.message || t('Account deleted successfully'),
        })
        await signOut({ redirect: false })
        router.push('/')
        onOpenChange(false)
      } else {
        toast({
          title: t('Error'),
          description: result.message || t('Failed to delete account'),
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            {t('Delete Account')}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>{t('Delete Account Warning')}</p>
            <p className="text-sm">{t('Delete Account RGPD Info')}</p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="confirm-delete"
              checked={confirmCheck}
              onCheckedChange={(checked) => setConfirmCheck(checked === true)}
            />
            <Label
              htmlFor="confirm-delete"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('I understand this action cannot be undone')}
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-text">
              {t('Type SUPPRIMER to confirm')}
            </Label>
            <Input
              id="confirm-text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="SUPPRIMER"
              disabled={isPending}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t('Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={
              isPending ||
              !confirmCheck ||
              confirmText.toUpperCase() !== 'SUPPRIMER'
            }
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? t('Deleting') : t('Delete Account')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
