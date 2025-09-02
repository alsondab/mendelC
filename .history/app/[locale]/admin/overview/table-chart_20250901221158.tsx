'use client'

import ProductPrice from '@/components/shared/product/product-price'
import { getMonthName } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

type TableChartProps = {
  labelType: 'month' | 'product'
  data: {
    label: string
    image?: string
    value: number
    id?: string
  }[]
}

import React from 'react'

interface ProgressBarProps {
  value: number // Accepts a number between 0 and 100
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  // Ensure value stays within 0-100 range
  const boundedValue = Math.min(100, Math.max(0, value))

  return (
    <div className='relative w-full h-4 overflow-hidden'>
      <div
        className='bg-primary h-full transition-all duration-300 rounded-lg'
        style={{
          width: `${boundedValue}%`,
          float: 'right', // Aligns the bar to start from the right
        }}
      />
    </div>
  )
}

export default function TableChart({
  labelType = 'month',
  data = [],
}: TableChartProps) {
  const max = Math.max(...data.map((item) => item.value))
  const dataWithPercentage = data.map((x) => ({
    ...x,
    label: labelType === 'month' ? getMonthName(x.label) : x.label,
    percentage: Math.round((x.value / max) * 100),
  }))
  return (
    <div className='space-y-2 sm:space-y-3'>
      {dataWithPercentage.map(
        ({ label, id, value, image, percentage }, index) => (
          <div
            key={`${label}-${index}`}
            className='grid grid-cols-[60px_1fr_60px] xs:grid-cols-[80px_1fr_70px] sm:grid-cols-[100px_1fr_80px] md:grid-cols-[150px_1fr_80px] lg:grid-cols-[200px_1fr_80px] gap-1 sm:gap-2'
          >
            {image ? (
              <Link className='flex flex-col items-center' href={`/admin/products/${id}`}>
                <Image
                  className='rounded border aspect-square object-scale-down w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12'
                  src={image!}
                  alt={label}
                  width={48}
                  height={48}
                />
                <p className='text-center text-xs xs:text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[60px] xs:max-w-[80px] sm:max-w-[100px] md:max-w-[150px] lg:max-w-[200px]'>
                  {label}
                </p>
              </Link>
            ) : (
              <div className='flex items-center text-xs xs:text-sm overflow-hidden'>
                <span className='truncate'>{label}</span>
              </div>
            )}

            <div className='flex items-center px-1'>
              <ProgressBar value={percentage} />
            </div>

            <div className='text-xs xs:text-sm text-right flex items-center justify-end'>
              <ProductPrice price={value} plain />
            </div>
          </div>
        )
      )}
    </div>
  )
}
