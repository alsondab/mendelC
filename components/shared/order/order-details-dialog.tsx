'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  MapPin,
  CreditCard,
  Package,
  Truck,
  Calendar,
  CheckCircle,
  XCircle,
  ShoppingBag,
  DollarSign,
} from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

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
import ProductPrice from '@/components/shared/product/product-price'
import { getOrderById } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/db/models/order.model'
import { useToast } from '@/hooks/use-toast'
import ActionButton from '../action-button'
import { deliverOrder, updateOrderToPaid } from '@/lib/actions/order.actions'

interface OrderDetailsDialogProps {
  orderId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function OrderDetailsDialog({
  orderId,
  open,
  onOpenChange,
  onSuccess,
}: OrderDetailsDialogProps) {
  const { toast } = useToast()
  const t = useTranslations('Checkout')
  const [order, setOrder] = useState<IOrder | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadOrder = async () => {
      if (orderId && open) {
        setIsLoading(true)
        try {
          const orderData = await getOrderById(orderId)
          setOrder(orderData)
        } catch (error) {
          toast({
            title: 'Erreur',
            description:
              error instanceof Error
                ? error.message
                : 'Impossible de charger les détails de la commande',
            variant: 'destructive',
          })
          onOpenChange(false)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadOrder()
  }, [orderId, open, toast, onOpenChange])

  const {
    shippingAddress,
    items,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    isCancelled,
    cancelledAt,
    expectedDeliveryDate,
    _id,
  } = order || {}

  const getStatusConfig = () => {
    if (isCancelled) {
      return {
        icon: XCircle,
        label: 'Annulée',
        className:
          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        date: cancelledAt,
      }
    }
    if (isDelivered) {
      return {
        icon: CheckCircle,
        label: 'Livrée',
        className:
          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        date: deliveredAt,
      }
    }
    if (isPaid) {
      return {
        icon: Truck,
        label: 'En cours de livraison',
        className:
          'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
        date: expectedDeliveryDate,
      }
    }
    return {
      icon: XCircle,
      label: 'Non payée',
      className:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      date: null,
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-0 gap-0 w-full">
        {!order || isLoading ? (
          <>
            <DialogHeader className="p-4 sm:p-6">
              <DialogTitle className="sr-only">
                {isLoading
                  ? 'Chargement de la commande'
                  : 'Détails de la commande'}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {isLoading
                  ? 'Chargement des détails de la commande'
                  : 'Informations sur la commande'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center h-64">
              <div className="text-sm text-muted-foreground">
                {isLoading ? 'Chargement...' : 'Commande non trouvée'}
              </div>
            </div>
          </>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {/* Header */}
              <DialogHeader className="sticky top-0 z-10 bg-background border-b border-border p-3 sm:p-4 md:p-6">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0 pr-2">
                    <DialogTitle className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="line-clamp-1">
                        Détails de la commande
                      </span>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Informations complètes de la commande{' '}
                      {formatId(_id || '')}
                    </DialogDescription>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] xs:text-xs sm:text-sm text-muted-foreground">
                      <span className="font-mono break-all">
                        {formatId(_id || '')}
                      </span>
                      {order?.createdAt && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">
                            {formatDateTime(order.createdAt).dateTime}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onOpenChange(false)}
                    className="flex-shrink-0 p-1.5 sm:p-2 rounded-full hover:bg-muted transition-colors"
                    aria-label="Fermer"
                    type="button"
                  >
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  </motion.button>
                </div>
              </DialogHeader>

              {/* Loading State */}
              {isLoading ? (
                <div className="p-8 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                /* Content */
                <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Statut de la commande */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <StatusIcon
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          isCancelled
                            ? 'text-red-600'
                            : isDelivered
                              ? 'text-green-600'
                              : isPaid
                                ? 'text-orange-600'
                                : 'text-yellow-600'
                        }`}
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-medium">
                          {statusConfig.label}
                        </p>
                        {statusConfig.date && (
                          <p className="text-[10px] xs:text-xs text-muted-foreground">
                            {formatDateTime(statusConfig.date).dateTime}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={statusConfig.className}>
                      {statusConfig.label}
                    </Badge>
                  </motion.div>

                  <Separator />

                  {/* Adresse de livraison */}
                  {shippingAddress && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="space-y-2"
                    >
                      <h3 className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Adresse de livraison
                      </h3>
                      <div className="p-3 sm:p-4 rounded-lg bg-muted/50 space-y-1">
                        <p className="text-xs sm:text-sm font-medium">
                          {shippingAddress.fullName}
                        </p>
                        <p className="text-[10px] xs:text-xs text-muted-foreground">
                          {shippingAddress.phone}
                        </p>
                        <p className="text-[10px] xs:text-xs text-muted-foreground mt-2">
                          {shippingAddress.street}, {shippingAddress.city},{' '}
                          {shippingAddress.province}
                          {shippingAddress.postalCode &&
                            `, ${shippingAddress.postalCode}`}
                          , {shippingAddress.country}
                        </p>
                      </div>
                      {!isCancelled && !isDelivered && expectedDeliveryDate && (
                        <div className="flex items-center gap-2 text-[10px] xs:text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Livraison prévue le{' '}
                            {formatDateTime(expectedDeliveryDate).dateTime}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  <Separator />

                  {/* Méthode de paiement */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <h3 className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                      <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Méthode de paiement
                    </h3>
                    <div className="p-3 sm:p-4 rounded-lg bg-muted/50">
                      <p className="text-xs sm:text-sm font-medium">
                        {t(paymentMethod || '')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isPaid ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                          <span className="text-[10px] xs:text-xs text-muted-foreground">
                            Payée le{' '}
                            {paidAt ? formatDateTime(paidAt).dateTime : 'N/A'}
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
                          <span className="text-[10px] xs:text-xs text-muted-foreground">
                            Non payée
                          </span>
                        </>
                      )}
                    </div>
                  </motion.div>

                  <Separator />

                  {/* Articles commandés */}
                  {items && items.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="space-y-2"
                    >
                      <h3 className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Articles commandés ({items.length})
                      </h3>
                      <div className="space-y-2 border rounded-lg overflow-hidden">
                        {items.map((item, index) => (
                          <motion.div
                            key={`${item.slug}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 + index * 0.05 }}
                            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 ${
                              index !== items.length - 1
                                ? 'border-b border-border'
                                : ''
                            }`}
                          >
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                              {item.image && item.image.trim() !== '' ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="(max-width: 640px) 40px, 48px"
                                  className="object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium line-clamp-2">
                                {item.name}
                              </p>
                              {(item.size || item.color) && (
                                <p className="text-[10px] xs:text-xs text-muted-foreground mt-0.5">
                                  {item.size && `Taille: ${item.size}`}
                                  {item.size && item.color && ' • '}
                                  {item.color && `Couleur: ${item.color}`}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <p className="text-xs sm:text-sm font-medium">
                                {item.quantity}x
                              </p>
                              <ProductPrice
                                price={item.price * item.quantity}
                                plain
                                className="text-[10px] xs:text-xs"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <Separator />

                  {/* Résumé financier */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <h3 className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                      <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Résumé financier
                    </h3>
                    <div className="p-3 sm:p-4 rounded-lg bg-muted/50 space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center text-[10px] xs:text-xs sm:text-sm">
                        <span className="text-muted-foreground">
                          Sous-total articles
                        </span>
                        <ProductPrice price={itemsPrice || 0} plain />
                      </div>
                      <div className="flex justify-between items-center text-[10px] xs:text-xs sm:text-sm">
                        <span className="text-muted-foreground">
                          Frais de livraison
                        </span>
                        <ProductPrice price={shippingPrice || 0} plain />
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                        <span>Total</span>
                        <ProductPrice price={totalPrice || 0} plain />
                      </div>
                    </div>
                  </motion.div>

                  {/* Actions Admin */}
                  {!isCancelled && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="space-y-2 pt-2 border-t border-border"
                    >
                      {!isPaid &&
                        (paymentMethod === 'CashOnDelivery' ||
                          paymentMethod === 'Cash On Delivery') && (
                          <ActionButton
                            caption="Marquer comme payée"
                            action={async () => {
                              if (!_id) {
                                return {
                                  success: false,
                                  message: 'ID de commande manquant',
                                }
                              }
                              const result = await updateOrderToPaid(
                                _id.toString()
                              )
                              if (result.success) {
                                onSuccess?.()
                                if (orderId) {
                                  getOrderById(orderId).then(setOrder)
                                }
                              }
                              return result
                            }}
                            className="w-full text-xs sm:text-sm"
                          />
                        )}
                      {isPaid && !isDelivered && (
                        <ActionButton
                          caption="Marquer comme livrée"
                          action={async () => {
                            if (!_id) {
                              return {
                                success: false,
                                message: 'ID de commande manquant',
                              }
                            }
                            const result = await deliverOrder(_id.toString())
                            if (result.success) {
                              onSuccess?.()
                              if (orderId) {
                                getOrderById(orderId).then(setOrder)
                              }
                            }
                            return result
                          }}
                          className="w-full text-xs sm:text-sm"
                        />
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </DialogContent>
    </Dialog>
  )
}
