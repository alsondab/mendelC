'use client'
import React, { useEffect, useState, useTransition } from 'react'
import { getNoCachedSetting } from '@/lib/actions/setting.actions'
import { ISettingInput } from '@/types'
import SettingForm from './setting-form'
import SettingNav from './setting-nav'
import { Skeleton } from '@/components/ui/skeleton'

const SettingsPage = () => {
  const [setting, setSetting] = useState<ISettingInput>()
  const [, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const settingData = await getNoCachedSetting()
      setSetting(settingData)
    })
  }, [])

  if (!setting) {
    return (
      <div className='p-2 sm:p-4'>
        <div className='grid grid-cols-1 lg:grid-cols-5 max-w-6xl mx-auto gap-4'>
          <div className='lg:col-span-1'>
            <Skeleton className='h-64 w-full' />
          </div>
          <main className='lg:col-span-4'>
            <div className='my-4 sm:my-8'>
              <Skeleton className='h-96 w-full' />
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className='p-2 sm:p-4'>
      <div className='grid grid-cols-1 lg:grid-cols-5 max-w-6xl mx-auto gap-4'>
        <SettingNav />
        <main className='lg:col-span-4'>
          <div className='my-4 sm:my-8'>
            <SettingForm setting={setting} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default SettingsPage
