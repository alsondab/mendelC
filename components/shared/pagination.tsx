'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { formUrlQuery } from '@/lib/utils'

import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

type PaginationProps = {
  page: number | string
  totalPages: number
  urlParamName?: string
  onPageChange?: (page: number) => void
}

const Pagination = ({
  page,
  totalPages,
  urlParamName,
  onPageChange,
}: PaginationProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1

    if (onPageChange) {
      onPageChange(pageValue)
    } else {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: urlParamName || 'page',
        value: pageValue.toString(),
      })

      router.push(newUrl, { scroll: true })
    }
  }

  const t = useTranslations()
  return (
    <div className='flex items-center gap-2'>
      <Button
        size='lg'
        variant='outline'
        onClick={() => onClick('prev')}
        disabled={Number(page) <= 1}
        className='w-24'
      >
        <ChevronLeft /> {t('Search.Previous')}
      </Button>
      {t('Search.Page')} {page} {t('Search.of')} {totalPages}
      <Button
        size='lg'
        variant='outline'
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages}
        className='w-24'
      >
        {t('Search.Next')} <ChevronRight />
      </Button>
    </div>
  )
}

export default Pagination
