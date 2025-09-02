'use client'
import useSettingStore from '@/hooks/use-setting-store'
import { cn, round2 } from '@/lib/utils'
import { useFormatter, useTranslations } from 'next-intl'

const ProductPrice = ({
  price,
  className,
  listPrice = 0,
  isDeal = false,

  plain = false,
}: {
  price: number
  isDeal?: boolean
  listPrice?: number
  className?: string

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
    <div className={cn('text-lg xs:text-xl sm:text-2xl lg:text-3xl', className)}>
      <span className='text-xs align-super'>{currency.symbol}</span>
      {intValue}
      <span className='text-xs align-super'>{floatValue}</span>
    </div>
  ) : isDeal ? (
    <div className='space-y-1 xs:space-y-2 text-center'>
      <div className='flex flex-col items-center gap-1 xs:gap-2'>
        <span className='text-red-600 text-xs font-semibold bg-red-50 px-1 xs:px-2 py-0.5 xs:py-1 rounded-md'>
          {t('Product.Limited time deal')}
        </span>
      </div>
      <div className='flex flex-col items-center gap-1 xs:gap-2'>
        <div className={cn('text-lg xs:text-xl sm:text-2xl font-bold text-foreground', className)}>
          <span className='text-xs xs:text-sm align-super'>{currency.symbol}</span>
          {intValue}
          <span className='text-xs xs:text-sm align-super'>{floatValue}</span>
        </div>
        <div className='text-muted-foreground text-xs xs:text-sm'>
          {t('Product.Was')}:{' '}
          <span className='line-through font-medium'>
            {formatPrice(convertedListPrice)}
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className=''>
      <div className='flex justify-center gap-2 xs:gap-3'>
        <div className='text-lg xs:text-xl sm:text-2xl lg:text-3xl text-orange-700'>-{discountPercent}%</div>
        <div className={cn('text-lg xs:text-xl sm:text-2xl lg:text-3xl', className)}>
          <span className='text-xs align-super'>{currency.symbol}</span>
          {intValue}
          <span className='text-xs align-super'>{floatValue}</span>
        </div>
      </div>
      <div className='text-muted-foreground text-xs py-1 xs:py-2'>
        {t('Product.List price')}:{' '}
        <span className='line-through'>{formatPrice(convertedListPrice)}</span>
      </div>
    </div>
  )
}

export default ProductPrice
