'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { ICategory } from '@/types'
import { deleteCategory } from '@/lib/actions/category.actions'
import { toast } from '@/hooks/use-toast'
import { CategoryEditDialog } from '@/components/shared/category/category-edit-dialog'

interface CategoryListProps {
  categories: ICategory[]
  totalPages: number
  totalCategories: number
  from: number
  to: number
  currentPage: number
}

export function CategoryList({
  categories,
  totalPages,
  totalCategories,
  from,
  to,
  currentPage,
}: CategoryListProps) {
  const t = useTranslations('Admin.CategoriesList')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(t('DeleteConfirm', { name }))
    ) {
      return
    }

    setIsDeleting(id)
    try {
      const result = await deleteCategory(id)
      if (result.success) {
        toast({
          title: t('Success'),
          description: t('CategoryDeleted'),
        })
        router.refresh()
      } else {
        toast({
          title: t('Error'),
          description: result.message,
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: t('Error'),
        description: t('ErrorOccurred'),
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams)
    const currentSort = params.get('sort')

    if (currentSort === field) {
      params.delete('sort')
    } else {
      params.set('sort', field)
    }

    router.push(`/admin/categories?${params.toString()}`)
  }

  const getCurrentSort = () => {
    const sort = searchParams.get('sort')
    switch (sort) {
      case 'name':
        return t('SortByName')
      case 'sortOrder':
        return t('SortByDisplayOrder')
      case 'createdAt':
        return t('SortByCreationDate')
      default:
        return t('NoSort')
    }
  }

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams)
    if (query) {
      params.set('query', query)
    } else {
      params.delete('query')
    }
    params.delete('page')
    router.push(`/admin/categories?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/admin/categories?${params.toString()}`)
  }

  return (
    <div className='space-y-4'>
      {/* Search and Filters */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-lg'>{t('SearchAndFilter')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder={t('SearchPlaceholder')}
                defaultValue={searchParams.get('query') || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className='pl-9'
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='flex items-center gap-2'>
                  <Filter className='h-4 w-4' />
                  {getCurrentSort()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => handleSort('name')}>
                  <ArrowUpDown className='mr-2 h-4 w-4' />
                  {t('SortByName')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('sortOrder')}>
                  <ArrowUpDown className='mr-2 h-4 w-4' />
                  {t('SortByDisplayOrder')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('createdAt')}>
                  <ArrowUpDown className='mr-2 h-4 w-4' />
                  {t('SortByCreationDate')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    const params = new URLSearchParams(searchParams)
                    params.delete('sort')
                    router.push(`/admin/categories?${params.toString()}`)
                  }}
                >
                  {t('NoSort')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg'>{t('CategoriesList')}</CardTitle>
            <div className='text-sm text-muted-foreground'>
              {t('CategoriesCount', { from, to, total: totalCategories })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[50px]'>#</TableHead>
                  <TableHead>
                    <Button
                      variant='ghost'
                      onClick={() => handleSort('name')}
                      className='h-auto p-0 font-semibold'
                    >
                      {t('Name')}
                      <ArrowUpDown className='ml-2 h-4 w-4' />
                    </Button>
                  </TableHead>
                  <TableHead className='hidden sm:table-cell'>{t('Slug')}</TableHead>
                  <TableHead className='hidden md:table-cell'>
                    {t('Description')}
                  </TableHead>
                  <TableHead className='hidden lg:table-cell'>{t('Parent')}</TableHead>
                  <TableHead className='text-center'>{t('Status')}</TableHead>
                  <TableHead className='text-center'>{t('Order')}</TableHead>
                  <TableHead className='w-[100px] text-center'>
                    {t('Actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={category._id}>
                    <TableCell className='font-medium'>
                      {(currentPage - 1) * 20 + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className='space-y-1'>
                        <div className='font-medium'>{category.name}</div>
                        <div className='text-xs text-muted-foreground sm:hidden'>
                          {category.slug}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      <code className='rounded bg-muted px-1 py-0.5 text-xs'>
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      <div className='max-w-[200px] truncate text-sm'>
                        {category.description || t('NoDescription')}
                      </div>
                    </TableCell>
                    <TableCell className='hidden lg:table-cell'>
                      {category.parentCategory ? (
                        <Badge variant='secondary'>{t('SubCategory')}</Badge>
                      ) : (
                        <Badge variant='default'>{t('MainCategory')}</Badge>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      <Badge
                        variant={category.isActive ? 'default' : 'secondary'}
                        className={
                          category.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                        }
                      >
                        {category.isActive ? (
                          <>
                            <Eye className='mr-1 h-3 w-3' />
                            {t('Active')}
                          </>
                        ) : (
                          <>
                            <EyeOff className='mr-1 h-3 w-3' />
                            {t('Inactive')}
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-center'>
                      <Badge variant='outline'>{category.sortOrder}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            disabled={isDeleting === category._id}
                          >
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCategoryId(category._id)
                              setEditDialogOpen(true)
                            }}
                          >
                            <Edit className='mr-2 h-4 w-4' />
                            {t('Edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDelete(category._id, category.name)
                            }
                            className='text-destructive'
                            disabled={isDeleting === category._id}
                          >
                            <Trash2 className='mr-2 h-4 w-4' />
                            {isDeleting === category._id
                              ? t('Deleting')
                              : t('Delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='mt-4 flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                {t('PageInfo', { current: currentPage, total: totalPages })}
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className='h-4 w-4' />
                  {t('Previous')}
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  {t('Next')}
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Edit Dialog */}
      <CategoryEditDialog
        categoryId={selectedCategoryId}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) {
            setSelectedCategoryId(null)
          }
        }}
        onSuccess={() => {
          router.refresh()
        }}
      />
    </div>
  )
}
