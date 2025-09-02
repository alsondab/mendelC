'use client'

import { SearchIcon } from 'lucide-react'
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
  DialogTitle,
} from '../../ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useTranslations } from 'next-intl'
import { ICategory } from '@/types'

interface SearchProps {
  categories: (ICategory & { subCategories: ICategory[] })[]
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
          <DialogContent className='sm:max-w-lg border-0 shadow-none bg-transparent'>
            <VisuallyHidden>
              <DialogTitle>
                {t('Header.Search Site', { name: siteName })}
              </DialogTitle>
            </VisuallyHidden>
            <div className='p-6'>
              <SearchForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
