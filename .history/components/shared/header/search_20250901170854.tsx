import { SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { getAllCategories } from '@/lib/actions/product.actions'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export default async function Search() {
  const {
    site: { name },
  } = await getSetting()
  const categories = await getAllCategories()

  const t = await getTranslations()
  return (
    <div className='search-container'>
      <form action='/search' method='GET' className='flex items-stretch h-12'>
        <Select name='category'>
          <SelectTrigger className='w-auto h-full bg-white/10 border-white/20 text-white rounded-l-full rounded-r-none border-r-0 focus:ring-2 focus:ring-primary/50'>
            <SelectValue placeholder={t('Header.All')} />
          </SelectTrigger>
          <SelectContent position='popper' className='bg-white border-white/20'>
            <SelectItem value='all'>{t('Header.All')}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className='flex-1 rounded-none bg-white/10 border-white/20 text-white placeholder-white/60 text-base h-full border-l-0 border-r-0 focus:ring-2 focus:ring-primary/50 focus:border-transparent'
          placeholder={t('Header.Search Site', { name })}
          name='q'
          type='search'
        />
        <button
          type='submit'
          className='bg-primary text-primary-foreground rounded-r-full h-full px-4 py-2 hover:bg-primary/90 transition-colors duration-200'
        >
          <SearchIcon className='w-5 h-5' />
        </button>
      </form>
    </div>
  )
}
