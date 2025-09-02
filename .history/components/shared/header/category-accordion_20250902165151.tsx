'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { ICategory } from '@/types'

interface CategoryAccordionProps {
  categories: (ICategory & { subCategories: ICategory[] })[]
}

export default function CategoryAccordion({ categories }: CategoryAccordionProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  return (
    <nav className='flex flex-col'>
      {categories.map((category) => {
        const isOpen = openCategories.has(category._id)
        const hasSubCategories = category.subCategories && category.subCategories.length > 0

        return (
          <div
            key={category._id}
            className='border-b border-border/20 last:border-b-0'
          >
            {/* Main Category */}
            <div className='flex items-center'>
              {/* Category Link */}
              <Link
                href={`/search?category=${category.name}`}
                className='flex-1 flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors'
              >
                <span className='text-sm text-foreground font-medium'>
                  {category.name}
                </span>
                {hasSubCategories && (
                  <ChevronRight className='h-3 w-3 text-muted-foreground' />
                )}
              </Link>

              {/* Toggle Button for Subcategories */}
              {hasSubCategories && (
                <button
                  onClick={() => toggleCategory(category._id)}
                  className='px-2 py-2 hover:bg-muted/30 transition-colors flex items-center justify-center'
                  aria-label={isOpen ? 'Fermer les sous-catégories' : 'Ouvrir les sous-catégories'}
                >
                  {isOpen ? (
                    <ChevronDown className='h-3 w-3 text-muted-foreground' />
                  ) : (
                    <ChevronRight className='h-3 w-3 text-muted-foreground' />
                  )}
                </button>
              )}
            </div>

            {/* Subcategories with Animation */}
            {hasSubCategories && (
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className='ml-4 border-l border-border/20'>
                  {category.subCategories.map((subCategory) => (
                    <Link
                      key={subCategory._id}
                      href={`/search?category=${category.name}&subCategory=${subCategory.name}`}
                      className='flex items-center justify-between px-3 py-2 hover:bg-muted/30 transition-colors text-xs text-muted-foreground hover:text-foreground'
                    >
                      <span className='text-xs text-muted-foreground hover:text-foreground'>
                        {subCategory.name}
                      </span>
                      <ChevronRight className='h-2 w-2 text-muted-foreground' />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
