'use client'

import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <>
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsOpen(true)}
        className='flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium border border-border/50'
      >
        <LogOut className='h-4 w-4' />
        <span>Déconnexion</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-lg font-semibold text-foreground'>
              Confirmer la déconnexion
            </DialogTitle>
            <DialogDescription className='text-muted-foreground'>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setIsOpen(false)}
              className='flex-1'
            >
              Annuler
            </Button>
            <Button
              onClick={handleLogout}
              className='flex-1 bg-primary hover:bg-primary/90 text-primary-foreground'
            >
              Déconnexion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}



