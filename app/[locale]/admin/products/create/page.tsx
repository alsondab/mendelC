import Link from 'next/link'
import ProductForm from '../product-form'
import { Metadata } from 'next'
import { ArrowLeft, Package, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Create Product',
}

const CreateProductPage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
      <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
        {/* Header Section */}
        <div className='mb-8'>
          {/* Breadcrumb */}
          <nav className='flex items-center space-x-2 text-sm text-muted-foreground mb-6'>
            <Link
              href='/admin/products'
              className='hover:text-foreground transition-colors flex items-center gap-1'
            >
              <Package className='h-4 w-4' />
              Produits
            </Link>
            <span className='text-muted-foreground'>›</span>
            <span className='text-foreground font-medium flex items-center gap-1'>
              <Plus className='h-4 w-4' />
              Créer un produit
            </span>
          </nav>

          {/* Page Header */}
          <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                  <Plus className='h-6 w-6 text-white' />
                </div>
                <div>
                  <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                    Créer un nouveau produit
                  </h1>
                  <p className='text-muted-foreground mt-1'>
                    Ajoutez un nouveau produit à votre catalogue
                  </p>
                </div>
              </div>
              <Button asChild variant='outline' className='w-full sm:w-auto'>
                <Link
                  href='/admin/products'
                  className='flex items-center gap-2'
                >
                  <ArrowLeft className='h-4 w-4' />
                  Retour aux produits
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden'>
          <ProductForm type='Create' />
        </div>
      </div>
    </div>
  )
}

export default CreateProductPage
