'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import ProductPrice from '@/components/shared/product/product-price'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useToast } from '@/hooks/use-toast'
import { useWishlistStore } from '@/hooks/use-wishlist-store'
import useIsMounted from '@/hooks/use-is-mounted'

export default function WishlistContent() {
  const t = useTranslations()
  const { toast } = useToast()
  const isMounted = useIsMounted()
  const { items: wishlist, removeItem } = useWishlistStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isMounted) {
      setLoading(false)
    }
  }, [isMounted])

  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg animate-pulse"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-lg mx-auto sm:mx-0"></div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="h-4 bg-muted rounded w-3/4 mx-auto sm:mx-0"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto sm:mx-0"></div>
              <div className="h-4 bg-muted rounded w-1/4 mx-auto sm:mx-0"></div>
            </div>
            <div className="flex gap-2 justify-center sm:justify-start">
              <div className="w-16 sm:w-20 h-8 bg-muted rounded"></div>
              <div className="w-16 sm:w-20 h-8 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
          {t('Wishlist.Empty.Title')}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          Vos favoris apparaîtront ici. Ajoutez des produits à vos favoris en
          cliquant sur l&apos;icône cœur.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="/">
            <Button size="sm" className="text-xs sm:text-sm">
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              {t('Wishlist.Empty.ContinueShopping')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {wishlist.map((item) => (
        <div
          key={item._id}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
        >
          {/* Image du produit */}
          <div className="relative flex-shrink-0 mx-auto sm:mx-0">
            <Link href={`/product/${item.slug}`}>
              <Image
                src={item.image || '/placeholder-product.jpg'}
                alt={item.name}
                width={120}
                height={120}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
              />
            </Link>
          </div>

          {/* Informations du produit */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <Link href={`/product/${item.slug}`}>
              <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 text-sm sm:text-base">
                {item.name}
              </h3>
            </Link>

            <div className="mt-2">
              <ProductPrice price={item.price} />
            </div>

            <div className="mt-2 text-xs sm:text-sm text-muted-foreground">
              {item.countInStock > 0 ? (
                <span className="text-green-600">En stock</span>
              ) : (
                <span className="text-red-600">Rupture de stock</span>
              )}
            </div>
          </div>

          {/* Actions - Responsive */}
          <div className="flex flex-row sm:flex-col gap-2 sm:gap-2 justify-center sm:justify-start">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:w-full text-luxury-red border-luxury-red hover:bg-luxury-red hover:text-white text-xs sm:text-sm px-2 sm:px-3"
              onClick={() => {
                removeItem(item._id)
                toast({
                  title: 'Favori supprimé',
                  description: 'Le produit a été retiré de vos favoris',
                })
              }}
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 fill-luxury-red" />
              <span className="hidden xs:inline">Retirer</span>
            </Button>

            {item.countInStock > 0 && (
              <Link href={`/product/${item.slug}`} className="flex-1 sm:w-full">
                <Button
                  size="sm"
                  className="w-full text-xs sm:text-sm px-2 sm:px-3"
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Voir</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
