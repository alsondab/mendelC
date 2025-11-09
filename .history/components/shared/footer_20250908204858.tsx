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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
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
                  className="p-2 hover:bg-slate-800 hover:text-orange-500 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Services & Aide */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white border-b border-orange-500 pb-2">
              Services & Aide
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/tarifs-expedition"
                  className="text-slate-400 hover:text-orange-500 text-sm flex items-center space-x-3 transition-colors group"
                >
                  <Truck className="h-4 w-4 group-hover:text-orange-500" />
                  <span>Tarifs et politiques d&apos;expédition</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/retours-remplacements"
                  className="text-slate-400 hover:text-orange-500 text-sm flex items-center space-x-3 transition-colors group"
                >
                  <RotateCcw className="h-4 w-4 group-hover:text-orange-500" />
                  <span>Retours et remplacements</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/questions-frequentes"
                  className="text-slate-400 hover:text-orange-500 text-sm flex items-center space-x-3 transition-colors group"
                >
                  <Info className="h-4 w-4 group-hover:text-orange-500" />
                  <span>Questions fréquentes</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/aide"
                  className="text-slate-400 hover:text-orange-500 text-sm flex items-center space-x-3 transition-colors group"
                >
                  <HelpCircle className="h-4 w-4 group-hover:text-orange-500" />
                  <span>Aide et support</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white border-b border-orange-500 pb-2">
              Nous Contacter
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <Mail className="h-4 w-4 mt-0.5 text-orange-500 group-hover:text-orange-400" />
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <a
                    href="mailto:admin@mendelcorp.com"
                    className="text-white text-sm hover:text-orange-500 transition-colors"
                  >
                    admin@mendelcorp.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <Phone className="h-4 w-4 mt-0.5 text-orange-500 group-hover:text-orange-400" />
                <div>
                  <p className="text-slate-400 text-sm">Téléphone</p>
                  <a
                    href="tel:+22520304050"
                    className="text-white text-sm hover:text-orange-500 transition-colors"
                  >
                    +225 20 30 40 50
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <MapPin className="h-4 w-4 mt-0.5 text-orange-500 group-hover:text-orange-400" />
                <div>
                  <p className="text-slate-400 text-sm">Adresse</p>
                  <p className="text-white text-sm">
                    Cocody, Abidjan
                    <br />
                    Côte d&apos;Ivoire
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white border-b border-orange-500 pb-2">
              Paramètres
            </h4>
            <div className="space-y-4">
              {/* Language Select */}
              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  Langue
                </label>
                <Select
                  value={locale}
                  onValueChange={(value) =>
                    router.push(pathname, { locale: value })
                  }
                >
                  <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white hover:bg-slate-700 transition-colors">
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
              </div>

              {/* Currency Select */}
              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  Devise
                </label>
                <Select
                  value={currency}
                  onValueChange={(value) => setCurrency(value)}
                >
                  <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white hover:bg-slate-700 transition-colors">
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
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} {site.copyright}
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-slate-400 text-sm">
              <Link
                href="/conditions-utilisation"
                className="hover:text-orange-500 transition-colors"
              >
                Conditions d&apos;utilisation
              </Link>
              <Link
                href="/politique-confidentialite"
                className="hover:text-orange-500 transition-colors"
              >
                Politique de confidentialité
              </Link>
            </div>

            <div className="flex items-center space-x-1 text-slate-400 text-sm">
              <span>Fait avec</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>pour nos clients</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
