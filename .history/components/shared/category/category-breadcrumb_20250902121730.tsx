'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { ICategory } from '@/lib/db/models/category.model'
import { useTranslations } from 'next-intl'

interface CategoryBreadcrumbProps {
  categoryPath: ICategory[]
  className?: string
}

export default function CategoryBreadcrumb({
  categoryPath,
  className = '',
}: CategoryBreadcrumbProps) {
  const t = useTranslations()

  if (!categoryPath || categoryPath.length === 0) {
    return null
  }

  return (
    <nav
      className={`flex items-center space-x-2 text-sm text-muted-foreground ${className}`}
    >
      {/* Home */}
      <Link
        href='/'
        className='flex items-center hover:text-foreground transition-colors'
      >
        <Home className='h-4 w-4' />
        <span className='sr-only'>{t('Common.Home')}</span>
      </Link>

      {/* Separator */}
      <ChevronRight className='h-4 w-4' />

      {/* Categories */}
      {categoryPath.map((category, index) => {
        const isLast = index === categoryPath.length - 1

        return (
          <React.Fragment key={category._id}>
            {isLast ? (
              <span className='text-foreground font-medium'>
                {category.name}
              </span>
            ) : (
              <Link
                href={`/search?category=${category.slug}`}
                className='hover:text-foreground transition-colors'
              >
                {category.name}
              </Link>
            )}

            {!isLast && <ChevronRight className='h-4 w-4' />}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
