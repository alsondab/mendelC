'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Grid3X3, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import CategoryTree from './category-tree'
import { ICategory } from '@/lib/db/models/category.model'
import { useTranslations } from 'next-intl'

interface CategoryNavigationProps {
  categories: ICategory[]
  selectedCategory?: string
  onCategorySelect?: (category: ICategory) => void
}

export default function CategoryNavigation({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations()

  const handleCategorySelect = (category: ICategory) => {
    if (onCategorySelect) {
      onCategorySelect(category)
    }
    setIsOpen(false)
  }

  return (
    <Drawer direction='left'>
      <DrawerTrigger asChild>
        <Button
          variant='outline'
          className='flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium border border-border/50'
        >
          <Grid3X3 className='h-4 w-4' />
          <span>{t('Header.Menu')}</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className='w-[320px] sm:w-[400px] h-full'>
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='flex items-center justify-between p-4 border-b border-border/50'>
            <DrawerHeader className='p-0'>
              <DrawerTitle className='text-lg font-semibold text-foreground'>
                {t('Header.Shop By Department')}
              </DrawerTitle>
            </DrawerHeader>
            <DrawerClose asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <ChevronRight className='h-4 w-4' />
              </Button>
            </DrawerClose>
          </div>

          {/* Search */}
          <div className='p-4 border-b border-border/50'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <input
                type='text'
                placeholder={t('Header.Search Categories')}
                className='w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
              />
            </div>
          </div>

          {/* Categories Tree */}
          <div className='flex-1 overflow-y-auto p-4'>
            <CategoryTree
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              showIcons={true}
              maxDepth={2}
            />
          </div>

          {/* Footer */}
          <div className='p-4 border-t border-border/50 bg-muted/30'>
            <Link
              href='/search'
              className='flex items-center justify-center gap-2 w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium'
            >
              <Search className='h-4 w-4' />
              {t('Header.View All Products')}
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
