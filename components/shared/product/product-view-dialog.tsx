'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, DollarSign, BarChart3, Tag, Star, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'
import { IProduct } from '@/lib/db/models/product.model'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDateTime, formatId } from '@/lib/utils'

interface ProductViewDialogProps {
  product: IProduct | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductViewDialog({
  product,
  open,
  onOpenChange,
}: ProductViewDialogProps) {
  if (!product) return null

  const getStockStatusConfig = (status: string) => {
    switch (status) {
      case 'in_stock':
        return {
          icon: CheckCircle,
          label: 'En stock',
          className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        }
      case 'low_stock':
        return {
        icon: AlertTriangle,
        label: 'Stock faible',
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      }
      case 'out_of_stock':
        return {
          icon: XCircle,
          label: 'Rupture de stock',
          className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        }
      default:
        return {
          icon: AlertTriangle,
          label: 'Discontinué',
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        }
    }
  }

  const stockStatus = getStockStatusConfig(product.stockStatus)
  const StatusIcon = stockStatus.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[95vw] sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-0 gap-0 w-full'>
        {product ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className='relative'
            >
              {/* Header */}
              <DialogHeader className='sticky top-0 z-10 bg-background border-b border-border p-3 sm:p-4 md:p-6'>
                <div className='flex items-start justify-between gap-2 sm:gap-4'>
                  <div className='flex-1 min-w-0 pr-2'>
                    <DialogTitle className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 line-clamp-2'>
                      {product.name}
                    </DialogTitle>
                    <DialogDescription className='sr-only'>
                      Détails complets du produit {product.name}
                    </DialogDescription>
                      <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] xs:text-xs sm:text-sm text-muted-foreground'>
                        <span className='font-mono break-all'>{formatId(product._id)}</span>
                        <span className='hidden sm:inline'>•</span>
                        <span className='hidden sm:inline'>{formatDateTime(product.updatedAt).dateOnly}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onOpenChange(false)}
                      className='flex-shrink-0 p-1.5 sm:p-2 rounded-full hover:bg-muted transition-colors'
                      aria-label='Fermer'
                    >
                      <X className='h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5' />
                    </motion.button>
                  </div>
                </DialogHeader>

