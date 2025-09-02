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
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className='text-right'>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead className='w-[100px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.products.map((product: IProduct) => (
                <TableRow key={product._id}>
                  <TableCell>{formatId(product._id)}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Link href={`/admin/products/${product._id}`}>
                        {product.name}
                      </Link>
                      {!product.isPublished && (
                        <span className='px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full'>
                          Draft
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>${product.price}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.countInStock}</TableCell>
                  <TableCell>{product.avgRating}</TableCell>
                  <TableCell>
                    <div
                      className={`flex items-center gap-2 ${product.isPublished ? 'text-green-600' : 'text-red-600'}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${product.isPublished ? 'bg-green-500' : 'bg-red-500'}`}
                      ></div>
                      {product.isPublished ? 'Published' : 'Draft'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDateTime(product.updatedAt).dateTime}
                  </TableCell>
                  <TableCell className='flex gap-1'>
                    <Button asChild variant='outline' size='sm'>
                      <Link href={`/admin/products/${product._id}`}>Edit</Link>
                    </Button>
                    <Button
                      asChild
                      variant={product.isPublished ? 'outline' : 'secondary'}
                      size='sm'
                      disabled={!product.isPublished}
                      title={
                        product.isPublished
                          ? 'View product'
                          : 'Product not published'
                      }
                      className={
                        !product.isPublished
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }
                    >
                      <Link
                        target='_blank'
                        href={
                          product.isPublished ? `/product/${product.slug}` : '#'
                        }
                      >
                        {product.isPublished ? 'View' : 'Draft'}
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {(data?.totalPages ?? 0) > 1 && (
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                onClick={() => handlePageChange('prev')}
                disabled={Number(page) <= 1}
                className='w-24'
              >
                <ChevronLeft /> Previous
              </Button>
              Page {page} of {data?.totalPages}
              <Button
                variant='outline'
                onClick={() => handlePageChange('next')}
                disabled={Number(page) >= (data?.totalPages ?? 0)}
                className='w-24'
              >
                Next <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList
