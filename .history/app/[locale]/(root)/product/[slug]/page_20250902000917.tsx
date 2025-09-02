import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import AddToCart from '@/components/shared/product/add-to-cart'
import { Card, CardContent } from '@/components/ui/card'
import {
  getProductBySlugWithStatus,
  getRelatedProductsByCategory,
} from '@/lib/actions/product.actions'

import ReviewList from './review-list'
import { generateId, round2 } from '@/lib/utils'
import SelectVariant from '@/components/shared/product/select-variant'
import ProductPrice from '@/components/shared/product/product-price'
import ProductGallery from '@/components/shared/product/product-gallery'
import AddToBrowsingHistory from '@/components/shared/product/add-to-browsing-history'

import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import RatingSummary from '@/components/shared/product/rating-summary'
import ProductSlider from '@/components/shared/product/product-slider'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const t = await getTranslations()
  const params = await props.params

  const { product, isPublished, exists } = await getProductBySlugWithStatus(
    params.slug
  )

  if (!exists) {
    return {
      title: t('Product.Product not found'),
      description: 'The requested product could not be found.',
    }
  }

  if (!isPublished) {
    return {
      title: 'Product Not Available',
      description: 'This product is not currently available for viewing.',
    }
  }

  return {
    title: product!.name,
    description: product!.description,
  }
}

