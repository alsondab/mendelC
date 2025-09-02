import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getAllCategoriesForAdmin } from '@/lib/actions/category.actions'
import { CategoryListWrapper } from './category-list-wrapper'
import { CategoryListSkeleton } from './category-list-skeleton'
import { Button } from '@/components/ui/button'
import { Plus, Grid3X3 } from 'lucide-react'
import Link from 'next/link'

interface CategoriesPageProps {
  searchParams: {
    query?: string
    page?: string
    sort?: string
  }
}

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const t = await getTranslations('Admin')
  const { query = '', page = '1', sort = 'name' } = searchParams

  return (
    <div className='space-y-6 p-4 xs:p-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <Grid3X3 className='h-6 w-6 text-primary' />
            <h1 className='text-2xl font-bold tracking-tight'>Catégories</h1>
          </div>
          <p className='text-muted-foreground'>
            Gérez les catégories et sous-catégories de votre boutique
          </p>
        </div>
        <div className='flex gap-2'>
          <Button asChild>
            <Link href='/admin/categories/create'>
              <Plus className='mr-2 h-4 w-4' />
              Nouvelle catégorie
            </Link>
          </Button>
        </div>
      </div>

      {/* Categories List */}
      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoryList query={query} page={page} sort={sort} />
      </Suspense>
    </div>
  )
}
