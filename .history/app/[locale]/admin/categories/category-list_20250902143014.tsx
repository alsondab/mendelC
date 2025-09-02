'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('Admin')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${name}" ?`)
    ) {
      return
    }

    setIsDeleting(id)
    try {
      const result = await deleteCategory(id)
      if (result.success) {
        toast({
          title: 'Succès',
          description: 'Catégorie supprimée avec succès',
        })
        router.refresh()
      } else {
        toast({
          title: 'Erreur',
          description: result.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
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
        return 'Par nom'
      case 'sortOrder':
        return "Par ordre d'affichage"
      case 'createdAt':
        return 'Par date de création'
      default:
        return 'Aucun tri'
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
          <CardTitle className='text-lg'>Rechercher et filtrer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Rechercher une catégorie...'
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
                  Par nom
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('sortOrder')}>
                  <ArrowUpDown className='mr-2 h-4 w-4' />
                  Par ordre d'affichage
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('createdAt')}>
                  <ArrowUpDown className='mr-2 h-4 w-4' />
                  Par date de création
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    const params = new URLSearchParams(searchParams)
                    params.delete('sort')
                    router.push(`/admin/categories?${params.toString()}`)
                  }}
                >
                  Aucun tri
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
            <CardTitle className='text-lg'>Liste des catégories</CardTitle>
            <div className='text-sm text-muted-foreground'>
              {from}-{to} sur {totalCategories} catégories
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
                      Nom
                      <ArrowUpDown className='ml-2 h-4 w-4' />
                    </Button>
                  </TableHead>
                  <TableHead className='hidden sm:table-cell'>Slug</TableHead>
                  <TableHead className='hidden md:table-cell'>
                    Description
                  </TableHead>
                  <TableHead className='hidden lg:table-cell'>Parent</TableHead>
                  <TableHead className='text-center'>Statut</TableHead>
                  <TableHead className='text-center'>Ordre</TableHead>
                  <TableHead className='w-[100px] text-center'>
                    Actions
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
                        {category.description || 'Aucune description'}
                      </div>
                    </TableCell>
                    <TableCell className='hidden lg:table-cell'>
                      {category.parentCategory ? (
                        <Badge variant='secondary'>Sous-catégorie</Badge>
                      ) : (
                        <Badge variant='default'>Catégorie principale</Badge>
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
                            Actif
                          </>
                        ) : (
                          <>
                            <EyeOff className='mr-1 h-3 w-3' />
                            Inactif
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
                          <DropdownMenuItem asChild>
                            <a href={`/admin/categories/${category._id}`}>
                              <Edit className='mr-2 h-4 w-4' />
                              Modifier
                            </a>
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
                              ? 'Suppression...'
                              : 'Supprimer'}
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
                Page {currentPage} sur {totalPages}
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className='h-4 w-4' />
                  Précédent
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Suivant
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
