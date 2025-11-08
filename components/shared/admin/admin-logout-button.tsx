'use client'

import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
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
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { scale } from '@/lib/utils/animations'

export default function AdminLogoutButton() {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('Admin')

  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/',
    })
  }

  return (
    <>
      {/* Desktop & Tablet Button */}
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsOpen(true)}
        className='hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 text-xs sm:text-sm font-medium group flex-shrink-0'
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <LogOut className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 dark:text-red-400' />
        </motion.div>
        <span className='text-red-600 dark:text-red-400 font-semibold whitespace-nowrap'>
          {t('Sign out')}
        </span>
      </Button>

      {/* Mobile Button - Icon Only */}
      <Button
        variant='outline'
        size='icon'
        onClick={() => setIsOpen(true)}
        className='md:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-md bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 flex-shrink-0'
        aria-label={t('Sign out')}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <LogOut className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 dark:text-red-400' />
        </motion.div>
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className='sm:max-w-md'>
          <motion.div
            // ⚡ Optimization: Cast pour compatibilité avec Variants de framer-motion
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            variants={scale as any}
            initial='hidden'
            animate='visible'
            exit='hidden'
          >
            <AlertDialogHeader className='text-center space-y-3'>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className='mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center'
              >
                <LogOut className='h-6 w-6 text-red-600 dark:text-red-400' />
              </motion.div>
              <AlertDialogTitle className='text-xl font-bold text-foreground'>
                {t('Confirm sign out')}
              </AlertDialogTitle>
              <AlertDialogDescription className='text-muted-foreground text-base'>
                {t('Are you sure you want to sign out?')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='flex gap-3 pt-4 sm:flex-row'>
              <AlertDialogCancel className='flex-1 sm:flex-initial'>
                {t('Cancel')}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className='flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 text-white font-semibold'
              >
                {t('Sign out')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
