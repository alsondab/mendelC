/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import ProductPrice from '@/components/shared/product/product-price'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils'
import { useTheme } from 'next-themes'
import React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <Card>
        <CardContent className='p-2'>
          <p>{label && formatDateTime(new Date(label)).dateOnly}</p>
          <p className='text-primary text-xl'>
            <ProductPrice price={payload[0].value} plain />
          </p>
        </CardContent>
      </Card>
    )
  }
  return null
}

const CustomXAxisTick: React.FC<any> = ({ x, y, payload }) => {
  const date = new Date(payload.value)
  const day = date.getDate()
  const monthNames = [
    'jan',
    'fév',
    'mar',
    'avr',
    'mai',
    'jun',
    'jul',
    'août',
    'sep',
    'oct',
    'nov',
    'déc',
  ]
  const month = monthNames[date.getMonth()]

  return (
    <text x={x} y={y + 10} textAnchor='middle' fill='#666' className='text-xs'>
      {`${day} ${month}`}
    </text>
  )
}

export default function SalesAreaChart({ data }: { data: any[] }) {
  const { theme } = useTheme()

  return (
    <ResponsiveContainer width='100%' height={400}>
      <AreaChart data={data}>
        <CartesianGrid horizontal={true} vertical={false} stroke='' />
        <XAxis
          dataKey='date'
          tick={<CustomXAxisTick />}
          interval={2}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          fontSize={12}
          tickFormatter={(value: number) => `${value} CFA`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type='monotone'
          dataKey='totalSales'
          stroke={theme === 'dark' ? '#ff8c00' : '#ff6600'}
          strokeWidth={2}
          fill='hsl(24.6 95% 53.1%)'
          fillOpacity={0.8}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
