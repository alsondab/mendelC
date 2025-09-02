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
    <form action='/search' method='GET' className='flex items-stretch h-10'>
      <Select name='category'>
        <SelectTrigger className='w-auto h-full dark:border-gray-200 bg-gray-100 text-black border-r rounded-r-none rounded-l-md rtl:rounded-r-md rtl:rounded-l-none'>
          <SelectValue placeholder={t('Header.All')} />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectItem value='all'>{t('Header.All')}</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className='flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black text-base h-full'
        placeholder={t('Header.Search Site', { name: siteName })}
        name='q'
        type='search'
      />
      <button
        type='submit'
        className='bg-primary text-primary-foreground text-black rounded-s-none rounded-e-md h-full px-3 py-2'
      >
        <SearchIcon className='w-6 h-6' />
      </button>
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
                      Trouvez exactement ce que vous cherchez
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
