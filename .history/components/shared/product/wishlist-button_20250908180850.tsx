'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useWishlistStore } from '@/hooks/use-wishlist-store'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import useIsMounted from '@/hooks/use-is-mounted'

interface WishlistButtonProps {
  productId: string
  product?: {
    _id: string
    name: string
    slug: string
    price: number
    image: string
    countInStock: number
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  showCount?: boolean
}

export default function WishlistButton({
  productId,
  product,
  className,
  size = 'md',
  showText = false,
  showCount = false,
}: WishlistButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()
  const isMounted = useIsMounted()
  const {
    items: wishlistItems,
    addItem,
    removeItem,
    isInWishlist,
  } = useWishlistStore()

  // Ne pas vérifier l'état des favoris avant l'hydratation
  const isInWishlistState = isMounted ? isInWishlist(productId) : false

  useEffect(() => {
    // Pour les utilisateurs connectés, vérifier le statut via l'API
    if (session?.user?.id) {
      const checkWishlistStatus = async () => {
        try {
          const response = await fetch(`/api/wishlist?productId=${productId}`)
          const data = await response.json()
          if (data.success) {
            // Synchroniser avec le store local
            if (data.isInWishlist && !isInWishlistState) {
              // Ajouter au store local si pas déjà présent
              // Note: On aurait besoin des données du produit pour l'ajouter correctement
            }
          }
        } catch (error) {
          console.error('Error checking wishlist status:', error)
        }
      }
      checkWishlistStatus()

      // Listen for wishlist changes to update the button state
      const handleWishlistChange = () => {
        checkWishlistStatus()
      }

      window.addEventListener('wishlistChanged', handleWishlistChange)

      return () => {
        window.removeEventListener('wishlistChanged', handleWishlistChange)
      }
    }
    // Pour les utilisateurs non connectés, le store local gère déjà l'état
  }, [productId, session?.user?.id, isInWishlistState])

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    setIsLoading(true)
    setIsAnimating(true)

    try {
      if (isInWishlistState) {
        // Supprimer des favoris
        if (session?.user?.id) {
          // Utilisateur connecté - vérifier d'abord si c'est un favori local ou API
          const wishlistItem = wishlistItems.find(
            (item) => item.product._id === productId
          )

          if (wishlistItem && wishlistItem._id.startsWith('local_')) {
            // C'est un favori local - supprimer du store local seulement
            removeItem(productId)
            toast({
              title: 'Favori supprimé',
              description: 'Le produit a été retiré de vos favoris',
            })
            window.dispatchEvent(new CustomEvent('wishlistChanged'))
          } else {
            // C'est un favori API - supprimer via l'API
            const response = await fetch(
              `/api/wishlist?productId=${productId}`,
              {
                method: 'DELETE',
              }
            )
            const result = await response.json()
            if (result.success) {
              removeItem(productId)
              toast({
                title: 'Favori supprimé',
                description: 'Le produit a été retiré de vos favoris',
              })
              window.dispatchEvent(new CustomEvent('wishlistChanged'))
            } else {
              // Si l'API échoue, supprimer quand même du store local
              removeItem(productId)
              toast({
                title: 'Favori supprimé',
                description: 'Le produit a été retiré de vos favoris (local)',
              })
              window.dispatchEvent(new CustomEvent('wishlistChanged'))
            }
          }
        } else {
          // Utilisateur non connecté - utiliser le store local
          removeItem(productId)
          toast({
            title: 'Favori supprimé',
            description: 'Le produit a été retiré de vos favoris',
          })
          window.dispatchEvent(new CustomEvent('wishlistChanged'))
        }
      } else {
        // Ajouter aux favoris
        if (session?.user?.id) {
          // Utilisateur connecté - utiliser l'API
          const response = await fetch('/api/wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
          })
          const result = await response.json()
          if (result.success) {
            // Synchroniser avec le store local
            if (product) {
              const wishlistItem = {
                _id: `api_${productId}_${Date.now()}`,
                product: {
                  _id: product._id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  image: product.image,
                  countInStock: product.countInStock,
                },
                createdAt: new Date().toISOString(),
              }
              addItem(wishlistItem)
            }
            toast({
              title: 'Favori ajouté',
              description: 'Le produit a été ajouté à vos favoris',
            })
            window.dispatchEvent(new CustomEvent('wishlistChanged'))
          } else {
            toast({
              title: 'Erreur',
              description: result.message,
              variant: 'destructive',
            })
          }
        } else {
          // Utilisateur non connecté - utiliser le store local
          if (product) {
            const wishlistItem = {
              _id: `local_${productId}_${Date.now()}`,
              product: {
                _id: product._id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.image,
                countInStock: product.countInStock,
              },
              createdAt: new Date().toISOString(),
            }
            addItem(wishlistItem)
            toast({
              title: 'Favori ajouté',
              description: 'Le produit a été ajouté à vos favoris (local)',
            })
            window.dispatchEvent(new CustomEvent('wishlistChanged'))
          } else {
            toast({
              title: 'Erreur',
              description: 'Données du produit manquantes',
              variant: 'destructive',
            })
          }
        }
      }
    } catch {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  const iconSizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
  }

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={cn(
        'relative overflow-hidden transition-all duration-300 hover:scale-110',
        sizeClasses[size],
        className
      )}
    >
      <Heart
        className={cn(
          'transition-all duration-300',
          iconSizeClasses[size],
          isInWishlistState
            ? 'fill-orange-500 text-orange-500 drop-shadow-sm'
            : 'text-muted-foreground hover:text-orange-500',
          isAnimating && 'animate-pulse scale-125'
        )}
      />

      {/* Effet de particules */}
      {isAnimating && (
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <div className='w-2 h-2 bg-orange-500 rounded-full animate-ping opacity-75'></div>
          </div>
        </div>
      )}

      {showText && (
        <span className='ml-2 text-sm'>
          {isInWishlistState ? 'Retirer' : 'Ajouter'}
        </span>
      )}

      {showCount && isInWishlistState && (
        <span className='absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold'>
          1
        </span>
      )}
    </Button>
  )
}
