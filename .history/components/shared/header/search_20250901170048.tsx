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
import { Button } from '@/components/ui/button'

export default async function Search() {
  const {
    site: { name },
  } = await getSetting()
  const categories = await getAllCategories()
  const t = await getTranslations()

  return (
    <form action='/search' method='GET' className='relative flex items-center w-full'>
      <div className='relative flex w-full items-center'>
        <Select name='category'>
          <SelectTrigger className='w-auto h-10 rounded-l-md rounded-r-none border-r-0 bg-background'>
            <SelectValue placeholder={t('Header.All')} />
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectItem value='all'>{t('Header.All')}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input
          className='flex-1 h-10 rounded-none border-l-0 border-r-0 bg-background text-foreground placeholder:text-muted-foreground'
          placeholder={t('Header.Search Site', { name })}
          name='q'
          type='search'
        />
        
        <Button
          type='submit'
          size='icon'
          className='h-10 rounded-l-none bg-primary hover:bg-primary/90 text-primary-foreground'
        >
          <SearchIcon className='h-4 w-4' />
          <span className='sr-only'>Rechercher</span>
        </Button>
      </div>
    </form>
  )
}
