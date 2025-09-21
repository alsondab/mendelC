'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useWishlistStore } from '@/hooks/use-wishlist-store'
import { cn } from '@/lib/utils'
import useIsMounted from '@/hooks/use-is-mounted'

interface WishlistButtonProps {
  productId: string
  product: {
    _id: string
    name: string
    slug: string
    price: number
    image: string
    countInStock: number
    brand: string
    category: string
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
  const isMounted = useIsMounted()
  const { addItem, removeItem, isInWishlist } = useWishlistStore()

  // État local pour éviter les problèmes d'hydratation
  const [isInWishlistState, setIsInWishlistState] = useState(false)

  // Synchroniser l'état local avec le store après l'hydratation
  useEffect(() => {
    if (isMounted) {
      setIsInWishlistState(isInWishlist(productId))
    }
  }, [isMounted, isInWishlist, productId])

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    setIsLoading(true)
    setIsAnimating(true)

    try {
      if (isInWishlistState) {
        // Supprimer des favoris
        removeItem(productId)
        setIsInWishlistState(false)
        toast({
          title: 'Favori supprimé',
          description: 'Le produit a été retiré de vos favoris',
        })
      } else {
        // Ajouter aux favoris
        const wishlistItem = {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.image,
          countInStock: product.countInStock,
          brand: product.brand,
          category: product.category,
        }
        addItem(wishlistItem)
        setIsInWishlistState(true)
        toast({
          title: 'Favori ajouté',
          description: 'Le produit a été ajouté à vos favoris',
        })
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
