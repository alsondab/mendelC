'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useWishlistStore } from '@/hooks/use-wishlist-store'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  showCount?: boolean
}

export default function WishlistButton({
  productId,
  className,
  size = 'md',
  showText = false,
  showCount = false,
}: WishlistButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isInWishlistState, setIsInWishlistState] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const response = await fetch(`/api/wishlist?productId=${productId}`)
        const data = await response.json()
        if (data.success) {
          setIsInWishlistState(data.isInWishlist)
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
  }, [productId])

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    setIsLoading(true)
    setIsAnimating(true)

    try {
      if (isInWishlistState) {
        const response = await fetch(`/api/wishlist?productId=${productId}`, {
          method: 'DELETE',
        })
        const result = await response.json()
        if (result.success) {
          setIsInWishlistState(false)
          toast({
            title: 'Favori supprimé',
            description: 'Le produit a été retiré de vos favoris',
          })
          // Trigger wishlist change event
          window.dispatchEvent(new CustomEvent('wishlistChanged'))
        } else {
          toast({
            title: 'Erreur',
            description: result.message,
            variant: 'destructive',
          })
        }
      } else {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        })
        const result = await response.json()
        if (result.success) {
          setIsInWishlistState(true)
          toast({
            title: 'Favori ajouté',
            description: 'Le produit a été ajouté à vos favoris',
          })
          // Trigger wishlist change event
          window.dispatchEvent(new CustomEvent('wishlistChanged'))
        } else {
          toast({
            title: 'Erreur',
            description: result.message,
            variant: 'destructive',
          })
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
