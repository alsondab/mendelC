'use client'
import { Button } from '@/components/ui/button'
import {
  CreditCard,
  Currency,
  ImageIcon,
  Info,
  Languages,
  Package,
  SettingsIcon,
} from 'lucide-react'

import { useEffect, useState } from 'react'

const SettingNav = () => {
  const [active, setActive] = useState('')

  useEffect(() => {
    const sections = document.querySelectorAll('div[id^="setting-"]')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { threshold: 0.6, rootMargin: '0px 0px -40% 0px' }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  const handleScroll = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      const top = section.offsetTop - 16 // 20px above the section
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div>
      <h1 className='font-bold text-lg sm:text-xl mb-4'>Paramètres</h1>
      <nav className='flex flex-row lg:flex-col gap-2 lg:fixed mt-4 flex-wrap overflow-x-auto pb-2'>
        {[
          { name: 'Informations du site', hash: 'setting-site-info', icon: <Info className='h-4 w-4' /> },
          {
            name: 'Paramètres généraux',
            hash: 'setting-common',
            icon: <SettingsIcon className='h-4 w-4' />,
          },
          {
            name: 'Carrousels',
            hash: 'setting-carousels',
            icon: <ImageIcon className='h-4 w-4' />,
          },
          { name: 'Langues', hash: 'setting-languages', icon: <Languages className='h-4 w-4' /> },
          {
            name: 'Devises',
            hash: 'setting-currencies',
            icon: <Currency className='h-4 w-4' />,
          },
          {
            name: 'Moyens de paiement',
            hash: 'setting-payment-methods',
            icon: <CreditCard className='h-4 w-4' />,
          },
          {
            name: 'Dates de livraison',
            hash: 'setting-delivery-dates',
            icon: <Package className='h-4 w-4' />,
          },
        ].map((item) => (
          <Button
            onClick={() => handleScroll(item.hash)}
            key={item.hash}
            variant={active === item.hash ? 'outline' : 'ghost'}
            className={`justify-start text-xs sm:text-sm whitespace-nowrap ${
              active === item.hash ? '' : 'border border-transparent'
            }`}
          >
            {item.icon}
            <span className='hidden sm:inline ml-2'>{item.name}</span>
            <span className='sm:hidden ml-1'>{item.name.split(' ')[0]}</span>
          </Button>
        ))}
      </nav>
    </div>
  )
}

export default SettingNav
