import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import AddToCart from '@/components/shared/product/add-to-cart'
import { Card, CardContent } from '@/components/ui/card'
import { getCachedProductBySlugWithStatus } from '@/lib/cache/product-cache'
import { getCachedRelatedProducts } from '@/lib/cache/product-cache'

import ReviewList from './review-list'
import { generateId, round2 } from '@/lib/utils'
import SelectVariant from '@/components/shared/product/select-variant'
import ProductPrice from '@/components/shared/product/product-price'
import ProductGallery from '@/components/shared/product/product-gallery'
import RatingSummary from '@/components/shared/product/rating-summary'
import ProductSlider from '@/components/shared/product/product-slider'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { getSetting } from '@/lib/actions/setting.actions'
import ShareButton from '@/components/shared/product/share-button'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const t = await getTranslations('Product')
  const params = await props.params
  const setting = await getSetting()
  // Éviter le double slash dans l'URL
  const baseUrl = setting.site.url.endsWith('/')
    ? setting.site.url.slice(0, -1)
    : setting.site.url

  const { product, isPublished, exists } =
    await getCachedProductBySlugWithStatus(params.slug)

  if (!exists) {
    return {
      title: t('Product not found'),
      description: t('Product not found description'),
    }
  }

  if (!isPublished) {
    return {
      title: t('Product not available'),
      description: t('Product not available description'),
    }
  }

  const productUrl = `${baseUrl}/product/${params.slug}`
  // Utiliser la première image du produit, ou une image par défaut
  // Éviter les doubles slashes dans l'URL de l'image
  const productImage =
    product!.images && product!.images.length > 0
      ? product!.images[0].startsWith('http')
        ? product!.images[0]
        : product!.images[0].startsWith('/')
          ? `${baseUrl}${product!.images[0]}`
          : `${baseUrl}/${product!.images[0]}`
      : `${baseUrl}/icons/logo.png`

  // Description optimisée pour les réseaux sociaux (max 160 caractères)
  const socialDescription =
    product!.description.length > 160
      ? product!.description.substring(0, 157) + '...'
      : product!.description

  // Construire les keywords en filtrant les valeurs undefined
  const keywords: string[] = []
  if (product!.name) keywords.push(product!.name)
  if (product!.brand) keywords.push(product!.brand)
  if (product!.category) keywords.push(product!.category)
  if (product!.subCategory) keywords.push(product!.subCategory)

  return {
    title: product!.name,
    description: product!.description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title: product!.name,
      description: socialDescription,
      url: productUrl,
      siteName: setting.site.name,
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product!.name,
        },
      ],
      type: 'website',
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: product!.name,
      description: socialDescription,
      images: [productImage],
    },
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
  } = await getCachedProductBySlugWithStatus(slug)

  if (!exists) {
    // Product doesn't exist at all
    notFound()
  }

  if (!isPublished) {
    // Product exists but is not published - show custom error
    const t = await getTranslations('Product')
    throw new Error(t('Product not published error'))
  }

  const product = productData!
  let relatedProducts

  try {
    relatedProducts = await getCachedRelatedProducts({
      category: product.category,
      productId: product._id,
      page: Number(page || '1'),
    })
  } catch {
    // If related products can't be loaded, continue without them
    relatedProducts = { data: [], totalPages: 0 }
  }

  // Récupérer l'URL du site pour le partage (éviter le double slash)
  const setting = await getSetting()
  const baseUrl = setting.site.url.endsWith('/')
    ? setting.site.url.slice(0, -1)
    : setting.site.url
  const shareUrl = `${baseUrl}/product/${slug}`

  const t = await getTranslations()

  return (
    // ✅ Container principal ultra-responsive
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
        {/* ✅ Section principale du produit */}
        <section className="mb-3 xs:mb-4 sm:mb-6 md:mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {/* ✅ Galerie d'images - Totalement responsive */}
            <div className="lg:col-span-7 w-full overflow-hidden">
              <div className="lg:sticky lg:top-4 w-full">
                <div className="w-full max-w-full overflow-hidden rounded-lg">
                  <ProductGallery images={product.images} />
                </div>
              </div>

              {/* ✅ Détails du produit - Déplacés en bas de l'image sur grands écrans */}
              <div className="hidden lg:block w-full space-y-4 mt-6">
                {/* ✅ Description */}
                <div className="w-full bg-muted/30 rounded-lg p-4 overflow-hidden">
                  <h3 className="font-semibold text-lg mb-3 text-foreground break-words">
                    {t('Product.Description')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base break-words hyphens-auto overflow-hidden">
                    {product.description}
                  </p>
                </div>

                {/* ✅ Spécifications */}
                {product.specifications &&
                  product.specifications.length > 0 && (
                    <div className="w-full bg-muted/30 rounded-lg p-4 overflow-hidden">
                      <h3 className="font-semibold text-lg mb-3 text-foreground break-words">
                        {t('Product.Specifications')}
                      </h3>
                      <ul className="space-y-2 w-full overflow-hidden">
                        {product.specifications.map((spec, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-muted-foreground text-base w-full min-w-0 overflow-hidden"
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></div>
                            <span className="break-words hyphens-auto flex-1 min-w-0 overflow-hidden">
                              {spec}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* ✅ Compatibilité */}
                {product.compatibility && product.compatibility.length > 0 && (
                  <div className="w-full bg-muted/30 rounded-lg p-4 overflow-hidden">
                    <h3 className="font-semibold text-lg mb-3 text-foreground break-words">
                      {t('Product.Compatibility')}
                    </h3>
                    <ul className="space-y-2 w-full overflow-hidden">
                      {product.compatibility.map((comp, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-muted-foreground text-base w-full min-w-0 overflow-hidden"
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></div>
                          <span className="break-words hyphens-auto flex-1 min-w-0 overflow-hidden">
                            {comp}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ Informations produit - Ultra-responsive */}
            <div className="lg:col-span-5 w-full min-w-0 space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
              {/* ✅ En-tête du produit */}
              <div className="w-full space-y-1.5 xs:space-y-2 sm:space-y-3 md:space-y-4">
                {/* ✅ Tags Brand et Category */}
                <div className="flex flex-wrap items-center gap-1 xs:gap-1.5 sm:gap-2 w-full overflow-hidden">
                  <span className="inline-flex items-center px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1 rounded-full bg-primary/10 text-primary text-[10px] xs:text-xs sm:text-xs font-medium shrink-0 max-w-full truncate">
                    <span className="truncate">
                      {t('Product.Brand')} {product.brand}
                    </span>
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1 rounded-full bg-muted text-muted-foreground text-[10px] xs:text-xs sm:text-xs shrink-0 max-w-full truncate">
                    <span className="truncate">{product.category}</span>
                  </span>
                </div>

                {/* ✅ Titre du produit - Très responsive */}
                <div className="w-full overflow-hidden">
                  <h1 className="font-bold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-tight break-words hyphens-auto w-full">
                    {product.name}
                  </h1>
                </div>

                {/* ✅ Rating Summary */}
                <div className="w-full overflow-hidden">
                  <RatingSummary
                    avgRating={product.avgRating}
                    numReviews={product.numReviews}
                    asPopover
                    ratingDistribution={product.ratingDistribution}
                  />
                </div>

                {/* ✅ Bouton de partage - Responsive et bien positionné */}
                <div className="w-full overflow-hidden">
                  <div className="flex items-center justify-start gap-2">
                    <ShareButton
                      url={shareUrl}
                      title={product.name}
                      description={product.description}
                      size="md"
                      showText={true}
                      className="sm:flex"
                    />
                  </div>
                </div>
              </div>

              {/* ✅ Section Variants - Très compact sur mobile */}
              <div className="w-full bg-muted/30 rounded-lg p-1.5 xs:p-2 sm:p-3 md:p-4 overflow-hidden">
                <div className="w-full min-w-0 overflow-hidden">
                  <SelectVariant
                    product={product}
                    color={color || product.colors[0]}
                  />
                </div>
              </div>

              {/* ✅ Section Panier - Ultra-optimisée mobile */}
              <Card className="w-full border-2 border-primary/20 shadow-lg overflow-hidden">
                <CardContent className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 space-y-2 xs:space-y-3 sm:space-y-4 w-full overflow-hidden">
                  {/* ✅ Prix dans le panier */}
                  <div className="text-center w-full overflow-hidden">
                    <div className="inline-block min-w-0 max-w-full overflow-hidden">
                      <ProductPrice
                        price={product.price}
                        listPrice={product.listPrice}
                      />
                    </div>
                  </div>

                  {/* ✅ Statut du stock - Ultra-responsive */}
                  <div className="text-center w-full overflow-hidden">
                    {product.countInStock > 0 && product.countInStock <= 3 && (
                      <div className="inline-flex items-center gap-1 xs:gap-1.5 px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1.5 rounded-full bg-orange-100 text-orange-800 text-[10px] xs:text-xs font-semibold mb-1.5 xs:mb-2 max-w-full overflow-hidden">
                        <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 bg-orange-500 rounded-full animate-pulse shrink-0"></div>
                        <span className="hidden sm:inline truncate flex-1 min-w-0">
                          {t('Product.Only X left in stock - order soon', {
                            count: product.countInStock,
                          })}
                        </span>
                        <span className="sm:hidden truncate flex-1 min-w-0">
                          {t('Product.Only X left', {
                            count: product.countInStock,
                          })}
                        </span>
                      </div>
                    )}

                    {product.countInStock > 3 ? (
                      <div className="inline-flex items-center gap-1 xs:gap-1.5 px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1.5 rounded-full bg-green-100 text-green-800 text-[10px] xs:text-xs font-semibold max-w-full overflow-hidden">
                        <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 bg-green-500 rounded-full shrink-0"></div>
                        <span className="truncate flex-1 min-w-0">
                          {t('Product.In Stock')}
                        </span>
                      </div>
                    ) : product.countInStock === 0 ? (
                      <div className="inline-flex items-center gap-1 xs:gap-1.5 px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1.5 rounded-full bg-red-100 text-red-800 text-[10px] xs:text-xs font-semibold max-w-full overflow-hidden">
                        <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 bg-red-500 rounded-full shrink-0"></div>
                        <span className="truncate flex-1 min-w-0">
                          {t('Product.Out of Stock')}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* ✅ Bouton Ajouter au panier - Largeur contrôlée */}
                  {product.countInStock !== 0 && (
                    <div className="pt-0.5 xs:pt-1 w-full">
                      <div className="w-full max-w-full overflow-hidden">
                        <AddToCart
                          item={{
                            clientId: generateId(),
                            product: product._id,
                            countInStock: product.countInStock,
                            name: product.name,
                            slug: product.slug,
                            category: product.category,
                            price: (() => {
                              // Recalculer le prix réduit de la même manière que ProductPrice
                              // pour garantir la cohérence entre le prix affiché et le prix stocké
                              const listPriceRounded = Math.round(product.listPrice)
                              const priceRounded = Math.round(product.price)
                              if (product.listPrice > 0 && product.listPrice > product.price) {
                                const discountPercent = Math.round(
                                  100 - (priceRounded / listPriceRounded) * 100
                                )
                                if (discountPercent > 0) {
                                  // Recalculer : prix réduit = prix original × (1 - pourcentage / 100)
                                  return Math.round(
                                    listPriceRounded * (1 - discountPercent / 100)
                                  )
                                }
                              }
                              return priceRounded
                            })(),
                            listPrice: Math.round(product.listPrice),
                            quantity: 1,
                            image: product.images[0],
                            color: color || product.colors[0],
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ✅ Détails du produit - Ultra-responsive - Masqués sur grands écrans */}
              <div className="lg:hidden w-full space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-5 overflow-hidden">
                {/* ✅ Description */}
                <div className="w-full bg-muted/30 rounded-lg p-1.5 xs:p-2 sm:p-3 md:p-4 overflow-hidden">
                  <h3 className="font-semibold text-xs xs:text-sm sm:text-base md:text-lg mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 text-foreground break-words">
                    {t('Product.Description')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-[10px] xs:text-xs sm:text-sm md:text-base break-words hyphens-auto overflow-hidden">
                    {product.description}
                  </p>
                </div>

                {/* ✅ Spécifications */}
                {product.specifications &&
                  product.specifications.length > 0 && (
                    <div className="w-full bg-muted/30 rounded-lg p-1.5 xs:p-2 sm:p-3 md:p-4 overflow-hidden">
                      <h3 className="font-semibold text-xs xs:text-sm sm:text-base md:text-lg mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 text-foreground break-words">
                        {t('Product.Specifications')}
                      </h3>
                      <ul className="space-y-0.5 xs:space-y-1 sm:space-y-1.5 md:space-y-2 w-full overflow-hidden">
                        {product.specifications.map((spec, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-1 xs:gap-1.5 sm:gap-2 text-muted-foreground text-[10px] xs:text-xs sm:text-sm md:text-base w-full min-w-0 overflow-hidden"
                          >
                            <div className="w-0.5 h-0.5 xs:w-1 xs:h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full mt-1 xs:mt-1.5 sm:mt-2 shrink-0"></div>
                            <span className="break-words hyphens-auto flex-1 min-w-0 overflow-hidden">
                              {spec}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* ✅ Compatibilité */}
                {product.compatibility && product.compatibility.length > 0 && (
                  <div className="w-full bg-muted/30 rounded-lg p-1.5 xs:p-2 sm:p-3 md:p-4 overflow-hidden">
                    <h3 className="font-semibold text-xs xs:text-sm sm:text-base md:text-lg mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 text-foreground break-words">
                      {t('Product.Compatibility')}
                    </h3>
                    <ul className="space-y-0.5 xs:space-y-1 sm:space-y-1.5 md:space-y-2 w-full overflow-hidden">
                      {product.compatibility.map((comp, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-1 xs:gap-1.5 sm:gap-2 text-muted-foreground text-[10px] xs:text-xs sm:text-sm md:text-base w-full min-w-0 overflow-hidden"
                        >
                          <div className="w-0.5 h-0.5 xs:w-1 xs:h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full mt-1 xs:mt-1.5 sm:mt-2 shrink-0"></div>
                          <span className="break-words hyphens-auto flex-1 min-w-0 overflow-hidden">
                            {comp}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Section Avis clients - Ultra-responsive */}
        <section className="mt-3 xs:mt-4 sm:mt-6 md:mt-8 lg:mt-12 mb-3 xs:mb-4 sm:mb-6 md:mb-8 lg:mb-12 w-full overflow-hidden">
          <div className="w-full bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6 overflow-hidden">
            <h2
              className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 xs:mb-1.5 sm:mb-2 text-center break-words hyphens-auto"
              id="reviews"
            >
              {t('Product.Customer Reviews')}
            </h2>
            <div className="w-6 xs:w-8 sm:w-10 md:w-12 lg:w-16 h-0.5 xs:h-1 bg-primary rounded-full mx-auto"></div>
          </div>
          <div className="w-full overflow-hidden">
            <ReviewList product={product} userId={session?.user.id} />
          </div>
        </section>

        {/* ✅ Produits similaires - Ultra-responsive */}
        {relatedProducts.data.length > 0 && (
          <section className="mt-3 xs:mt-4 sm:mt-6 md:mt-8 lg:mt-12 mb-3 xs:mb-4 sm:mb-6 md:mb-8 lg:mb-12 w-full overflow-hidden">
            <div className="w-full bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6 overflow-hidden">
              <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 xs:mb-1.5 sm:mb-2 text-center break-words hyphens-auto">
                {t('Product.Best Sellers in', { name: product.category })}
              </h2>
              <div className="w-6 xs:w-8 sm:w-10 md:w-12 lg:w-16 h-0.5 xs:h-1 bg-primary rounded-full mx-auto"></div>
            </div>
            <div className="w-full overflow-hidden">
              <ProductSlider products={relatedProducts.data} title="" />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
