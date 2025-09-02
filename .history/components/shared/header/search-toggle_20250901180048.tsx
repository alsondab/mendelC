'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import SearchComponent from './search'

export default function SearchToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations()

  return (
    <>
      {/* Search Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium border border-border/50',
          isOpen && 'bg-muted/80'
        )}
      >
        <Search className='h-4 w-4' />
        <span>{t('Header.Search')}</span>
      </Button>

      {/* Search Bar - Mobile Toggle */}
      {isOpen && (
        <div className='absolute top-full left-0 right-0 bg-background border-b border-border/40 shadow-lg z-40'>
          <div className='container mx-auto px-4 py-3'>
            <div className='flex items-center space-x-2'>
              <div className='flex-1'>
                <SearchComponent />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className='h-8 w-8 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
