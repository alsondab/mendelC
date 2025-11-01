'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { getCategoryById } from '@/lib/actions/category.actions'
import { ICategory } from '@/types'
import { CategoryForm } from '@/app/[locale]/admin/categories/category-form'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface CategoryEditDialogProps {
  categoryId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CategoryEditDialog({
  categoryId,
  open,
  onOpenChange,
  onSuccess,
}: CategoryEditDialogProps) {
  const t = useTranslations('Admin.CategoryForm')
  const [category, setCategory] = useState<ICategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchCategory = async () => {
      if (open && categoryId) {
        setIsLoading(true)
        try {
          const fetchedCategory = await getCategoryById(categoryId)
          setCategory(fetchedCategory)
        } catch (error) {
          console.error('Failed to fetch category:', error)
          toast({
            title: t('Error'),
            description: t('ErrorLoadingCategory'),
            variant: 'destructive',
          })
          onOpenChange(false)
        } finally {
          setIsLoading(false)
        }
      } else if (!open) {
        setCategory(null) // Clear category data when dialog closes
      }
    }

    fetchCategory()
  }, [open, categoryId, toast, onOpenChange, t])

  const handleSuccess = () => {
    onOpenChange(false)
    router.refresh() // Rafraîchir pour voir les modifications
    onSuccess?.() // Callback optionnel pour rafraîchir les listes
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[95vw] sm:max-w-3xl lg:max-w-5xl max-h-[95vh] overflow-y-auto p-0 gap-0 w-full'>
        {!category || isLoading ? (
          <>
            <DialogHeader className='p-4 sm:p-6'>
              <DialogTitle className='sr-only'>
                {isLoading ? t('Saving') : t('EditTitle')}
              </DialogTitle>
              <DialogDescription className='sr-only'>
                {isLoading
                  ? 'Chargement des données de la catégorie'
                  : 'Formulaire de modification de catégorie'}
              </DialogDescription>
            </DialogHeader>
            <div className='flex items-center justify-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          </>
        ) : (
          <AnimatePresence mode='wait'>
            <motion.div
              key={category._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className='relative'
            >
              {/* Header */}
              <DialogHeader className='sticky top-0 z-10 bg-background border-b border-border p-4 sm:p-6'>
                <div className='flex items-start justify-between gap-2 sm:gap-4'>
                  <div className='flex-1 min-w-0 pr-2'>
                    <DialogTitle className='text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 line-clamp-2'>
                      {t('EditTitle')}
                    </DialogTitle>
                    <DialogDescription className='sr-only'>
                      {t('EditDescription')}
                    </DialogDescription>
                    <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground'>
                      <span className='font-medium truncate'>{category.name}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onOpenChange(false)}
                    className='flex-shrink-0 p-1.5 sm:p-2 rounded-full hover:bg-muted transition-colors'
                    aria-label={t('Cancel')}
                  >
                    <X className='h-4 w-4 sm:h-5 sm:w-5' />
                  </motion.button>
                </div>
              </DialogHeader>

              {/* Form Content */}
              <div className='p-2 sm:p-4 md:p-6'>
                <CategoryForm
                  key={category._id}
                  categoryId={category._id}
                  category={category}
                  onSuccess={handleSuccess}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </DialogContent>
    </Dialog>
  )
}