                {/* Content */}
                <div className='p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6'>
                  {/* Images Gallery */}
                  {product.images && product.images.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className='space-y-2'
                    >
                      <h3 className='text-sm sm:text-base font-semibold flex items-center gap-2'>
                        <Eye className='h-4 w-4' />
                        Galerie d&apos;images
                      </h3>
                      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3'>
                        {product.images.slice(0, 8).map((image, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            className='relative aspect-square rounded-lg overflow-hidden border border-border bg-muted'
                          >
                            <Image
                              src={image}
                              alt={`${product.name} - Image ${index + 1}`}
                              fill
                              className='object-cover'
                              sizes='(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw'
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <Separator />

                  {/* Informations principales */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                  >
                    {/* Prix */}
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm sm:text-base text-muted-foreground'>
                        <DollarSign className='h-4 w-4' />
                        <span className='font-medium'>Prix</span>
                      </div>
                      <div className='space-y-1'>
                        <p className='text-xl sm:text-2xl font-bold'>
                          {product.price}€
                        </p>
                        {product.listPrice > product.price && (
                          <p className='text-sm text-muted-foreground line-through'>
                            {product.listPrice}€
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Catégorie */}
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm sm:text-base text-muted-foreground'>
                        <Tag className='h-4 w-4' />
                        <span className='font-medium'>Catégorie</span>
                      </div>
                      <p className='text-sm sm:text-base font-semibold'>
                        {product.category}
                        {product.subCategory && (
                          <span className='text-muted-foreground'>
                            {' '}/ {product.subCategory}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Marque */}
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm sm:text-base text-muted-foreground'>
                        <Package className='h-4 w-4' />
                        <span className='font-medium'>Marque</span>
                      </div>
                      <p className='text-sm sm:text-base font-semibold'>
                        {product.brand}
                      </p>
                    </div>
                  </motion.div>

                  <Separator />

                  {/* Stock et statut */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'
                  >
                    {/* Stock disponible */}
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm sm:text-base text-muted-foreground'>
                        <Package className='h-4 w-4' />
                        <span className='font-medium'>Stock</span>
                      </div>
                      <p className='text-lg sm:text-xl font-bold'>
                        {product.countInStock} unités
                      </p>
                    </div>

                    {/* Statut du stock */}
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm sm:text-base text-muted-foreground'>
                        <StatusIcon className='h-4 w-4' />
                        <span className='font-medium'>Statut</span>
                      </div>
                      <Badge className={stockStatus.className}>
                        {stockStatus.label}
                      </Badge>
                    </div>

                    {/* Seuils */}
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm sm:text-base text-muted-foreground'>
                        <AlertTriangle className='h-4 w-4' />
                        <span className='font-medium'>Seuil min</span>
                      </div>
                      <p className='text-sm sm:text-base font-semibold'>
                        {product.minStockLevel} unités
                      </p>
                    </div>

                    {/* Stock max */}
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm sm:text-base text-muted-foreground'>
                        <BarChart3 className='h-4 w-4' />
                        <span className='font-medium'>Stock max</span>
                      </div>
                      <p className='text-sm sm:text-base font-semibold'>
                        {product.maxStockLevel || 'N/A'} unités
                      </p>
                    </div>
                  </motion.div>

                  <Separator />

                  {/* Notes et avis */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'
                  >
                    {/* Note moyenne */}
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm sm:text-base text-muted-foreground'>
                        <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                        <span className='font-medium'>Note moyenne</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <p className='text-lg sm:text-xl font-bold'>
                          {product.avgRating || 'N/A'}
                        </p>
                        <span className='text-xs sm:text-sm text-muted-foreground'>
                          ({product.numReviews} avis)
                        </span>
                      </div>
                    </div>

                    {/* Ventes */}
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm sm:text-base text-muted-foreground'>
                        <BarChart3 className='h-4 w-4' />
                        <span className='font-medium'>Ventes</span>
                      </div>
                      <p className='text-lg sm:text-xl font-bold'>
                        {product.numSales || 0} ventes
                      </p>
                    </div>
                  </motion.div>

                  {/* Description */}
                  {product.description && (
                    <>
                      <Separator />
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className='space-y-2'
                      >
                        <h3 className='text-sm sm:text-base font-semibold'>
                          Description
                        </h3>
                        <p className='text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap'>
                          {product.description}
                        </p>
                      </motion.div>
                    </>
                  )}

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <>
                      <Separator />
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className='space-y-2'
                      >
                        <h3 className='text-sm sm:text-base font-semibold'>
                          Tags
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                          {product.tags.map((tag, index) => (
                            <Badge key={index} variant='secondary' className='text-xs'>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}

                  {/* Couleurs */}
                  {product.colors && product.colors.length > 0 && (
                    <>
                      <Separator />
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className='space-y-2'
                      >
                        <h3 className='text-sm sm:text-base font-semibold'>
                          Couleurs disponibles
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                          {product.colors.map((color, index) => (
                            <Badge key={index} variant='outline' className='text-xs'>
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}

                  {/* Statut de publication */}
                  <Separator />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className='flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50'
                  >
                    <div className='flex items-center gap-2'>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          product.isPublished ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                      />
                      <span className='text-sm sm:text-base font-medium'>
                        {product.isPublished ? 'Produit publié' : 'Brouillon'}
                      </span>
                    </div>
                    <Badge
                      variant={product.isPublished ? 'default' : 'secondary'}
                      className='text-xs'
                    >
                      {product.isPublished ? 'Actif' : 'Inactif'}
                    </Badge>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              <DialogHeader className='p-4 sm:p-6'>
                <DialogTitle className='sr-only'>Détails du produit</DialogTitle>
                <DialogDescription className='sr-only'>
                  Chargement des détails du produit
                </DialogDescription>
              </DialogHeader>
            </>
          )}
      </DialogContent>
    </Dialog>
  )
}

