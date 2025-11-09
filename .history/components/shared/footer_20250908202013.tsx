'use client'
import {
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  Truck,
  RotateCcw,
  Info,
  HelpCircle,
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
    <footer className="bg-slate-900 text-white">
      {/* Back to Top Button */}
      <div className="border-b border-slate-800">
        <Button
          variant="ghost"
          className="w-full rounded-none hover:bg-slate-800/50 transition-colors py-4"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">{t('Footer.Back to top')}</span>
        </Button>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {site.logo ? (
                <Image
                  src={site.logo}
                  alt={`${site.name} logo`}
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              ) : (
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {site.name.charAt(0)}
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold">{site.name}</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Votre destination de confiance pour des produits de qualité. Nous
              offrons la meilleure expérience d&apos;achat.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-slate-800"
                >
                  <Icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Laissez-nous vous aider */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Laissez-nous vous aider</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tarifs-expedition"
                  className="text-slate-400 hover:text-white text-sm flex items-center space-x-2"
                >
                  <Truck className="h-4 w-4" />
                  <span>Tarifs et politiques d&apos;expédition</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/retours-remplacements"
                  className="text-slate-400 hover:text-white text-sm flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Retours et remplacements</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/questions-frequentes"
                  className="text-slate-400 hover:text-white text-sm flex items-center space-x-2"
                >
                  <Info className="h-4 w-4" />
                  <span>Questions fréquentes</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/aide"
                  className="text-slate-400 hover:text-white text-sm flex items-center space-x-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Aide</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Settings */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact & Paramètres</h4>
            <div className="space-y-2 text-slate-400 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>admin@mendelcorp.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+225 20 30 40 50</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Cocody, Abidjan, Côte d&apos;Ivoire</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {/* Language Select */}
              <Select
                value={locale}
                onValueChange={(value) =>
                  router.push(pathname, { locale: value })
                }
              >
                <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder={t('Footer.Select a language')} />
                </SelectTrigger>
                <SelectContent>
                  {locales.map((lang, i) => (
                    <SelectItem key={i} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{lang.icon}</span>
                        <span className="text-sm">{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Currency Select */}
              <Select
                value={currency}
                onValueChange={(value) => setCurrency(value)}
              >
                <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder={t('Footer.Select a currency')} />
                </SelectTrigger>
                <SelectContent>
                  {availableCurrencies.map((c, i) => (
                    <SelectItem key={i} value={c.code}>
                      <span className="text-sm">
                        {c.name} ({c.code})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <p>
            © {new Date().getFullYear()} {site.copyright}
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/conditions-utilisation" className="hover:text-white">
              Conditions d&apos;utilisation
            </Link>
            <Link
              href="/politique-confidentialite"
              className="hover:text-white"
            >
              Avis de confidentialité
            </Link>
          </div>
          <div className="flex items-center space-x-1">
            <span>Fait avec</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>pour nos clients</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
