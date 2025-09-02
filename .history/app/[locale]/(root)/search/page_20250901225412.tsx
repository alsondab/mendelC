import Link from 'next/link'

import Pagination from '@/components/shared/pagination'
import ProductCard from '@/components/shared/product/product-card'
import { Button } from '@/components/ui/button'
import {
  getAllCategories,
  getAllProducts,
  getAllTags,
} from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'
import ProductSortSelector from '@/components/shared/product/product-sort-selector'
import { getFilterUrl, toSlug } from '@/lib/utils'
import Rating from '@/components/shared/product/rating'

import CollapsibleOnMobile from '@/components/shared/collapsible-on-mobile'
import { getTranslations } from 'next-intl/server'

const sortOrders = [
  { value: 'price-low-to-high', name: 'Price: Low to high' },
  { value: 'price-high-to-low', name: 'Price: High to low' },
  { value: 'newest-arrivals', name: 'Newest arrivals' },
  { value: 'avg-customer-review', name: 'Avg. customer review' },
  { value: 'best-selling', name: 'Best selling' },
]

const prices = [
  {
    name: '$1 to $20',
    value: '1-20',
  },
  {
    name: '$21 to $50',
    value: '21-50',
  },
  {
    name: '$51 to $1000',
    value: '51-1000',
  },
]

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string
    category: string
    tag: string
    price: string
    rating: string
    sort: string
    page: string
  }>
}) {
  const searchParams = await props.searchParams
  const t = await getTranslations()
  const {
    q = 'all',
    category = 'all',
    tag = 'all',
    price = 'all',
    rating = 'all',
  } = searchParams

  if (
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    tag !== 'all' ||
    rating !== 'all' ||
    price !== 'all'
  ) {
    return {
      title: `${t('Search.Search')} ${q !== 'all' ? q : ''}
          ${category !== 'all' ? ` : ${t('Search.Category')} ${category}` : ''}
          ${tag !== 'all' ? ` : ${t('Search.Tag')} ${tag}` : ''}
          ${price !== 'all' ? ` : ${t('Search.Price')} ${price}` : ''}
          ${rating !== 'all' ? ` : ${t('Search.Rating')} ${rating}` : ''}`,
    }
  } else {
    return {
      title: t('Search.Search Products'),
    }
  }
}

