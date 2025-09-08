'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import ProductPrice from '@/components/shared/product/product-price'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import useIsMounted from '@/hooks/use-is-mounted'

interface WishlistItem {
  _id: string
  user?: string
  sessionId?: string
  product: {
    _id: string
    name: string
    slug: string
    price: number
    image: string
    countInStock: number
  }
  createdAt: string
}

export default function WishlistContent() {
  const t = useTranslations()
  const { toast } = useToast()
  const { data: session } = useSession()
  const isMounted = useIsMounted()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les favoris
  useEffect(() => {
    if (!isMounted) return

    const fetchWishlist = async () => {
      try {
        const response = await fetch('/api/wishlist/list')
        const data = await response.json()

        if (data.success) {
          setWishlist(data.wishlist || [])
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError('Une erreur est survenue')
        console.error('Error fetching wishlist:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()

    // Écouter les changements de wishlist
    const handleWishlistChange = () => {
      fetchWishlist()
    }

    window.addEventListener('wishlistChanged', handleWishlistChange)
    return () => {
      window.removeEventListener('wishlistChanged', handleWishlistChange)
    }
  }, [isMounted])

  if (loading) {
    return (
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className='flex gap-4 p-4 border border-border rounded-lg animate-pulse'
          >
            <div className='w-24 h-24 bg-muted rounded-lg'></div>
            <div className='flex-1 space-y-2'>
              <div className='h-4 bg-muted rounded w-3/4'></div>
              <div className='h-4 bg-muted rounded w-1/2'></div>
              <div className='h-4 bg-muted rounded w-1/4'></div>
            </div>
            <div className='w-20 h-8 bg-muted rounded'></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <Heart className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
        <h3 className='text-lg font-semibold text-foreground mb-2'>Erreur</h3>
        <p className='text-muted-foreground mb-6'>{error}</p>
        <Link href='/'>
          <Button>
            <ShoppingCart className='h-4 w-4 mr-2' />
            Continuer les achats
          </Button>
        </Link>
      </div>
    )
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className='text-center py-12'>
        <Heart className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
        <h3 className='text-lg font-semibold text-foreground mb-2'>
          {t('Wishlist.Empty.Title')}
        </h3>
        <p className='text-muted-foreground mb-6'>
          {session?.user?.id
            ? t('Wishlist.Empty.Description')
            : "Vos favoris apparaîtront ici. Ajoutez des produits à vos favoris en cliquant sur l'icône cœur."}
        </p>
        <div className='flex gap-4 justify-center'>
          <Link href='/'>
            <Button>
              <ShoppingCart className='h-4 w-4 mr-2' />
              {t('Wishlist.Empty.ContinueShopping')}
            </Button>
          </Link>
          {!session?.user?.id && (
            <Link href='/sign-in'>
              <Button variant='outline'>Se connecter pour synchroniser</Button>
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {wishlist.map((item) => (
        <div
          key={item._id}
          className='flex gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow'
        >
          {/* Image du produit */}
          <div className='relative'>
            <Link href={`/product/${item.product.slug}`}>
              <Image
                src={item.product.image || '/placeholder-product.jpg'}
                alt={item.product.name}
                width={96}
                height={96}
                className='rounded-lg object-cover'
              />
            </Link>
          </div>

          {/* Informations du produit */}
          <div className='flex-1 min-w-0'>
            <Link href={`/product/${item.product.slug}`}>
              <h3 className='font-semibold text-foreground hover:text-primary transition-colors line-clamp-2'>
                {item.product.name}
              </h3>
            </Link>

            <div className='mt-2'>
              <ProductPrice price={item.product.price} />
            </div>

            <div className='mt-2 text-sm text-muted-foreground'>
              {item.product.countInStock > 0 ? (
                <span className='text-green-600'>En stock</span>
              ) : (
                <span className='text-red-600'>Rupture de stock</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className='flex flex-col gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300'
              onClick={async () => {
                try {
                  const response = await fetch(
                    `/api/wishlist?productId=${item.product._id}`,
                    {
                      method: 'DELETE',
                    }
                  )
                  const result = await response.json()

                  if (result.success) {
                    setWishlist((prev) =>
                      prev.filter(
                        (wishlistItem) => wishlistItem._id !== item._id
                      )
                    )
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
                } catch (error) {
                  console.error('Error removing from wishlist:', error)
                  toast({
                    title: 'Erreur',
                    description:
                      'Une erreur est survenue lors de la suppression',
                    variant: 'destructive',
                  })
                }
              }}
            >
              <Heart className='h-4 w-4 mr-2 fill-red-500' />
              Retirer
            </Button>

            {item.product.countInStock > 0 && (
              <Link href={`/product/${item.product.slug}`}>
                <Button size='sm' className='w-full'>
                  <ShoppingCart className='h-4 w-4 mr-2' />
                  Voir
                </Button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
