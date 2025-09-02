import { getNoCachedSetting } from '@/lib/actions/setting.actions'
import SettingForm from './setting-form'
import SettingNav from './setting-nav'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Setting',
}
const SettingPage = async () => {
  return (
    <div className='p-2 sm:p-4'>
      <div className='grid grid-cols-1 lg:grid-cols-5 max-w-6xl mx-auto gap-4'>
        <SettingNav />
        <main className='lg:col-span-4'>
          <div className='my-4 sm:my-8'>
            <SettingForm setting={await getNoCachedSetting()} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default SettingPage
