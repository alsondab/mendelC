'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { getUserWishlist } from '@/lib/actions/wishlist.actions'
import { useWishlistStore } from '@/hooks/use-wishlist-store'
import { useSession } from 'next-auth/react'

export default function WishlistCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchWishlistCount = async () => {
      const { success, wishlist } = await getUserWishlist()
      if (success && wishlist) {
        setCount(wishlist.length)
      }
    }
    fetchWishlistCount()
  }, [])

  return (
    <Link
      href='/wishlist'
      className='flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors relative'
    >
      <Heart className='h-4 w-4' />
      <span>Favoris</span>
      {count > 0 && (
        <span className='absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold'>
          {count}
        </span>
      )}
    </Link>
  )
}