export default async function SearchPage(props: {
  searchParams: Promise<{
    q: string
    category: string
    tag: string
    price: string
    rating: string
    sort: string
    page: string
  }>
}) {
  const searchParams = await props.searchParams

  const {
    q = 'all',
    category = 'all',
    tag = 'all',
    price = 'all',
    rating = 'all',
    sort = 'best-selling',
    page = '1',
  } = searchParams

  const params = { q, category, tag, price, rating, sort, page }

  const categories = await getAllCategories()
  const tags = await getAllTags()
  const data = await getAllProducts({
    category,
    tag,
    query: q,
    price,
    rating,
    page: Number(page),
    sort,
  })
  const t = await getTranslations()
  return (
    <div className='p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto'>
      {/* Search Header */}
      <div className='bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 sm:p-6 mb-6'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm sm:text-base'>
            <div className='flex items-center gap-2'>
              <span className='font-semibold text-foreground'>
                {data.totalProducts === 0
                  ? t('Search.No')
                  : `${data.from}-${data.to} ${t('Search.of')} ${data.totalProducts}`}
              </span>
              <span className='text-muted-foreground'>{t('Search.results')}</span>
            </div>
            
            {/* Active Filters */}
            {(q !== 'all' && q !== '') ||
            (category !== 'all' && category !== '') ||
            (tag !== 'all' && tag !== '') ||
            rating !== 'all' ||
            price !== 'all' ? (
              <div className='flex flex-wrap items-center gap-2 text-xs sm:text-sm'>
                <span className='text-muted-foreground'>{t('Search.for')}</span>
                {q !== 'all' && q !== '' && (
                  <span className='px-2 py-1 bg-primary/10 text-primary rounded-full font-medium'>
                    "{q}"
                  </span>
                )}
                {category !== 'all' && category !== '' && (
                  <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium'>
                    {t('Search.Category')}: {category}
                  </span>
                )}
                {tag !== 'all' && tag !== '' && (
                  <span className='px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium'>
                    {t('Search.Tag')}: {tag}
                  </span>
                )}
                {price !== 'all' && (
                  <span className='px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium'>
                    {t('Search.Price')}: {price}
                  </span>
                )}
                {rating !== 'all' && (
                  <span className='px-2 py-1 bg-orange-100 text-orange-800 rounded-full font-medium'>
                    {t('Search.Rating')}: {rating} & {t('Search.up')}
                  </span>
                )}
              </div>
            ) : null}
          </div>
          
          <div className='flex items-center gap-3 w-full sm:w-auto'>
            {(q !== 'all' && q !== '') ||
            (category !== 'all' && category !== '') ||
            (tag !== 'all' && tag !== '') ||
            rating !== 'all' ||
            price !== 'all' ? (
              <Button variant='outline' size='sm' asChild className='text-xs sm:text-sm'>
                <Link href='/search'>{t('Search.Clear')}</Link>
              </Button>
            ) : null}
            <ProductSortSelector
              sortOrders={sortOrders}
              sort={sort}
              params={params}
            />
          </div>
        </div>
      </div>
      <div className='bg-card grid md:grid-cols-5 md:gap-4'>
        <CollapsibleOnMobile title={t('Search.Filters')}>
          <div className='space-y-4'>
            <div>
              <div className='font-bold'>{t('Search.Department')}</div>
              <ul>
                <li>
                  <Link
                    className={`${
                      ('all' === category || '' === category) && 'text-primary'
                    }`}
                    href={getFilterUrl({ category: 'all', params })}
                  >
                    {t('Search.All')}
                  </Link>
                </li>
                {categories.map((c: string) => (
                  <li key={c}>
                    <Link
                      className={`${c === category && 'text-primary'}`}
                      href={getFilterUrl({ category: c, params })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className='font-bold'>{t('Search.Price')}</div>
              <ul>
                <li>
                  <Link
                    className={`${'all' === price && 'text-primary'}`}
                    href={getFilterUrl({ price: 'all', params })}
                  >
                    {t('Search.All')}
                  </Link>
                </li>
                {prices.map((p) => (
                  <li key={p.value}>
                    <Link
                      href={getFilterUrl({ price: p.value, params })}
                      className={`${p.value === price && 'text-primary'}`}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className='font-bold'>{t('Search.Customer Review')}</div>
              <ul>
                <li>
                  <Link
                    href={getFilterUrl({ rating: 'all', params })}
                    className={`${'all' === rating && 'text-primary'}`}
                  >
                    {t('Search.All')}
                  </Link>
                </li>

                <li>
                  <Link
                    href={getFilterUrl({ rating: '4', params })}
                    className={`${'4' === rating && 'text-primary'}`}
                  >
                    <div className='flex'>
                      <Rating size={4} rating={4} /> {t('Search.& Up')}
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className='font-bold'>{t('Search.Tag')}</div>
              <ul>
                <li>
                  <Link
                    className={`${
                      ('all' === tag || '' === tag) && 'text-primary'
                    }`}
                    href={getFilterUrl({ tag: 'all', params })}
                  >
                    {t('Search.All')}
                  </Link>
                </li>
                {tags.map((t: string) => (
                  <li key={t}>
                    <Link
                      className={`${toSlug(t) === tag && 'text-primary'}`}
                      href={getFilterUrl({ tag: t, params })}
                    >
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleOnMobile>

        <div className='md:col-span-4 space-y-4'>
          <div>
            <div className='font-bold text-xl'>{t('Search.Results')}</div>
            <div>
              {t('Search.Check each product page for other buying options')}
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2  lg:grid-cols-3  '>
            {data.products.length === 0 && (
              <div>{t('Search.No product found')}</div>
            )}
            {data.products.map((product: IProduct) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {data.totalPages > 1 && (
            <Pagination page={page} totalPages={data.totalPages} />
          )}
        </div>
      </div>
    </div>
  )
}
