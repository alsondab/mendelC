import Link from 'next/link'
import ProductForm from '../product-form'
import { Metadata } from 'next'
import { Package, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Créer un Produit',
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
          <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 xs:p-6 sm:p-8'>
            <div className='flex items-center gap-3 xs:gap-4'>
              <div className='w-8 h-8 xs:w-9 xs:h-9 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg xs:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0'>
                <Plus className='h-4 w-4 text-white' />
              </div>
              <div>
                <h1 className='text-xl xs:text-2xl sm:text-3xl font-bold text-foreground'>
                  Créer un nouveau produit
                </h1>
              </div>
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
