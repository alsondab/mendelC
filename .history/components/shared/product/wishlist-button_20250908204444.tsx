'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
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
  const [isInWishlist, setIsInWishlist] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()
  const isMounted = useIsMounted()

  // Vérifier le statut des favoris au chargement
  useEffect(() => {
    if (!isMounted) return

    const checkWishlistStatus = async () => {
      try {
        const response = await fetch(`/api/wishlist?productId=${productId}`)
        const data = await response.json()
        if (data.success) {
          setIsInWishlist(data.isInWishlist)
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error)
      }
    }

    checkWishlistStatus()

    // Écouter les changements de wishlist
    const handleWishlistChange = () => {
      checkWishlistStatus()
    }

    window.addEventListener('wishlistChanged', handleWishlistChange)
    return () => {
      window.removeEventListener('wishlistChanged', handleWishlistChange)
    }
  }, [isMounted, productId])

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    setIsLoading(true)
    setIsAnimating(true)

    try {
      if (isInWishlist) {
        // Supprimer des favoris
        const response = await fetch(
          `/api/wishlist?productId=${productId}`,
          {
            method: 'DELETE',
          }
        )
        const result = await response.json()
        
        if (result.success) {
          setIsInWishlist(false)
          toast({
            title: 'Favori supprimé',
            description: 'Le produit a été retiré de vos favoris',
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
        // Ajouter aux favoris
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        })
        const result = await response.json()
        
        if (result.success) {
          setIsInWishlist(true)
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
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
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
          isInWishlist
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
          {isInWishlist ? 'Retirer' : 'Ajouter'}
        </span>
      )}

      {showCount && isInWishlist && (
        <span className='absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold'>
          1
        </span>
      )}
    </Button>
  )
}