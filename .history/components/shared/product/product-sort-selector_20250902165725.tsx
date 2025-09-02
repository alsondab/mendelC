'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getFilterUrl } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ProductSortSelector({
  sortOrders,
  sort,
  params,
}: {
  sortOrders: { value: string; name: string }[]
  sort: string
  params: {
    q?: string
    category?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }
}) {
  const router = useRouter()
  const currentSort = sortOrders.find((s) => s.value === sort)?.name || 'Best selling'
  
  return (
    <Select
      onValueChange={(v) => {
        router.push(getFilterUrl({ params, sort: v }))
      }}
      value={sort}
    >
      <SelectTrigger className='w-full sm:w-auto min-w-[140px] sm:min-w-[180px] h-9 sm:h-10 text-xs sm:text-sm'>
        <SelectValue>
          <span className='hidden sm:inline'>Sort By: </span>
          <span className='sm:hidden'>Trier: </span>
          <span className='font-medium'>{currentSort}</span>
        </SelectValue>
      </SelectTrigger>

      <SelectContent className='w-full sm:w-auto min-w-[200px]'>
        {sortOrders.map((s) => (
          <SelectItem key={s.value} value={s.value} className='text-xs sm:text-sm'>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
