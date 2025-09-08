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
        className='flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300 transition-all duration-200 text-sm font-medium w-full group'
      >
        <LogOut className='h-4 w-4 text-red-600 group-hover:scale-110 transition-transform' />
        <span className='text-red-600 font-semibold'>Déconnexion</span>
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





