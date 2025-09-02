'use client'
import { ChevronUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import useSettingStore from '@/hooks/use-setting-store'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'

import { SelectValue } from '@radix-ui/react-select'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { i18n } from '@/i18n-config'

export default function Footer() {
  const router = useRouter()
  const pathname = usePathname()
  const {
    setting: { site, availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()
  const { locales } = i18n

  const locale = useLocale()
  const t = useTranslations()
  return (
    <footer className='bg-gradient-to-b from-gray-900 to-black text-white'>
      <div className='w-full'>
        {/* Back to Top Button */}
        <Button
          variant='ghost'
          className='bg-gray-800/50 hover:bg-gray-700/50 w-full rounded-none border-b border-gray-700/50'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className='mr-2 h-4 w-4' />
          <span className='text-sm xs:text-base'>
            {t('Footer.Back to top')}
          </span>
        </Button>

        {/* Main Footer Content */}
        <div className='p-3 xs:p-4 sm:p-6 max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6'>
            {/* Get to Know Us */}
            <div className='space-y-3'>
              <h3 className='font-bold text-base xs:text-lg mb-3 text-white'>
                {t('Footer.Get to Know Us')}
              </h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='/page/careers'
                    className='text-gray-300 hover:text-white transition-colors text-sm xs:text-base'
                  >
                    {t('Footer.Careers')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/page/blog'
                    className='text-gray-300 hover:text-white transition-colors text-sm xs:text-base'
                  >
                    {t('Footer.Blog')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/page/about-us'
                    className='text-gray-300 hover:text-white transition-colors text-sm xs:text-base'
                  >
                    {t('Footer.About name', { name: site.name })}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Make Money with Us */}
            <div className='space-y-3'>
              <h3 className='font-bold text-base xs:text-lg mb-3 text-white'>
                {t('Footer.Make Money with Us')}
              </h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='/page/sell'
                    className='text-gray-300 hover:text-white transition-colors text-sm xs:text-base'
                  >
                    {t('Footer.Sell products on', { name: site.name })}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/page/become-affiliate'
                    className='text-gray-300 hover:text-white transition-colors text-sm xs:text-base'
                  >
                    {t('Footer.Become an Affiliate')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/page/advertise'
                    className='text-gray-300 hover:text-white transition-colors text-sm xs:text-base'
                  >
                    {t('Footer.Advertise Your Products')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Let Us Help You */}
            <div className='space-y-3 sm:col-span-2 lg:col-span-1'>
              <h3 className='font-bold text-base xs:text-lg mb-3 text-white'>
                {t('Footer.Let Us Help You')}
              </h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='/page/shipping'
                    className='text-gray-300 hover:text-white transition-colors text-sm xs:text-base'
                  >
                    {t('Footer.Shipping Rates & Policies')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/page/returns-policy'
                    className='text-gray-300 hover:text-white transition-colors text-sm xs:text-base'
                  >
                    {t('Footer.Returns & Replacements')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/page/help'
                    className='text-gray-300 hover:text-white transition-colors text-sm xs:text-base'
                  >
                    {t('Footer.Help')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Language & Currency Section */}
        <div className='border-t border-gray-700/50 bg-gray-800/30'>
          <div className='max-w-7xl mx-auto py-4 xs:py-6 sm:py-8 px-3 xs:px-4'>
            <div className='flex flex-col xs:flex-row items-center justify-center gap-3 xs:gap-4 sm:gap-6'>
              <Image
                src='/icons/logo.png'
                alt={`${site.name} logo`}
                width={40}
                height={40}
                className='w-10 xs:w-12 sm:w-14'
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />

              <div className='flex flex-col xs:flex-row items-center gap-2 xs:gap-4'>
                <Select
                  value={locale}
                  onValueChange={(value) => {
                    router.push(pathname, { locale: value })
                  }}
                >
                  <SelectTrigger className='w-full xs:w-auto min-w-[140px] bg-gray-700/50 border-gray-600 text-white'>
                    <SelectValue placeholder={t('Footer.Select a language')} />
                  </SelectTrigger>
                  <SelectContent>
                    {locales.map((lang, index) => (
                      <SelectItem key={index} value={lang.code}>
                        <Link
                          className='w-full flex items-center gap-2'
                          href={pathname}
                          locale={lang.code}
                        >
                          <span className='text-lg'>{lang.icon}</span>
                          <span className='text-sm'>{lang.name}</span>
                        </Link>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={currency}
                  onValueChange={(value) => {
                    setCurrency(value)
                    window.scrollTo(0, 0)
                  }}
                >
                  <SelectTrigger className='w-full xs:w-auto min-w-[140px] bg-gray-700/50 border-gray-600 text-white'>
                    <SelectValue placeholder={t('Footer.Select a currency')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies
                      .filter((x) => x.code)
                      .map((currency, index) => (
                        <SelectItem key={index} value={currency.code}>
                          <span className='text-sm'>
                            {currency.name} ({currency.code})
                          </span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className='bg-black/50 border-t border-gray-700/50'>
        <div className='p-3 xs:p-4 max-w-7xl mx-auto'>
          {/* Legal Links */}
          <div className='flex flex-wrap justify-center gap-2 xs:gap-3 text-xs xs:text-sm mb-3 xs:mb-4'>
            <Link
              href='/page/conditions-of-use'
              className='text-gray-400 hover:text-white transition-colors'
            >
              {t('Footer.Conditions of Use')}
            </Link>
            <span className='text-gray-600 hidden xs:inline'>•</span>
            <Link
              href='/page/privacy-policy'
              className='text-gray-400 hover:text-white transition-colors'
            >
              {t('Footer.Privacy Notice')}
            </Link>
            <span className='text-gray-600 hidden xs:inline'>•</span>
            <Link
              href='/page/help'
              className='text-gray-400 hover:text-white transition-colors'
            >
              {t('Footer.Help')}
            </Link>
          </div>

          {/* Copyright */}
          <div className='flex justify-center text-xs xs:text-sm text-gray-400 mb-2 xs:mb-3'>
            <p>© {site.copyright}</p>
          </div>

          {/* Contact Info */}
          <div className='flex flex-col xs:flex-row justify-center items-center gap-1 xs:gap-2 text-xs xs:text-sm text-gray-500'>
            <span className='text-center xs:text-left'>{site.address}</span>
            <span className='hidden xs:inline text-gray-600'>|</span>
            <span className='text-center xs:text-left'>{site.phone}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
