import useSettingStore from '@/hooks/use-setting-store'
import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'

export default function CheckoutFooter() {
  const {
    setting: { site },
  } = useSettingStore()
  const t = useTranslations('Checkout')

  return (
    <div className="border-t-2 space-y-2 my-4 py-4">
      <p>
        {t('NeedHelp')} {t('CheckOur')}{' '}
        <Link href="/page/help">{t('HelpCenter')}</Link> {t('or')}{' '}
        <Link href="/page/contact-us">{t('ContactUs')}</Link>{' '}
      </p>
      <p>
        {t('ForItemOrderedFrom')} {site.name}: {t('WhenYouClick')} &apos;
        {t('PlaceYourOrder')}&apos; {t('ButtonEmailReceipt')}.{' '}
        {t('ContractNotComplete')}. {t('ByPlacingOrder')} {site.name}&apos;s{' '}
        <Link href="/page/privacy-policy">{t('PrivacyNotice')}</Link> {t('and')}{' '}
        <Link href="/page/conditions-of-use">{t('ConditionsOfUse')}</Link>.
      </p>
      <p>
        {t('ReturnPolicy')}. {t('ExceptionsApply')}.{' '}
        <Link href="/page/returns-policy">
          {t('See')} {site.name}&apos;s {t('ReturnsPolicy')}.
        </Link>
      </p>
    </div>
  )
}
