'use client'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductPrice from '@/components/shared/product/product-price'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useCartStore from '@/hooks/use-cart-store'
import useSettingStore from '@/hooks/use-setting-store'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useToast } from '@/hooks/use-toast'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Package,
  Heart,
} from 'lucide-react'

export default function CartPage() {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore()
  const router = useRouter()
  const {
    setting: {
      site,
      common: { freeShippingMinPrice },
    },
  } = useSettingStore()

  const t = useTranslations()
  const { toast } = useToast()

  const handleUpdateItem = async (
    item: (typeof items)[0],
    newQuantity: number
  ) => {
    try {
      await updateItem(item, newQuantity)
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description:
          'Stock insuffisant. Quantité maximale disponible : ' +
          item.countInStock,
      })
    }
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6'>
        {/* Header Section */}
        <div className='mb-4 sm:mb-6 md:mb-8'>
          <div className='flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6'>
            <ShoppingCart className='h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground truncate'>
                {t('Cart.Shopping Cart')}
              </h1>
              <p className='text-sm sm:text-base text-muted-foreground'>
                {items.length} {items.length === 1 ? 'article' : 'articles'}{' '}
                dans votre panier
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
          {items.length === 0 ? (
            <Card className='col-span-full'>
              <CardContent className='text-center py-8 sm:py-12 md:py-16 px-4'>
                <div className='w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6'>
                  <ShoppingCart className='h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground' />
                </div>
                <h2 className='text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4'>
                  {t('Cart.Your Shopping Cart is empty')}
                </h2>
                <p className='text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto'>
                  {t.rich('Cart.Continue shopping on', {
                    name: site.name,
                    home: (chunks) => (
                      <Link href='/' className='text-primary hover:underline'>
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
                <Button asChild size='lg' className='w-full sm:w-auto'>
                  <Link href='/' className='flex items-center gap-2'>
                    <Package className='h-4 w-4 sm:h-5 sm:w-5' />
                    Commencer mes achats
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className='md:col-span-2 lg:col-span-3'>
                <Card>
                  <CardHeader className='pb-4'>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <Package className='h-5 w-5 text-primary' />
                      Articles dans votre panier
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-0'>
                    {items.map((item, index) => (
                      <div
                        key={item.clientId}
                        className={`flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-muted/50 transition-colors ${
                          index > 0 ? 'border-t' : ''
                        }`}
                      >
                        {/* Product Image */}
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex-shrink-0 self-center sm:self-start'
                        >
                          <div className='relative w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-lg overflow-hidden'>
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes='(max-width: 640px) 80px, 96px'
                                className='object-contain p-1 sm:p-2'
                              />
                            ) : (
                              <div className='flex items-center justify-center h-full text-muted-foreground'>
                                <Package className='h-5 w-5 sm:h-6 sm:w-6' />
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className='flex-1 space-y-2 sm:space-y-3 min-w-0'>
                          <div>
                            <Link
                              href={`/product/${item.slug}`}
                              className='text-base sm:text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 block'
                            >
                              {item.name}
                            </Link>
                            <div className='flex flex-wrap gap-1 sm:gap-2 mt-2'>
                              <Badge
                                variant='secondary'
                                className='text-xs px-2 py-1'
                              >
                                {t('Cart.Color')}: {item.color}
                              </Badge>
                              <Badge
                                variant='secondary'
                                className='text-xs px-2 py-1'
                              >
                                {t('Cart.Size')}: {item.size}
                              </Badge>
                              <Badge
                                variant={
                                  item.countInStock <= 5
                                    ? 'destructive'
                                    : 'secondary'
                                }
                                className='text-xs px-2 py-1'
                              >
                                Stock: {item.countInStock}
                              </Badge>
                            </div>
                          </div>

                          {/* Quantity and Actions */}
                          <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4'>
                            <div className='flex items-center border rounded-lg w-fit'>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() =>
                                  handleUpdateItem(
                                    item,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className='h-8 w-8 p-0'
                              >
                                <Minus className='h-3 w-3 sm:h-4 sm:w-4' />
                              </Button>
                              <span className='px-2 sm:px-3 py-1 text-sm font-medium min-w-[2.5rem] sm:min-w-[3rem] text-center'>
                                {item.quantity}
                              </span>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() =>
                                  handleUpdateItem(item, item.quantity + 1)
                                }
                                disabled={item.quantity >= item.countInStock}
                                className='h-8 w-8 p-0'
                              >
                                <Plus className='h-3 w-3 sm:h-4 sm:w-4' />
                              </Button>
                            </div>

                            <Button
                              variant='outline'
                              size='sm'
                              className='text-destructive hover:text-destructive w-full sm:w-auto'
                              onClick={() => removeItem(item)}
                            >
                              <Trash2 className='h-3 w-3 sm:h-4 sm:w-4 mr-1' />
                              {t('Cart.Delete')}
                            </Button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 w-full sm:w-auto sm:min-w-[100px] md:min-w-[120px]'>
                          <div className='text-left sm:text-right'>
                            {item.quantity > 1 && (
                              <p className='text-xs sm:text-sm text-muted-foreground mb-1'>
                                {item.quantity} ×{' '}
                                <ProductPrice price={item.price} plain />
                              </p>
                            )}
                            <p className='text-lg sm:text-xl font-bold text-foreground'>
                              <ProductPrice
                                price={item.price * item.quantity}
                                plain
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Subtotal */}
                    <div className='flex justify-between items-center pt-4 border-t'>
                      <span className='text-lg font-medium text-foreground'>
                        {t('Cart.Subtotal')} (
                        {items.reduce((acc, item) => acc + item.quantity, 0)}{' '}
                        {t('Cart.Items')})
                      </span>
                      <span className='text-2xl font-bold text-primary'>
                        <ProductPrice price={itemsPrice} plain />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className='md:col-span-1 lg:col-span-1 order-first md:order-last'>
                <Card className='md:sticky md:top-6'>
                  <CardHeader className='pb-3 sm:pb-4'>
                    <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
                      <ShoppingCart className='h-4 w-4 sm:h-5 sm:w-5 text-primary' />
                      Résumé de la commande
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3 sm:space-y-4'>
                    {/* Shipping Info */}
                    <div className='p-3 sm:p-4 rounded-lg bg-muted/30'>
                      {itemsPrice < freeShippingMinPrice ? (
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground'>
                            <Truck className='h-3 w-3 sm:h-4 sm:w-4' />
                            Livraison gratuite
                          </div>
                          <p className='text-xs sm:text-sm leading-relaxed'>
                            {t('Cart.Add')}{' '}
                            <span className='font-semibold text-primary'>
                              <ProductPrice
                                price={freeShippingMinPrice - itemsPrice}
                                plain
                              />
                            </span>{' '}
                            {t(
                              'Cart.of eligible items to your order to qualify for FREE Shipping'
                            )}
                          </p>
                          <div className='w-full bg-muted rounded-full h-1.5 sm:h-2'>
                            <div
                              className='bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-300'
                              style={{
                                width: `${Math.min(100, (itemsPrice / freeShippingMinPrice) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className='flex items-center gap-2 text-primary'>
                          <Truck className='h-4 w-4 sm:h-5 sm:w-5' />
                          <span className='text-sm sm:text-base font-semibold'>
                            {t('Cart.Your order qualifies for FREE Shipping')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Order Summary */}
                    <div className='space-y-3'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>
                          Sous-total (
                          {items.reduce((acc, item) => acc + item.quantity, 0)}{' '}
                          articles)
                        </span>
                        <span className='font-medium'>
                          <ProductPrice price={itemsPrice} plain />
                        </span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Livraison</span>
                        <span className='font-medium text-green-600'>
                          {itemsPrice >= freeShippingMinPrice
                            ? 'Gratuite'
                            : 'À calculer'}
                        </span>
                      </div>
                      <div className='border-t pt-3'>
                        <div className='flex justify-between text-lg font-bold'>
                          <span>Total</span>
                          <span className='text-primary'>
                            <ProductPrice price={itemsPrice} plain />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Button
                      onClick={() => router.push('/checkout')}
                      size='lg'
                      className='w-full h-11 sm:h-12'
                    >
                      <div className='flex items-center gap-2'>
                        <ArrowRight className='h-4 w-4 sm:h-5 sm:w-5' />
                        <span className='text-sm sm:text-base'>
                          {t('Cart.Proceed to Checkout')}
                        </span>
                      </div>
                    </Button>

                    {/* Continue Shopping */}
                    <Button
                      asChild
                      variant='outline'
                      className='w-full h-10 sm:h-11'
                    >
                      <Link href='/' className='flex items-center gap-2'>
                        <Package className='h-3 w-3 sm:h-4 sm:w-4' />
                        <span className='text-sm sm:text-base'>
                          Continuer mes achats
                        </span>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* Browsing History Section */}
        <div className='mt-6 sm:mt-8'>
          <div className='flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4'>
            <Heart className='h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0' />
            <h2 className='text-base sm:text-lg font-bold text-foreground'>
              Articles récemment consultés
            </h2>
          </div>
          <Card>
            <CardContent className='pt-3 sm:pt-4 px-2 sm:px-4'>
              <BrowsingHistoryList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
