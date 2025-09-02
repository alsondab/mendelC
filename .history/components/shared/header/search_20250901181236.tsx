'use client'

import { SearchIcon, X } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { useTranslations } from 'next-intl'

interface SearchProps {
  categories: string[]
  siteName: string
}

export default function Search({ categories, siteName }: SearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations()

  const SearchForm = () => (
    <form action='/search' method='GET' className='space-y-4'>
      <div className='relative'>
        <div className='flex items-stretch h-14 rounded-2xl overflow-hidden bg-background/60 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 ring-1 ring-white/10'>
          <Select name='category'>
            <SelectTrigger className='w-auto h-full bg-gradient-to-br from-muted/40 to-muted/20 border-0 rounded-none border-r border-white/20 focus:ring-0 backdrop-blur-sm'>
              <SelectValue placeholder={t('Header.All')} />
            </SelectTrigger>
            <SelectContent
              position='popper'
              className='border-0 shadow-2xl bg-background/95 backdrop-blur-xl ring-1 ring-white/20'
            >
              <SelectItem value='all'>{t('Header.All')}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className='flex-1 border-0 rounded-none bg-transparent text-foreground text-base h-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60'
            placeholder={t('Header.Search Site', { name: siteName })}
            name='q'
            type='search'
          />
          <button
            type='submit'
            className='bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground h-full px-6 py-2 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl'
          >
            <SearchIcon className='w-5 h-5' />
          </button>
        </div>
        {/* Glow effect */}
        <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
      </div>
    </form>
  )

  return (
    <>
      {/* Desktop Search */}
      <div className='hidden lg:block'>
        <SearchForm />
      </div>

      {/* Mobile Search Button */}
      <div className='lg:hidden'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => setIsOpen(true)}
          className='w-10 h-10 rounded-lg border border-border/50'
        >
          <SearchIcon className='h-4 w-4' />
        </Button>

        {/* Mobile Search Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className='sm:max-w-lg border-0 shadow-2xl bg-background/80 backdrop-blur-2xl ring-1 ring-white/20'>
            <DialogHeader className='space-y-4'>
              <div className='flex items-center space-x-4'>
                <div className='relative'>
                  <div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center backdrop-blur-sm ring-1 ring-primary/20'>
                    <SearchIcon className='h-6 w-6 text-primary' />
                  </div>
                  <div className='absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-primary to-primary/80 animate-pulse'></div>
                </div>
                <div className='flex-1'>
                  <DialogTitle className='text-xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text'>
                    {t('Header.Search Site', { name: siteName })}
                  </DialogTitle>
                  <p className='text-sm text-muted-foreground/80 mt-1'>
                    {t("Header.Find exactly what you're looking for")}
                  </p>
                </div>
              </div>
            </DialogHeader>
            <div className='mt-8 space-y-6'>
              <SearchForm />
              <div className='pt-6 border-t border-gradient-to-r from-transparent via-border/50 to-transparent'>
                <div className='flex items-center justify-center space-x-2'>
                  <div className='w-2 h-2 rounded-full bg-primary/60 animate-pulse'></div>
                  <div className='w-2 h-2 rounded-full bg-primary/40 animate-pulse delay-100'></div>
                  <div className='w-2 h-2 rounded-full bg-primary/60 animate-pulse delay-200'></div>
                </div>
                <p className='text-xs text-muted-foreground/70 text-center mt-3'>
                  {t('Header.Search by category or type directly')}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
