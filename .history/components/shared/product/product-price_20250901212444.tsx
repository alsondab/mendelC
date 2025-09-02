'use client'
import useSettingStore from '@/hooks/use-setting-store'
import { cn, round2 } from '@/lib/utils'
import { useFormatter, useTranslations } from 'next-intl'

const ProductPrice = ({
  price,
  className,
  listPrice = 0,
  isDeal = false,
  forListing = true,
  plain = false,
}: {
  price: number
  isDeal?: boolean
  listPrice?: number
  className?: string
  forListing?: boolean
  plain?: boolean
}) => {
  const { getCurrency } = useSettingStore()
  const currency = getCurrency()
  const t = useTranslations()
  const convertedPrice = round2(currency.convertRate * price)
  const convertedListPrice = round2(currency.convertRate * listPrice)

  const format = useFormatter()
  const discountPercent = Math.round(
    100 - (convertedPrice / convertedListPrice) * 100
  )

  // Formatage spécial pour le Franc CFA
  const formatPrice = (price: number) => {
    if (currency.code === 'XOF') {
      return `${Math.round(price).toLocaleString('fr-FR')} ${currency.symbol}`
    }
    return format.number(price, {
      style: 'currency',
      currency: currency.code,
      currencyDisplay: 'narrowSymbol',
    })
  }

  const stringValue = convertedPrice.toString()
  const [intValue, floatValue] = stringValue.includes('.')
    ? stringValue.split('.')
    : [stringValue, '']

  return plain ? (
    formatPrice(convertedPrice)
  ) : convertedListPrice == 0 ? (
    <div className={cn('text-3xl', className)}>
      <span className='text-xs align-super'>{currency.symbol}</span>
      {intValue}
      <span className='text-xs align-super'>{floatValue}</span>
    </div>
  ) : isDeal ? (
    <div className='space-y-3 text-center'>
      <div className='flex flex-col items-center gap-2'>
        <div className='relative'>
          <span className='bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg'>
            {discountPercent}% {t('Product.Off')}
          </span>
          <div className='absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse'></div>
        </div>
        <span className='text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded-md'>
          {t('Product.Limited time deal')}
        </span>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <div className={cn('text-2xl font-bold text-foreground', className)}>
          <span className='text-sm align-super'>{currency.symbol}</span>
          {intValue}
          <span className='text-sm align-super'>{floatValue}</span>
        </div>
        <div className='text-muted-foreground text-sm'>
          {t('Product.Was')}:{' '}
          <span className='line-through font-medium'>
            {formatPrice(convertedListPrice)}
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className='text-center space-y-2'>
      <div className='flex flex-col items-center gap-2'>
        <div className='bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md'>
          -{discountPercent}% {t('Product.Off')}
        </div>
        <div className={cn('text-2xl font-bold text-foreground', className)}>
          <span className='text-sm align-super'>{currency.symbol}</span>
          {intValue}
          <span className='text-sm align-super'>{floatValue}</span>
        </div>
      </div>
      <div className='text-muted-foreground text-sm'>
        {t('Product.List price')}:{' '}
        <span className='line-through font-medium'>
          {formatPrice(convertedListPrice)}
        </span>
      </div>
    </div>
  )
}

export default ProductPrice
