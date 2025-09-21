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
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime, formatId } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

  if (!data) {
    return (
      <div className='p-2 sm:p-4'>
        <div className='space-y-3 sm:space-y-4'>
          {/* Header Section */}
          <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-4'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4'>
              <Skeleton className='h-8 w-32' />
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto'>
                <Skeleton className='h-10 w-64' />
                <Skeleton className='h-5 w-48' />
              </div>
            </div>
            <Skeleton className='h-10 w-32' />
          </div>

          {/* Table Section */}
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-xs sm:text-sm'>ID</TableHead>
                  <TableHead className='text-xs sm:text-sm'>Nom</TableHead>
                  <TableHead className='text-right text-xs sm:text-sm'>
                    Prix
                  </TableHead>
                  <TableHead className='hidden sm:table-cell text-xs sm:text-sm'>
                    Catégorie
                  </TableHead>
                  <TableHead className='hidden md:table-cell text-xs sm:text-sm'>
                    Stock
                  </TableHead>
                  <TableHead className='hidden lg:table-cell text-xs sm:text-sm'>
                    Note
                  </TableHead>
                  <TableHead className='hidden md:table-cell text-xs sm:text-sm'>
                    Statut
                  </TableHead>
                  <TableHead className='hidden lg:table-cell text-xs sm:text-sm'>
                    Dernière MAJ
                  </TableHead>
                  <TableHead className='w-[120px] sm:w-[140px] text-xs sm:text-sm'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className='h-4 w-20' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-32' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-16' />
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      <Skeleton className='h-4 w-24' />
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      <Skeleton className='h-4 w-16' />
                    </TableCell>
                    <TableCell className='hidden lg:table-cell'>
                      <Skeleton className='h-4 w-12' />
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      <Skeleton className='h-4 w-20' />
                    </TableCell>
                    <TableCell className='hidden lg:table-cell'>
                      <Skeleton className='h-4 w-24' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-8 w-20' />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-2 sm:p-4'>
      <div className='space-y-3 sm:space-y-4'>
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-4'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4'>
            <h1 className='font-bold text-lg sm:text-xl'>Produits</h1>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto'>
              <Input
                className='w-full sm:w-64'
                type='text'
                value={inputValue}
                onChange={handleInputChange}
                placeholder='Rechercher un produit...'
              />
              {isPending ? (
                <p className='text-sm text-muted-foreground'>Chargement...</p>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  {data?.totalProducts === 0
                    ? 'Aucun'
                    : `${data?.from}-${data?.to} sur ${data?.totalProducts}`}
                  {' résultat(s)'}
                </p>
              )}
            </div>
          </div>

          <Button asChild variant='default' className='w-full sm:w-auto'>
            <Link href='/admin/products/create'>Créer un produit</Link>
          </Button>
        </div>
        {/* Table Section */}
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-xs sm:text-sm'>ID</TableHead>
                <TableHead className='text-xs sm:text-sm'>Nom</TableHead>
                <TableHead className='text-right text-xs sm:text-sm'>
                  Prix
                </TableHead>
                <TableHead className='hidden sm:table-cell text-xs sm:text-sm'>
                  Catégorie
                </TableHead>
                <TableHead className='hidden md:table-cell text-xs sm:text-sm'>
                  Stock
                </TableHead>
                <TableHead className='hidden lg:table-cell text-xs sm:text-sm'>
                  Note
                </TableHead>
                <TableHead className='hidden md:table-cell text-xs sm:text-sm'>
                  Statut
                </TableHead>
                <TableHead className='hidden lg:table-cell text-xs sm:text-sm'>
                  Dernière MAJ
                </TableHead>
                <TableHead className='w-[120px] sm:w-[140px] text-xs sm:text-sm'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.products.map((product: IProduct) => (
                <TableRow key={product._id}>
                  <TableCell className='text-xs sm:text-sm font-mono'>
                    {formatId(product._id)}
                  </TableCell>
                  <TableCell className='text-xs sm:text-sm'>
                    <div className='flex flex-col gap-1'>
                      <Link
                        href={`/admin/products/${product._id}`}
                        className='font-medium hover:underline truncate max-w-[150px] sm:max-w-none'
                      >
                        {product.name}
                      </Link>
                      <div className='flex flex-wrap gap-1'>
                        <span className='text-xs text-muted-foreground sm:hidden'>
                          {product.category}
                        </span>
                        {!product.isPublished && (
                          <span className='px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full'>
                            Brouillon
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-right text-xs sm:text-sm font-medium'>
                    ${product.price}
                  </TableCell>
                  <TableCell className='hidden sm:table-cell text-xs sm:text-sm'>
                    {product.category}
                  </TableCell>
                  <TableCell className='hidden md:table-cell text-xs sm:text-sm'>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.countInStock}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.stockStatus === 'in_stock'
                            ? 'bg-green-100 text-green-800'
                            : product.stockStatus === 'low_stock'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stockStatus === 'in_stock' && 'En stock'}
                        {product.stockStatus === 'low_stock' && 'Faible'}
                        {product.stockStatus === 'out_of_stock' && 'Rupture'}
                        {product.stockStatus === 'discontinued' && 'Discontinué'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='hidden lg:table-cell text-xs sm:text-sm'>
                    <div className='flex items-center gap-1'>
                      <span className='text-yellow-500'>★</span>
                      {product.avgRating || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <div
                      className={`flex items-center gap-2 text-xs sm:text-sm ${
                        product.isPublished ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          product.isPublished ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      ></div>
                      {product.isPublished ? 'Publié' : 'Brouillon'}
                    </div>
                  </TableCell>
                  <TableCell className='hidden lg:table-cell text-xs sm:text-sm text-muted-foreground'>
                    {formatDateTime(product.updatedAt).dateOnly}
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col sm:flex-row gap-1'>
                      <Button
                        asChild
                        variant='outline'
                        size='sm'
                        className='text-xs'
                      >
                        <Link href={`/admin/products/${product._id}`}>
                          Modifier
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant={product.isPublished ? 'outline' : 'secondary'}
                        size='sm'
                        disabled={!product.isPublished}
                        title={
                          product.isPublished
                            ? 'Voir le produit'
                            : 'Produit non publié'
                        }
                        className={`text-xs ${
                          !product.isPublished
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        <Link
                          target='_blank'
                          href={
                            product.isPublished
                              ? `/product/${product.slug}`
                              : '#'
                          }
                        >
                          {product.isPublished ? 'Voir' : 'Brouillon'}
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
          {/* Pagination */}
          {(data?.totalPages ?? 0) > 1 && (
            <div className='flex flex-col sm:flex-row items-center justify-between gap-3 pt-4'>
              <div className='text-sm text-muted-foreground'>
                Page {page} sur {data?.totalPages}
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  onClick={() => handlePageChange('prev')}
                  disabled={Number(page) <= 1}
                  className='w-20 sm:w-24 text-xs sm:text-sm'
                >
                  <ChevronLeft className='h-3 w-3 sm:h-4 sm:w-4' />
                  <span className='hidden sm:inline'>Précédent</span>
                </Button>
                <Button
                  variant='outline'
                  onClick={() => handlePageChange('next')}
                  disabled={Number(page) >= (data?.totalPages ?? 0)}
                  className='w-20 sm:w-24 text-xs sm:text-sm'
                >
                  <span className='hidden sm:inline'>Suivant</span>
                  <ChevronRight className='h-3 w-3 sm:h-4 sm:w-4' />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList
