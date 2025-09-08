'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { getUserWishlist } from '@/lib/actions/wishlist.actions'
import { useWishlistStore } from '@/hooks/use-wishlist-store'
import { useSession } from 'next-auth/react'
import useIsMounted from '@/hooks/use-is-mounted'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export default function WishlistCount() {
  const [count, setCount] = useState(0)
  const { data: session } = useSession()
  const { items: wishlistItems } = useWishlistStore()
  const isMounted = useIsMounted()
  const pathname = usePathname()
  const t = useTranslations()

  useEffect(() => {
    if (!isMounted) return
    
    const fetchWishlistCount = async () => {
      if (session?.user?.id) {
        // Utilisateur connecté - utiliser l'API
        const { success, wishlist } = await getUserWishlist()
        if (success && wishlist) {
          setCount(wishlist.length)
        }
      } else {
        // Utilisateur non connecté - utiliser le store local
        setCount(wishlistItems.length)
      }
    }
    fetchWishlistCount()
  }, [isMounted, session?.user?.id, wishlistItems.length])

  // Écouter les changements de wishlist
  useEffect(() => {
    const handleWishlistChange = () => {
      if (session?.user?.id) {
        // Pour les utilisateurs connectés, recharger depuis l'API
        const fetchWishlistCount = async () => {
          const { success, wishlist } = await getUserWishlist()
          if (success && wishlist) {
            setCount(wishlist.length)
          }
        }
        fetchWishlistCount()
      } else {
        // Pour les utilisateurs non connectés, utiliser le store local
        setCount(wishlistItems.length)
      }
    }

    window.addEventListener('wishlistChanged', handleWishlistChange)
    return () => {
      window.removeEventListener('wishlistChanged', handleWishlistChange)
    }
  }, [session?.user?.id, wishlistItems.length])

  // Ne pas afficher les favoris dans la page admin
  if (pathname.includes('/admin')) {
    return null
  }

  // Toujours rediriger vers la page des favoris (comme le panier)
  const href = '/wishlist'

  return (
    <Link
      href={href}
      className={cn(
        'relative flex items-center justify-center transition-all duration-200',
        'flex-row space-x-2 px-3 py-2 rounded-lg hover:bg-muted/80'
      )}
    >
      <div className='relative'>
        <Heart className='h-5 w-5 text-foreground' />

        {/* Wishlist Badge - Toujours afficher si il y a des favoris */}
        {isMounted && count > 0 && (
          <span
            className={cn(
              'absolute -top-1 -right-1',
              'bg-orange-500 text-white',
              'rounded-full text-xs font-bold min-w-[20px] h-5',
              'flex items-center justify-center px-1',
              'animate-in zoom-in-50 duration-200'
            )}
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>

      {/* Wishlist Text - Desktop Only */}
      <span className='hidden md:block font-medium text-sm'>
        {t('Header.Wishlist')}
      </span>
    </Link>
  )
}
