'use client'
import {
  ChevronUp,
  HelpCircle,
  Truck,
  RotateCcw,
} from 'lucide-react'
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
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 text-sm">
      <div className="w-full">
        {/* Back to Top */}
        <Button
          variant="ghost"
          className="w-full rounded-none border-b border-gray-800 bg-gray-800/40 hover:bg-gray-700/40"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className="mr-2 h-4 w-4" />
          {t('Footer.Back to top')}
        </Button>

        {/* Main Content */}
        <div className="p-6 max-w-7xl mx-auto text-center">
          <h3 className="flex items-center justify-center gap-2 font-semibold text-lg mb-4 text-white">
            <HelpCircle className="w-5 h-5 text-orange-400" />
            Laissez-nous vous aider
          </h3>

          <ul className="space-y-3">
            <li>
              <Link
                href="/page/shipping"
                className="flex items-center justify-center gap-2 hover:text-orange-400 transition-colors"
              >
                <Truck className="w-4 h-4" />
                Tarifs et politiques d’expédition
              </Link>
            </li>
            <li>
              <Link
                href="/page/returns-policy"
                className="flex items-center justify-center gap-2 hover:text-orange-400 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Retours et remplacements
              </Link>
            </li>
            <li>
              <Link
                href="/page/help"
                className="flex items-center justify-center gap-2 hover:text-orange-400 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Aide
              </Link>
            </li>
          </ul>
        </div>

        {/* Langue & Devise */}
        <div className="border-t border-gray-800 bg-gray-900/50">
          <div className="max-w-7xl mx-auto py-6 px-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {site.logo ? (
              <Image
                src={site.logo}
                alt={`${site.name} logo`}
                width={40}
                height={40}
                className="w-12"
              />
            ) : (
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {site.name.charAt(0)}
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Langues */}
              <Select
                value={locale}
                onValueChange={(value) => {
                  router.push(pathname, { locale: value })
                }}
              >
                <SelectTrigger className="min-w-[140px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder={t('Footer.Select a language')} />
                </SelectTrigger>
                <SelectContent>
                  {locales.map((lang, i) => (
                    <SelectItem key={i} value={lang.code}>
                      <span className="text-sm">{lang.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Devises */}
              <Select
                value={currency}
                onValueChange={(value) => {
                  setCurrency(value)
                  window.scrollTo(0, 0)
                }}
              >
                <SelectTrigger className="min-w-[140px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder={t('Footer.Select a currency')} />
                </SelectTrigger>
                <SelectContent>
                  {availableCurrencies.map((cur, i) => (
                    <SelectItem key={i} value={cur.code}>
                      {cur.name} ({cur.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="bg-black/60 border-t border-gray-800">
          <div className="p-4 max-w-7xl mx-auto text-center space-y-3">
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              <Link href="/page/conditions-of-use" className="hover:text-orange-400">
                Conditions d’utilisation
              </Link>
              <span className="hidden sm:inline text-gray-600">•</span>
              <Link href="/page/privacy-policy" className="hover:text-orange-400">
                Confidentialité
              </Link>
              <span className="hidden sm:inline text-gray-600">•</span>
              <Link href="/page/help" className="hover:text-orange-400">
                Aide
              </Link>
            </div>

            <p className="text-xs text-gray-500">© {site.copyright}</p>
            <p className="text-xs text-gray-600">
              {site.address} • {site.phone}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
