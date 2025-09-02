'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { createProduct, updateProduct } from '@/lib/actions/product.actions'
import { getAllMainCategories } from '@/lib/actions/category.actions'
import { IProduct } from '@/lib/db/models/product.model'
import { ICategory } from '@/types'
import { UploadButton } from '@/lib/uploadthing'
import { ProductInputSchema, ProductUpdateSchema } from '@/lib/validator'
import { Checkbox } from '@/components/ui/checkbox'
import { toSlug } from '@/lib/utils'
import { IProductInput } from '@/types'
import {
  Tag,
  DollarSign,
  Image as ImageIcon,
  FileText,
  Settings,
  CheckCircle,
  Wand2,
  Trash2,
  Upload,
} from 'lucide-react'

const productDefaultValues: IProductInput =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'Sample Product',
        slug: 'sample-product',
        category: 'Sample Category',
        images: ['/images/p11-1.jpg'],
        brand: 'Sample Brand',
        description: 'This is a sample description of the product.',
        price: 99.99,
        listPrice: 0,
        countInStock: 15,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        colors: [],
        specifications: [],
        compatibility: [],
        ratingDistribution: [],
        reviews: [],
      }
    : {
        name: '',
        slug: '',
        category: '',
        images: [],
        brand: '',
        description: '',
        price: 0,
        listPrice: 0,
        countInStock: 0,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        colors: [],
        specifications: [],
        compatibility: [],
        ratingDistribution: [],
        reviews: [],
      }

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update'
  product?: IProduct
  productId?: string
}) => {
  const router = useRouter()
  const [categories, setCategories] = useState<ICategory[]>([])

  const form = useForm<IProductInput>({
    resolver:
      type === 'Update'
        ? zodResolver(ProductUpdateSchema)
        : zodResolver(ProductInputSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  })

  const { toast } = useToast()

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getAllMainCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }
    loadCategories()
  }, [])

  async function onSubmit(values: IProductInput) {
    if (type === 'Create') {
      const res = await createProduct(values)
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        toast({
          description: res.message,
        })
        router.push(`/admin/products`)
      }
    }
    if (type === 'Update') {
      if (!productId) {
        router.push(`/admin/products`)
        return
      }
      const res = await updateProduct({ ...values, _id: productId })
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        router.push(`/admin/products`)
      }
    }
  }
  const images = form.watch('images')

  return (
    <Form {...form}>
      <form
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 p-6 sm:p-8'
      >
        {/* Basic Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Tag className='h-5 w-5 text-blue-600' />
              Informations de base
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>
                      Nom du produit
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Entrez le nom du produit'
                        className='h-11'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>
                      Slug (URL)
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder='slug-du-produit'
                          className='h-11 pr-20'
                          {...field}
                        />
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            form.setValue(
                              'slug',
                              toSlug(form.getValues('name'))
                            )
                          }}
                          className='absolute right-1 top-1 h-9 px-3 text-xs'
                        >
                          <Wand2 className='h-3 w-3 mr-1' />
                          Générer
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>
                      Catégorie
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='h-11'>
                          <SelectValue placeholder='Sélectionnez une catégorie' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='brand'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>
                      Marque
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Entrez la marque'
                        className='h-11'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        {/* Pricing & Stock Section */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <DollarSign className='h-5 w-5 text-green-600' />
              Prix et stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <FormField
                control={form.control}
                name='listPrice'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>
                      Prix de liste
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='0.00'
                        className='h-11'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>
                      Prix de vente
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='0.00'
                        className='h-11'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='countInStock'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>
                      Stock disponible
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='0'
                        className='h-11'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Images Section */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <ImageIcon className='h-5 w-5 text-purple-600' />
              Images du produit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name='images'
              render={() => (
                <FormItem>
                  <div className='space-y-4'>
                    {/* Upload Section */}
                    <div className='border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center hover:border-slate-300 dark:hover:border-slate-600 transition-colors'>
                      <Upload className='h-8 w-8 mx-auto text-slate-400 mb-2' />
                      <p className='text-sm text-muted-foreground mb-4'>
                        Glissez-déposez vos images ou cliquez pour sélectionner
                      </p>
                      <FormControl>
                        <UploadButton
                          endpoint='imageUploader'
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('images', [...images, res[0].url])
                            toast({
                              description: 'Image uploadée avec succès !',
                            })
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: 'destructive',
                              description: `Erreur d'upload: ${error.message}`,
                            })
                          }}
                        />
                      </FormControl>
                    </div>

                    {/* Images Grid */}
                    {images.length > 0 && (
                      <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                          <p className='text-sm font-medium'>
                            Images ({images.length})
                          </p>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              form.setValue('images', [])
                              toast({
                                description: 'Images réinitialisées',
                              })
                            }}
                            className='text-red-600 hover:text-red-700'
                          >
                            <Trash2 className='h-4 w-4 mr-1' />
                            Tout supprimer
                          </Button>
                        </div>

                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                          {images.map((image: string, index: number) => (
                            <div
                              key={`${image}-${index}`}
                              className='relative group aspect-square'
                            >
                              <Image
                                src={image}
                                alt={`Image ${index + 1}`}
                                className='w-full h-full object-cover rounded-lg border shadow-sm'
                                width={150}
                                height={150}
                              />
                              <Button
                                type='button'
                                variant='destructive'
                                size='sm'
                                className='absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg'
                                onClick={() => {
                                  const newImages = images.filter(
                                    (_, i) => i !== index
                                  )
                                  form.setValue('images', newImages)
                                  toast({
                                    description: 'Image supprimée',
                                  })
                                }}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Content Section */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <FileText className='h-5 w-5 text-orange-600' />
              Contenu et descriptions
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>
                    Description du produit
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Décrivez votre produit en détail...'
                      className='resize-none min-h-[120px]'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Décrivez les caractéristiques principales et les avantages
                    de votre produit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='specifications'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>
                      Spécifications techniques
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Entrez les spécifications (une par ligne)'
                        className='resize-none min-h-[100px]'
                        value={
                          Array.isArray(field.value)
                            ? field.value.join('\n')
                            : ''
                        }
                        onChange={(e) => {
                          const lines = e.target.value
                            .split('\n')
                            .filter((line) => line.trim() !== '')
                          field.onChange(lines)
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Une spécification par ligne. Sera affiché sous forme de
                      liste à puces.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='compatibility'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>
                      Compatibilité
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Entrez les informations de compatibilité (une par ligne)'
                        className='resize-none min-h-[100px]'
                        value={
                          Array.isArray(field.value)
                            ? field.value.join('\n')
                            : ''
                        }
                        onChange={(e) => {
                          const lines = e.target.value
                            .split('\n')
                            .filter((line) => line.trim() !== '')
                          field.onChange(lines)
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Une information par ligne. Sera affiché sous forme de
                      liste à puces.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        {/* Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Settings className='h-5 w-5 text-slate-600' />
              Paramètres de publication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name='isPublished'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel className='text-sm font-medium'>
                      Publier le produit
                    </FormLabel>
                    <FormDescription className='text-xs'>
                      Le produit sera visible sur le site web une fois publié.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className='flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700'>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200'
          >
            {form.formState.isSubmitting ? (
              <div className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                Création en cours...
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <CheckCircle className='h-5 w-5' />
                {type === 'Create'
                  ? 'Créer le produit'
                  : 'Mettre à jour le produit'}
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm
