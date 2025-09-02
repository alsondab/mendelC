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

  const handleUpdateItem = async (item: any, newQuantity: number) => {
    try {
      await updateItem(item, newQuantity)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Stock insuffisant. Quantité maximale disponible : ' + item.countInStock,
      })
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
      <div className='max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8'>
        {/* Header Section */}
        <div className='mb-6 md:mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 md:mb-6'>
            <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
              <ShoppingCart className='h-6 w-6 text-white' />
            </div>
            <div>
              <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-foreground'>
                {t('Cart.Shopping Cart')}
              </h1>
              <p className='text-muted-foreground'>
                {items.length} {items.length === 1 ? 'article' : 'articles'}{' '}
                dans votre panier
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
          {items.length === 0 ? (
            <Card className='col-span-full bg-white dark:bg-slate-800 shadow-lg border-0'>
              <CardContent className='text-center py-16'>
                <div className='w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <ShoppingCart className='h-12 w-12 text-slate-400' />
                </div>
                <h2 className='text-2xl font-bold text-foreground mb-4'>
                  {t('Cart.Your Shopping Cart is empty')}
                </h2>
                <p className='text-muted-foreground mb-8 max-w-md mx-auto'>
                  {t.rich('Cart.Continue shopping on', {
                    name: site.name,
                    home: (chunks) => (
                      <Link href='/' className='text-primary hover:underline'>
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
                <Button
                  asChild
                  size='lg'
                  className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                >
                  <Link href='/' className='flex items-center gap-2'>
                    <Package className='h-5 w-5' />
                    Commencer mes achats
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className='md:col-span-2 lg:col-span-3'>
                <Card className='bg-white dark:bg-slate-800 shadow-lg border-0'>
                  <CardHeader className='pb-4'>
                    <CardTitle className='flex items-center gap-2 text-lg md:text-xl'>
                      <Package className='h-5 w-5 text-blue-600' />
                      Articles dans votre panier
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4 md:space-y-6'>
                    {items.map((item) => (
                      <div
                        key={item.clientId}
                        className='flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow'
                      >
                        {/* Product Image */}
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex-shrink-0'
                        >
                          <div className='relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-slate-50 dark:bg-slate-700 rounded-lg overflow-hidden'>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes='(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 144px, 160px'
                              className='object-contain p-2'
                            />
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className='flex-1 space-y-3'>
                          <div>
                            <Link
                              href={`/product/${item.slug}`}
                              className='text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2'
                            >
                              {item.name}
                            </Link>
                            <div className='flex flex-wrap gap-2 mt-2'>
                              <Badge variant='secondary' className='text-xs'>
                                {t('Cart.Color')}: {item.color}
                              </Badge>
                              <Badge variant='secondary' className='text-xs'>
                                {t('Cart.Size')}: {item.size}
                              </Badge>
                              <Badge 
                                variant={item.countInStock <= 5 ? 'destructive' : 'secondary'} 
                                className='text-xs'
                              >
                                Stock: {item.countInStock}
                              </Badge>
                            </div>
                          </div>

                          {/* Quantity and Actions */}
                          <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-3'>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm font-medium text-muted-foreground'>
                                {t('Cart.Quantity')}:
                              </span>
                              <div className='flex items-center border border-slate-200 dark:border-slate-700 rounded-lg'>
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
                                  <Minus className='h-4 w-4' />
                                </Button>
                                <span className='px-3 py-1 text-sm font-medium min-w-[3rem] text-center'>
                                  {item.quantity}
                                </span>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() =>
                                    handleUpdateItem(
                                      item,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={item.quantity >= item.countInStock}
                                  className='h-8 w-8 p-0'
                                >
                                  <Plus className='h-4 w-4' />
                                </Button>
                              </div>
                            </div>

                            <div className='flex gap-2'>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-red-600 hover:text-red-700 hover:bg-red-50'
                                onClick={() => removeItem(item)}
                              >
                                <Trash2 className='h-4 w-4 mr-1' />
                                {t('Cart.Delete')}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className='flex flex-col items-end justify-between min-w-[100px] md:min-w-[120px]'>
                          <div className='text-right'>
                            {item.quantity > 1 && (
                              <p className='text-sm text-muted-foreground mb-1'>
                                {item.quantity} ×{' '}
                                <ProductPrice price={item.price} plain />
                              </p>
                            )}
                            <p className='text-xl font-bold text-foreground'>
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
                    <div className='flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700'>
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
              <div className='md:col-span-1 lg:col-span-1'>
                <Card className='bg-white dark:bg-slate-800 shadow-lg border-0 md:sticky md:top-6'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <ShoppingCart className='h-5 w-5 text-green-600' />
                      Résumé de la commande
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4 md:space-y-6'>
                    {/* Shipping Info */}
                    <div className='p-3 md:p-4 rounded-lg border border-slate-200 dark:border-slate-700'>
                      {itemsPrice < freeShippingMinPrice ? (
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Truck className='h-4 w-4' />
                            Livraison gratuite
                          </div>
                          <p className='text-sm'>
                            {t('Cart.Add')}{' '}
                            <span className='font-semibold text-green-600'>
                              <ProductPrice
                                price={freeShippingMinPrice - itemsPrice}
                                plain
                              />
                            </span>{' '}
                            {t(
                              'Cart.of eligible items to your order to qualify for FREE Shipping'
                            )}
                          </p>
                          <div className='w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2'>
                            <div
                              className='bg-green-500 h-2 rounded-full transition-all duration-300'
                              style={{
                                width: `${Math.min(100, (itemsPrice / freeShippingMinPrice) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className='flex items-center gap-2 text-green-600'>
                          <Truck className='h-5 w-5' />
                          <span className='font-semibold'>
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
                      <div className='border-t border-slate-200 dark:border-slate-700 pt-3'>
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
                      className='w-full h-11 md:h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200'
                    >
                      <div className='flex items-center gap-2'>
                        <ArrowRight className='h-5 w-5' />
                        {t('Cart.Proceed to Checkout')}
                      </div>
                    </Button>

                    {/* Continue Shopping */}
                    <Button asChild variant='outline' className='w-full'>
                      <Link href='/' className='flex items-center gap-2'>
                        <Package className='h-4 w-4' />
                        Continuer mes achats
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* Browsing History Section */}
        <div className='mt-8 md:mt-12'>
          <div className='flex items-center gap-3 mb-4 md:mb-6'>
            <div className='w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center'>
              <Heart className='h-4 w-4 text-white' />
            </div>
            <h2 className='text-lg md:text-xl font-bold text-foreground'>
              Articles récemment consultés
            </h2>
          </div>
          <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg border-0 pt-4 px-4 md:pt-6 md:px-6 pb-0'>
            <BrowsingHistoryList />
          </div>
        </div>
      </div>
    </div>
  )
}
