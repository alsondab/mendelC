/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Link from 'next/link'

import DeleteDialog from '@/components/shared/delete-dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  deleteProduct,
  getAllProductsForAdmin,
} from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'

import React, { useEffect, useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { formatDateTime, formatId } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Search, Plus, Package, Eye, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type ProductListDataProps = {
  products: IProduct[]
  totalPages: number
  totalProducts: number
  to: number
  from: number
}
const ProductList = () => {
  const [page, setPage] = useState<number>(1)
  const [inputValue, setInputValue] = useState<string>('')
  const [data, setData] = useState<ProductListDataProps>()
  const [isPending, startTransition] = useTransition()

  const handlePageChange = (changeType: 'next' | 'prev') => {
    const newPage = changeType === 'next' ? page + 1 : page - 1
    if (changeType === 'next') {
      setPage(newPage)
    } else {
      setPage(newPage)
    }
    startTransition(async () => {
      const data = await getAllProductsForAdmin({
        query: inputValue,
        page: newPage,
      })
      setData(data)
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    if (value) {
      clearTimeout((window as any).debounce)
      ;(window as any).debounce = setTimeout(() => {
        startTransition(async () => {
          const data = await getAllProductsForAdmin({ query: value, page: 1 })
          setData(data)
        })
      }, 500)
    } else {
      startTransition(async () => {
        const data = await getAllProductsForAdmin({ query: '', page })
        setData(data)
      })
    }
  }
  useEffect(() => {
    startTransition(async () => {
      const data = await getAllProductsForAdmin({ query: '' })
      setData(data)
    })
  }, [])

  return (
    <div className='p-2 sm:p-4 space-y-4'>
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <Package className='h-6 w-6 text-primary' />
          </div>
          <div>
            <h1 className='text-xl sm:text-2xl font-bold'>Produits</h1>
            <p className='text-sm text-muted-foreground'>
              Gérez votre catalogue de produits
            </p>
          </div>
        </div>
        
        <Button asChild className='w-full sm:w-auto'>
          <Link href='/admin/products/create' className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Créer un produit
          </Link>
        </Button>
      </div>

      {/* Search and Stats */}
      <Card>
        <CardContent className='p-4'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                className='pl-10'
                type='text'
                value={inputValue}
                onChange={handleInputChange}
                placeholder='Rechercher un produit...'
              />
            </div>
            
            <div className='flex items-center gap-2'>
              {isPending ? (
                <Badge variant='secondary'>Chargement...</Badge>
              ) : (
                <Badge variant='outline'>
                  {data?.totalProducts === 0
                    ? 'Aucun'
                    : `${data?.from}-${data?.to} sur ${data?.totalProducts}`}
                  {' résultats'}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Liste des produits</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-xs sm:text-sm'>ID</TableHead>
                  <TableHead className='text-xs sm:text-sm'>Nom</TableHead>
                  <TableHead className='text-xs sm:text-sm text-right'>Prix</TableHead>
                  <TableHead className='text-xs sm:text-sm hidden sm:table-cell'>Catégorie</TableHead>
                  <TableHead className='text-xs sm:text-sm hidden md:table-cell'>Stock</TableHead>
                  <TableHead className='text-xs sm:text-sm hidden lg:table-cell'>Note</TableHead>
                  <TableHead className='text-xs sm:text-sm hidden md:table-cell'>Statut</TableHead>
                  <TableHead className='text-xs sm:text-sm hidden lg:table-cell'>Dernière MAJ</TableHead>
                  <TableHead className='text-xs sm:text-sm w-[120px]'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.products.map((product: IProduct) => (
                  <TableRow key={product._id} className='hover:bg-muted/50'>
                    <TableCell className='text-xs sm:text-sm font-mono'>
                      {formatId(product._id)}
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col gap-1'>
                        <Link 
                          href={`/admin/products/${product._id}`}
                          className='text-sm font-medium hover:text-primary transition-colors'
                        >
                          {product.name}
                        </Link>
                        <div className='flex items-center gap-2'>
                          <Badge 
                            variant={product.isPublished ? 'default' : 'secondary'}
                            className='text-xs'
                          >
                            {product.isPublished ? 'Publié' : 'Brouillon'}
                          </Badge>
                          <span className='text-xs text-muted-foreground sm:hidden'>
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='text-right text-sm font-medium'>
                      ${product.price}
                    </TableCell>
                    <TableCell className='hidden sm:table-cell text-sm'>
                      {product.category}
                    </TableCell>
                    <TableCell className='hidden md:table-cell text-sm'>
                      <Badge variant={product.countInStock > 0 ? 'default' : 'destructive'}>
                        {product.countInStock}
                      </Badge>
                    </TableCell>
                    <TableCell className='hidden lg:table-cell text-sm'>
                      {product.avgRating ? `${product.avgRating}/5` : 'N/A'}
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      <div className='flex items-center gap-2'>
                        <div
                          className={`w-2 h-2 rounded-full ${product.isPublished ? 'bg-green-500' : 'bg-yellow-500'}`}
                        />
                        <span className='text-xs'>
                          {product.isPublished ? 'Publié' : 'Brouillon'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='hidden lg:table-cell text-xs text-muted-foreground'>
                      {formatDateTime(product.updatedAt).dateOnly}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <Button asChild variant='outline' size='sm' className='h-8 w-8 p-0'>
                          <Link href={`/admin/products/${product._id}`}>
                            <Edit className='h-3 w-3' />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant={product.isPublished ? 'outline' : 'secondary'}
                          size='sm'
                          className='h-8 w-8 p-0'
                          disabled={!product.isPublished}
                          title={
                            product.isPublished
                              ? 'Voir le produit'
                              : 'Produit non publié'
                          }
                        >
                          <Link
                            target='_blank'
                            href={
                              product.isPublished ? `/product/${product.slug}` : '#'
                            }
                          >
                            <Eye className='h-3 w-3' />
                          </Link>
                        </Button>
                        <DeleteDialog
                          id={product._id}
                          action={deleteProduct}
                          callbackAction={() => {
                            startTransition(async () => {
                              const data = await getAllProductsForAdmin({
                                query: inputValue,
                              })
                              setData(data)
                            })
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Pagination */}
      {(data?.totalPages ?? 0) > 1 && (
        <Card>
          <CardContent className='p-4'>
            <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
              <div className='text-sm text-muted-foreground'>
                Page {page} sur {data?.totalPages}
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  onClick={() => handlePageChange('prev')}
                  disabled={Number(page) <= 1}
                  className='flex items-center gap-2'
                >
                  <ChevronLeft className='h-4 w-4' />
                  Précédent
                </Button>
                <Button
                  variant='outline'
                  onClick={() => handlePageChange('next')}
                  disabled={Number(page) >= (data?.totalPages ?? 0)}
                  className='flex items-center gap-2'
                >
                  Suivant
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ProductList
