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
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle className='flex items-center justify-between'>
                <span>{t('Header.Search Site', { name: siteName })}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsOpen(false)}
                  className='h-6 w-6'
                >
                  <X className='h-4 w-4' />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className='mt-4'>
              <SearchForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
