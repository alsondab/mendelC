import { getTranslations } from 'next-intl/server'
import { CategoryForm } from '../category-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Grid3X3 } from 'lucide-react'
import Link from 'next/link'

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {

  return (
    <div className='space-y-6 p-4 xs:p-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='sm' asChild>
          <Link href='/admin/categories'>
            <ArrowLeft className='h-4 w-4' />
          </Link>
        </Button>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <Grid3X3 className='h-6 w-6 text-primary' />
            <h1 className='text-2xl font-bold tracking-tight'>
              Modifier la catégorie
            </h1>
          </div>
          <p className='text-muted-foreground'>
            Modifiez les informations de la catégorie
          </p>
        </div>
      </div>

      {/* Category Form */}
      <CategoryForm categoryId={params.id} />
    </div>
  )
}
