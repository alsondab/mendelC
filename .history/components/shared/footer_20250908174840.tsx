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
    <footer className='bg-slate-900 text-white'>
      {/* Back to Top Button */}
      <div className='border-b border-slate-800'>
        <Button
          variant='ghost'
          className='w-full rounded-none hover:bg-slate-800/50 transition-colors py-4'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className='mr-2 h-4 w-4' />
          <span className='text-sm font-medium'>{t('Footer.Back to top')}</span>
        </Button>
      </div>

      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-3'>
              {site.logo && site.logo.trim() !== '' ? (
                <Image
                  src={site.logo}
                  alt={`${site.name} logo`}
                  width={40}
                  height={40}
                  className='w-10 h-10'
                />
              ) : (
                <div className='w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-lg'>
                    {site.name.charAt(0)}
                  </span>
                </div>
              )}
              <h3 className='text-xl font-bold text-white'>{site.name}</h3>
            </div>
            <p className='text-slate-400 text-sm leading-relaxed'>
              Votre destination de confiance pour des produits de qualité. Nous
              nous engageons à offrir la meilleure expérience d&apos;achat.
            </p>
            <div className='flex space-x-4'>
              <Button
                variant='ghost'
                size='sm'
                className='p-2 hover:bg-slate-800'
              >
                <Facebook className='h-5 w-5' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='p-2 hover:bg-slate-800'
              >
                <Twitter className='h-5 w-5' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='p-2 hover:bg-slate-800'
              >
                <Instagram className='h-5 w-5' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='p-2 hover:bg-slate-800'
              >
                <Linkedin className='h-5 w-5' />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold text-white'>Liens rapides</h4>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/'
                  className='text-slate-400 hover:text-white transition-colors text-sm'
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href='/search'
                  className='text-slate-400 hover:text-white transition-colors text-sm'
                >
                  Produits
                </Link>
              </li>
              <li>
                <Link
                  href='/page/about'
                  className='text-slate-400 hover:text-white transition-colors text-sm'
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href='/page/contact'
                  className='text-slate-400 hover:text-white transition-colors text-sm'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold text-white'>Service client</h4>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/page/shipping'
                  className='text-slate-400 hover:text-white transition-colors text-sm'
                >
                  Livraison
                </Link>
              </li>
              <li>
                <Link
                  href='/page/returns-policy'
                  className='text-slate-400 hover:text-white transition-colors text-sm'
                >
                  Retours
                </Link>
              </li>
              <li>
                <Link
                  href='/page/help'
                  className='text-slate-400 hover:text-white transition-colors text-sm'
                >
                  Aide
                </Link>
              </li>
              <li>
                <Link
                  href='/page/faq'
                  className='text-slate-400 hover:text-white transition-colors text-sm'
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Settings */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold text-white'>
              Contact & Paramètres
            </h4>
            <div className='space-y-3'>
              <div className='flex items-center space-x-2 text-slate-400 text-sm'>
                <Mail className='h-4 w-4' />
                <span>{site.email || 'contact@example.com'}</span>
              </div>
              <div className='flex items-center space-x-2 text-slate-400 text-sm'>
                <Phone className='h-4 w-4' />
                <span>{site.phone}</span>
              </div>
              <div className='flex items-center space-x-2 text-slate-400 text-sm'>
                <MapPin className='h-4 w-4' />
                <span>{site.address}</span>
              </div>
            </div>

            <div className='space-y-3 pt-2'>
              <Select
                value={locale}
                onValueChange={(value) => {
                  router.push(pathname, { locale: value })
                }}
              >
                <SelectTrigger className='w-full bg-slate-800 border-slate-700 text-white'>
                  <SelectValue placeholder={t('Footer.Select a language')} />
                </SelectTrigger>
                <SelectContent>
                  {locales.map((lang, index) => (
                    <SelectItem key={index} value={lang.code}>
                      <div className='flex items-center gap-2'>
                        <span className='text-lg'>{lang.icon}</span>
                        <span className='text-sm'>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={currency}
                onValueChange={(value) => {
                  setCurrency(value)
                }}
              >
                <SelectTrigger className='w-full bg-slate-800 border-slate-700 text-white'>
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

      {/* Bottom Footer */}
      <div className='border-t border-slate-800 bg-slate-950'>
        <div className='max-w-7xl mx-auto px-4 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <div className='flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6'>
              <p className='text-slate-400 text-sm'>
                © {new Date().getFullYear()} {site.copyright}
              </p>
              <div className='flex items-center space-x-4 text-xs'>
                <Link
                  href='/page/conditions-of-use'
                  className='text-slate-500 hover:text-white transition-colors'
                >
                  Conditions d&apos;utilisation
                </Link>
                <span className='text-slate-600'>•</span>
                <Link
                  href='/page/privacy-policy'
                  className='text-slate-500 hover:text-white transition-colors'
                >
                  Politique de confidentialité
                </Link>
                <span className='text-slate-600'>•</span>
                <Link
                  href='/page/help'
                  className='text-slate-500 hover:text-white transition-colors'
                >
                  Aide
                </Link>
              </div>
            </div>
            <div className='flex items-center space-x-1 text-slate-500 text-sm'>
              <span>Fait avec</span>
              <Heart className='h-4 w-4 text-red-500' />
              <span>pour nos clients</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