export default async function ProductDetails(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string; color: string; size: string }>
}) {
  const searchParams = await props.searchParams

  const { page, color } = searchParams

  const params = await props.params

  const { slug } = params

  const session = await auth()

  const {
    product: productData,
    isPublished,
    exists,
  } = await getProductBySlugWithStatus(slug)

  if (!exists) {
    // Product doesn't exist at all
    notFound()
  }

  if (!isPublished) {
    // Product exists but is not published - show custom error
    throw new Error(
      'Product exists but is not published. Please contact an administrator.'
    )
  }

  const product = productData!
  let relatedProducts

  try {
    relatedProducts = await getRelatedProductsByCategory({
      category: product.category,
      productId: product._id,
      page: Number(page || '1'),
    })
  } catch {
    // If related products can't be loaded, continue without them
    relatedProducts = { data: [], totalPages: 0 }
  }

  const t = await getTranslations()
  return (
    <div className='p-1 xs:p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto'>
      <AddToBrowsingHistory id={product._id} category={product.category} />
      <section className='mb-4 sm:mb-8'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-2 xs:gap-4 lg:gap-8'>
          {/* Product Gallery */}
          <div className='lg:col-span-7'>
            <div className='lg:sticky lg:top-4'>
              <ProductGallery images={product.images} />
            </div>
          </div>

          {/* Product Info */}
          <div className='lg:col-span-5 space-y-3 sm:space-y-6'>
            {/* Product Header */}
            <div className='space-y-2 sm:space-y-4'>
              <div className='flex flex-wrap items-center gap-1 xs:gap-2'>
                <span className='px-2 xs:px-3 py-1 rounded-full bg-primary/10 text-primary text-xs xs:text-sm font-medium'>
                  {t('Product.Brand')} {product.brand}
                </span>
                <span className='px-2 xs:px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs xs:text-sm'>
                  {product.category}
                </span>
              </div>

              <h1 className='font-bold text-lg xs:text-xl sm:text-2xl lg:text-3xl leading-tight'>
                {product.name}
              </h1>

              <RatingSummary
                avgRating={product.avgRating}
                numReviews={product.numReviews}
                asPopover
                ratingDistribution={product.ratingDistribution}
              />

              <div className='flex items-center gap-2 xs:gap-4'>
                <ProductPrice
                  price={product.price}
                  listPrice={product.listPrice}
                  isDeal={product.tags.includes('todays-deal')}
                />
              </div>
            </div>
            {/* Variants */}
            <div className='bg-muted/30 rounded-lg p-2 xs:p-3 sm:p-4'>
              <SelectVariant
                product={product}
                color={color || product.colors[0]}
              />
            </div>

            {/* Cart Section */}
            <Card className='border-2 border-primary/20 shadow-lg'>
              <CardContent className='p-3 xs:p-4 sm:p-6 space-y-3 sm:space-y-4'>
                <div className='text-center'>
                  <ProductPrice price={product.price} />
                </div>

                {/* Stock Status */}
                <div className='text-center'>
                  {product.countInStock > 0 && product.countInStock <= 3 && (
                    <div className='inline-flex items-center gap-1 xs:gap-2 px-2 xs:px-3 py-1 xs:py-2 rounded-full bg-orange-100 text-orange-800 text-xs xs:text-sm font-semibold mb-2'>
                      <div className='w-1.5 xs:w-2 h-1.5 xs:h-2 bg-orange-500 rounded-full animate-pulse'></div>
                      <span className='hidden xs:inline'>
                        {t('Product.Only X left in stock - order soon', {
                          count: product.countInStock,
                        })}
                      </span>
                      <span className='xs:hidden'>
                        {t('Product.Only X left', {
                          count: product.countInStock,
                        })}
                      </span>
                    </div>
                  )}

                  {product.countInStock !== 0 ? (
                    <div className='inline-flex items-center gap-1 xs:gap-2 px-2 xs:px-3 py-1 xs:py-2 rounded-full bg-green-100 text-green-800 text-xs xs:text-sm font-semibold'>
                      <div className='w-1.5 xs:w-2 h-1.5 xs:h-2 bg-green-500 rounded-full'></div>
                      {t('Product.In Stock')}
                    </div>
                  ) : (
                    <div className='inline-flex items-center gap-1 xs:gap-2 px-2 xs:px-3 py-1 xs:py-2 rounded-full bg-red-100 text-red-800 text-xs xs:text-sm font-semibold'>
                      <div className='w-1.5 xs:w-2 h-1.5 xs:h-2 bg-red-500 rounded-full'></div>
                      {t('Product.Out of Stock')}
                    </div>
                  )}
                </div>

                {/* Add to Cart */}
                {product.countInStock !== 0 && (
                  <div className='pt-1 xs:pt-2'>
                    <AddToCart
                      item={{
                        clientId: generateId(),
                        product: product._id,
                        countInStock: product.countInStock,
                        name: product.name,
                        slug: product.slug,
                        category: product.category,
                        price: round2(product.price),
                        quantity: 1,
                        image: product.images[0],
                        color: color || product.colors[0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Details */}
            <div className='space-y-3 sm:space-y-6'>
              {/* Description */}
              <div className='bg-muted/30 rounded-lg p-2 xs:p-3 sm:p-4'>
                <h3 className='font-semibold text-base xs:text-lg mb-2 xs:mb-3 text-foreground'>
                  {t('Product.Description')}
                </h3>
                <p className='text-muted-foreground leading-relaxed text-sm xs:text-base'>
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className='bg-muted/30 rounded-lg p-2 xs:p-3 sm:p-4'>
                  <h3 className='font-semibold text-base xs:text-lg mb-2 xs:mb-3 text-foreground'>
                    {t('Product.Specifications')}
                  </h3>
                  <ul className='space-y-1 xs:space-y-2'>
                    {product.specifications.map((spec, index) => (
                      <li
                        key={index}
                        className='flex items-start gap-1 xs:gap-2 text-muted-foreground text-sm xs:text-base'
                      >
                        <div className='w-1 xs:w-1.5 h-1 xs:h-1.5 bg-primary rounded-full mt-1.5 xs:mt-2 flex-shrink-0'></div>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Compatibility */}
              {product.compatibility && product.compatibility.length > 0 && (
                <div className='bg-muted/30 rounded-lg p-2 xs:p-3 sm:p-4'>
                  <h3 className='font-semibold text-base xs:text-lg mb-2 xs:mb-3 text-foreground'>
                    {t('Product.Compatibility')}
                  </h3>
                  <ul className='space-y-1 xs:space-y-2'>
                    {product.compatibility.map((comp, index) => (
                      <li
                        key={index}
                        className='flex items-start gap-1 xs:gap-2 text-muted-foreground text-sm xs:text-base'
                      >
                        <div className='w-1 xs:w-1.5 h-1 xs:h-1.5 bg-primary rounded-full mt-1.5 xs:mt-2 flex-shrink-0'></div>
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Reviews Section */}
      <section className='mt-6 xs:mt-8 sm:mt-12 mb-6 xs:mb-8 sm:mb-12'>
        <div className='bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-3 xs:p-4 sm:p-6 mb-4 xs:mb-6'>
          <h2
            className='text-lg xs:text-xl sm:text-2xl font-bold mb-2 text-center'
            id='reviews'
          >
            {t('Product.Customer Reviews')}
          </h2>
          <div className='w-12 xs:w-16 h-1 bg-primary rounded-full mx-auto'></div>
        </div>
        <ReviewList product={product} userId={session?.user.id} />
      </section>

      {/* Related Products Section */}
      {relatedProducts.data.length > 0 && (
        <section className='mt-6 xs:mt-8 sm:mt-12 mb-6 xs:mb-8 sm:mb-12'>
          <div className='bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-3 xs:p-4 sm:p-6 mb-4 xs:mb-6'>
            <h2 className='text-lg xs:text-xl sm:text-2xl font-bold mb-2 text-center'>
              {t('Product.Best Sellers in', { name: product.category })}
            </h2>
            <div className='w-12 xs:w-16 h-1 bg-primary rounded-full mx-auto'></div>
          </div>
          <ProductSlider products={relatedProducts.data} title='' />
        </section>
      )}

      {/* Browsing History Section */}
      <section className='mt-6 xs:mt-8 sm:mt-12 mb-6 xs:mb-8 sm:mb-12'>
        <div className='bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-3 xs:p-4 sm:p-6 mb-4 xs:mb-6'>
          <h2 className='text-lg xs:text-xl sm:text-2xl font-bold mb-2 text-center'>
            Récemment consultés
          </h2>
          <div className='w-12 xs:w-16 h-1 bg-primary rounded-full mx-auto'></div>
        </div>
        <BrowsingHistoryList />
      </section>
    </div>
  )
}
