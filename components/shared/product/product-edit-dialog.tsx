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
import { getProductById } from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'
import ProductForm from '@/app/[locale]/admin/products/product-form'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface ProductEditDialogProps {
  productId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ProductEditDialog({
  productId,
  open,
  onOpenChange,
  onSuccess,
}: ProductEditDialogProps) {
  const [product, setProduct] = useState<IProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      if (open && productId) {
        setIsLoading(true)
        try {
          const fetchedProduct = await getProductById(productId)
          setProduct(fetchedProduct)
        } catch (error) {
          console.error('Failed to fetch product:', error)
          toast({
            title: 'Erreur',
            description: 'Impossible de charger le produit.',
            variant: 'destructive',
          })
          onOpenChange(false)
        } finally {
          setIsLoading(false)
        }
      } else if (!open) {
        setProduct(null) // Clear product data when dialog closes
      }
    }

    fetchProduct()
  }, [open, productId, toast, onOpenChange])

  const handleSuccess = () => {
    onOpenChange(false)
    router.refresh() // Rafraîchir pour voir les modifications
    onSuccess?.() // Callback optionnel pour rafraîchir les listes
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[95vh] overflow-y-auto p-0 gap-0 w-full'>
        {!product || isLoading ? (
          <>
            <DialogHeader className='p-4 sm:p-6'>
              <DialogTitle className='sr-only'>
                {isLoading ? 'Chargement du produit' : 'Modifier le produit'}
              </DialogTitle>
              <DialogDescription className='sr-only'>
                {isLoading
                  ? 'Chargement des données du produit'
                  : 'Formulaire de modification de produit'}
              </DialogDescription>
            </DialogHeader>
            <div className='flex items-center justify-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          </>
        ) : (
          <AnimatePresence mode='wait'>
            <motion.div
              key={product._id}
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
                      Modifier le produit
                    </DialogTitle>
                    <DialogDescription className='sr-only'>
                      Formulaire de modification pour {product.name}
                    </DialogDescription>
                    <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground'>
                      <span className='font-medium truncate'>{product.name}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onOpenChange(false)}
                    className='flex-shrink-0 p-1.5 sm:p-2 rounded-full hover:bg-muted transition-colors'
                    aria-label='Fermer'
                  >
                    <X className='h-4 w-4 sm:h-5 sm:w-5' />
                  </motion.button>
                </div>
              </DialogHeader>

              {/* Form Content */}
              <div className='p-2 sm:p-4 md:p-6'>
                <ProductForm
                  key={product._id}
                  type='Update'
                  product={product}
                  productId={product._id}
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

