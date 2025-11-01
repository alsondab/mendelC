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

import React, { useMemo } from 'react'

interface ProgressBarProps {
  value: number // Accepts a number between 0 and 100
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  // Ensure value stays within 0-100 range
  const boundedValue = Math.min(100, Math.max(0, value))

  return (
    <div className='relative h-4 w-full overflow-hidden rounded-lg bg-border/40'>
      <div
        className='h-full rounded-lg bg-primary transition-transform duration-300 ease-out will-change-transform'
        style={{
          transform: `scaleX(${boundedValue / 100})`,
          transformOrigin: 'left',
        }}
      />
    </div>
  )
}

export default function TableChart({
  labelType = 'month',
  data = [],
}: TableChartProps) {
  const dataWithPercentage = useMemo(() => {
    if (!data.length) return []
    const max = Math.max(...data.map((item) => item.value)) || 1
    return data.map((x) => ({
      ...x,
      label: labelType === 'month' ? getMonthName(x.label) : x.label,
      percentage: Math.round((x.value / max) * 100),
    }))
  }, [data, labelType])
  return (
    <div className='space-y-3'>
      {dataWithPercentage.map(
        ({ label, id, value, image, percentage }, index) => (
          <div
            key={`${label}-${index}`}
            className='grid grid-cols-[100px_1fr_80px] md:grid-cols-[250px_1fr_80px] gap-2 space-y-4  '
          >
            {image ? (
              <Link className='flex items-end' href={`/admin/products/${id}`}>
                <Image
                  className='rounded border  aspect-square object-scale-down max-w-full h-auto mx-auto mr-1'
                  src={image!}
                  alt={label}
                  width={36}
                  height={36}
                />
                <p className='text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
                  {label}
                </p>
              </Link>
            ) : (
              <div className='flex items-end text-sm'>{label}</div>
            )}

            <ProgressBar value={percentage} />

            <div className='text-sm text-right flex items-center'>
              <ProductPrice price={value} plain />
            </div>
          </div>
        )
      )}
    </div>
  )
}
