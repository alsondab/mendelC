/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Legend,
  Tooltip,
} from 'recharts'

export default function SalesCategoryPieChart({ data }: { data: any[] }) {
  // Couleurs différentes pour chaque secteur
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82CA9D',
    '#FFC658',
    '#FF7C7C',
    '#8DD1E1',
    '#D084D0',
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-3 border rounded-lg shadow-lg'>
          <p className='font-medium'>{payload[0].name}</p>
          <p className='text-sm text-gray-600'>
            {payload[0].value} unités vendues
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className='w-full'>
      <ResponsiveContainer width='100%' height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey='totalSales'
            nameKey='_id'
            cx='50%'
            cy='50%'
            outerRadius={120}
            fill='#8884d8'
            label={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign='bottom'
            height={36}
            formatter={(value, entry: any) => (
              <span className='text-sm'>
                {value} ({entry.payload.totalSales} unités)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
