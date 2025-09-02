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
      <div className='flex items-stretch h-12 rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow'>
        <Select name='category'>
          <SelectTrigger className='w-auto h-full bg-muted/50 border-0 rounded-none border-r border-border/50 focus:ring-0'>
            <SelectValue placeholder={t('Header.All')} />
          </SelectTrigger>
          <SelectContent position='popper' className='border-0 shadow-xl'>
            <SelectItem value='all'>{t('Header.All')}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className='flex-1 border-0 rounded-none bg-background text-foreground text-base h-full focus-visible:ring-0 focus-visible:ring-offset-0'
          placeholder={t('Header.Search Site', { name: siteName })}
          name='q'
          type='search'
        />
        <button
          type='submit'
          className='bg-primary hover:bg-primary/90 text-primary-foreground h-full px-4 py-2 transition-colors flex items-center justify-center'
        >
          <SearchIcon className='w-5 h-5' />
        </button>
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
          <DialogContent className='sm:max-w-lg border-0 shadow-2xl bg-background/95 backdrop-blur-xl'>
            <DialogHeader className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                    <SearchIcon className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <DialogTitle className='text-lg font-semibold text-foreground'>
                      {t('Header.Search Site', { name: siteName })}
                    </DialogTitle>
                    <p className='text-sm text-muted-foreground'>
                      {t('Header.Find exactly what you\'re looking for')}
                    </p>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsOpen(false)}
                  className='h-8 w-8 rounded-full hover:bg-muted/50 transition-colors'
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </DialogHeader>
            <div className='mt-6 space-y-4'>
              <SearchForm />
              <div className='pt-4 border-t border-border/50'>
                <p className='text-xs text-muted-foreground text-center'>
                  Recherchez par catégorie ou saisissez directement votre recherche
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
