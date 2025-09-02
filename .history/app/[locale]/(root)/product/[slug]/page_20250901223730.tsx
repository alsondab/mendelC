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
import { Separator } from '@/components/ui/separator'
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
    <div className='p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto'>
      <AddToBrowsingHistory id={product._id} category={product.category} />
      <section className='mb-8'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8'>
          {/* Product Gallery */}
          <div className='lg:col-span-7'>
            <div className='sticky top-4'>
              <ProductGallery images={product.images} />
            </div>
          </div>

          {/* Product Info */}
          <div className='lg:col-span-5 space-y-6'>
            {/* Product Header */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <span className='px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium'>
                  {t('Product.Brand')} {product.brand}
                </span>
                <span className='px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm'>
                  {product.category}
                </span>
              </div>
              
              <h1 className='font-bold text-xl sm:text-2xl lg:text-3xl leading-tight'>
                {product.name}
              </h1>

              <RatingSummary
                avgRating={product.avgRating}
                numReviews={product.numReviews}
                asPopover
                ratingDistribution={product.ratingDistribution}
              />
              
              <div className='flex items-center gap-4'>
                <ProductPrice
                  price={product.price}
                  listPrice={product.listPrice}
                  isDeal={product.tags.includes('todays-deal')}
                  forListing={false}
                />
              </div>
            </div>
            <div>
              <SelectVariant
                product={product}
                color={color || product.colors[0]}
              />
            </div>
            <Separator className='my-2' />
            <div className='flex flex-col gap-2'>
              <p className='p-bold-20 text-grey-600'>
                {t('Product.Description')}:
              </p>
              <p className='p-medium-16 lg:p-regular-18'>
                {product.description}
              </p>
            </div>

            {product.specifications && product.specifications.length > 0 && (
              <>
                <Separator className='my-2' />
                <div className='flex flex-col gap-2'>
                  <p className='p-bold-20 text-grey-600'>
                    {t('Product.Specifications')}:
                  </p>
                  <ul className='list-disc list-inside space-y-1'>
                    {product.specifications.map((spec, index) => (
                      <li
                        key={index}
                        className='p-medium-16 lg:p-regular-18 text-grey-700'
                      >
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {product.compatibility && product.compatibility.length > 0 && (
              <>
                <Separator className='my-2' />
                <div className='flex flex-col gap-2'>
                  <p className='p-bold-20 text-grey-600'>
                    {t('Product.Compatibility')}:
                  </p>
                  <ul className='list-disc list-inside space-y-1'>
                    {product.compatibility.map((comp, index) => (
                      <li
                        key={index}
                        className='p-medium-16 lg:p-regular-18 text-grey-700'
                      >
                        {comp}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
          <div>
            <Card>
              <CardContent className='p-4 flex flex-col  gap-4'>
                <ProductPrice price={product.price} />

                {product.countInStock > 0 && product.countInStock <= 3 && (
                  <div className='text-destructive font-bold'>
                    {t('Product.Only X left in stock - order soon', {
                      count: product.countInStock,
                    })}
                  </div>
                )}
                {product.countInStock !== 0 ? (
                  <div className='text-green-700 text-xl'>
                    {t('Product.In Stock')}
                  </div>
                ) : (
                  <div className='text-destructive text-xl'>
                    {t('Product.Out of Stock')}
                  </div>
                )}

                {product.countInStock !== 0 && (
                  <div className='flex justify-center items-center'>
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
          </div>
        </div>
      </section>
      <section className='mt-10'>
        <h2 className='h2-bold mb-2' id='reviews'>
          {t('Product.Customer Reviews')}
        </h2>
        <ReviewList product={product} userId={session?.user.id} />
      </section>
      <section className='mt-10'>
        <ProductSlider
          products={relatedProducts.data}
          title={t('Product.Best Sellers in', { name: product.category })}
        />
      </section>
      <section>
        <BrowsingHistoryList className='mt-10' />
      </section>
    </div>
  )
}
