'use client'
import React from 'react'
import useSettingStore from '@/hooks/use-setting-store'
import { cn, round2 } from '@/lib/utils'
import { useFormatter, useTranslations } from 'next-intl'

const ProductPrice = React.memo(
  ({
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
    const { getCurrency, setting } = useSettingStore()
    const currency = getCurrency()
    const t = useTranslations()

    // Les prix dans la DB sont maintenant en CFA (devise par défaut)
    // Si la devise par défaut est XOF, les prix sont déjà en CFA
    const defaultCurrency = setting.defaultCurrency || 'XOF'
    const isPriceInCFA = defaultCurrency === 'XOF'

    // Trouver le taux de conversion CFA
    const cfaCurrency = setting.availableCurrencies.find(
      (c) => c.code === 'XOF'
    )
    const cfaRate = cfaCurrency?.convertRate || 655.957

    // Convertir les prix selon la devise choisie
    let convertedPrice: number
    let convertedListPrice: number

    if (isPriceInCFA) {
      // Les prix sont en CFA, convertir vers la devise choisie
      if (currency.code === 'XOF') {
        // Afficher directement en CFA
        convertedPrice = price
        convertedListPrice = listPrice
      } else {
        // Convertir CFA → USD/EUR
        // D'abord convertir CFA → USD (diviser par taux CFA)
        const priceInUSD = price / cfaRate
        const listPriceInUSD = listPrice / cfaRate
        // Puis convertir USD → devise choisie
        convertedPrice = round2(priceInUSD * currency.convertRate)
        convertedListPrice = round2(listPriceInUSD * currency.convertRate)
      }
    } else {
      // Ancien comportement : les prix sont en USD
      convertedPrice = round2(currency.convertRate * price)
      convertedListPrice = round2(currency.convertRate * listPrice)
    }

    const format = useFormatter()

    // Calculer le pourcentage de réduction à partir des prix NON arrondis pour éviter les erreurs
    // Cela garantit que le calcul est précis même après arrondi pour l'affichage
    const discountPercent =
      convertedListPrice > 0
        ? Math.round(100 - (convertedPrice / convertedListPrice) * 100)
        : 0

    // Formatage spécial pour le CFA - arrondir les prix pour l'affichage
    const displayListPrice =
      currency.code === 'XOF'
        ? Math.round(convertedListPrice)
        : convertedListPrice

    // Pour le CFA, recalculer le prix réduit à partir du prix original arrondi et du pourcentage arrondi
    // pour garantir la cohérence entre le prix affiché et le pourcentage affiché
    let displayPrice: number
    if (
      currency.code === 'XOF' &&
      convertedListPrice > 0 &&
      discountPercent > 0
    ) {
      // Recalculer le prix réduit à partir du prix original arrondi et du pourcentage arrondi
      // Cela garantit que : prix réduit = prix original × (1 - pourcentage / 100)
      const recalculatedPrice = displayListPrice * (1 - discountPercent / 100)
      displayPrice = Math.round(recalculatedPrice)
    } else {
      displayPrice =
        currency.code === 'XOF' ? Math.round(convertedPrice) : convertedPrice
    }

    // Formatage spécial pour le Franc CFA
    const formatPrice = (price: number) => {
      if (currency.code === 'XOF') {
        return `${Math.round(price).toLocaleString('fr-FR')} CFA`
      }
      return format.number(price, {
        style: 'currency',
        currency: currency.code,
        currencyDisplay: 'narrowSymbol',
      })
    }

    const stringValue = displayPrice.toString()
    const [intValue, floatValue] = stringValue.includes('.')
      ? stringValue.split('.')
      : [stringValue, '']

    return plain ? (
      formatPrice(displayPrice)
    ) : convertedListPrice == 0 ? (
      <div
        className={cn('text-lg xs:text-xl sm:text-2xl lg:text-3xl', className)}
      >
        {currency.code === 'XOF' ? (
          <>
            {intValue}
            <span className="text-xs align-super">{floatValue}</span>
            <span className="text-xs align-super ml-1">CFA</span>
          </>
        ) : (
          <>
            <span className="text-xs align-super">{currency.symbol}</span>
            {intValue}
            <span className="text-xs align-super">{floatValue}</span>
          </>
        )}
      </div>
    ) : isDeal ? (
      <div className="space-y-1 xs:space-y-2 text-center">
        <div className="flex flex-col items-center gap-1 xs:gap-2">
          <span className="text-red-600 text-xs font-semibold bg-red-50 px-1 xs:px-2 py-0.5 xs:py-1 rounded-md">
            {t('Product.Limited time deal')}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 xs:gap-2">
          <div
            className={cn(
              'text-lg xs:text-xl sm:text-2xl font-bold text-foreground',
              className
            )}
          >
            {currency.code === 'XOF' ? (
              <>
                {intValue}
                <span className="text-xs xs:text-sm align-super">
                  {floatValue}
                </span>
                <span className="text-xs xs:text-sm align-super ml-1">CFA</span>
              </>
            ) : (
              <>
                <span className="text-xs xs:text-sm align-super">
                  {currency.symbol}
                </span>
                {intValue}
                <span className="text-xs xs:text-sm align-super">
                  {floatValue}
                </span>
              </>
            )}
          </div>
          <div className="text-muted-foreground text-xs xs:text-sm">
            {t('Product.Was')}:{' '}
            <span className="line-through font-medium">
              {formatPrice(convertedListPrice)}
            </span>
          </div>
        </div>
      </div>
    ) : (
      <div className="">
        <div className="flex justify-center gap-2 xs:gap-3">
          <div className="text-lg xs:text-xl sm:text-2xl lg:text-3xl text-orange-700">
            -{discountPercent}%
          </div>
          <div
            className={cn(
              'text-lg xs:text-xl sm:text-2xl lg:text-3xl',
              className
            )}
          >
            {currency.code === 'XOF' ? (
              <>
                {intValue}
                <span className="text-xs align-super">{floatValue}</span>
                <span className="text-xs align-super ml-1">CFA</span>
              </>
            ) : (
              <>
                <span className="text-xs align-super">{currency.symbol}</span>
                {intValue}
                <span className="text-xs align-super">{floatValue}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-muted-foreground text-xs py-1 xs:py-2">
          {t('Product.List price')}:{' '}
          <span className="line-through">
            {formatPrice(convertedListPrice)}
          </span>
        </div>
      </div>
    )
  }
)

ProductPrice.displayName = 'ProductPrice'

export default ProductPrice
