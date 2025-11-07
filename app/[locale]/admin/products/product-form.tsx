'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
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
import {
  getAllMainCategories,
  getCategoryTree,
} from '@/lib/actions/category.actions'
import { getGlobalStockThresholds } from '@/lib/actions/setting.actions'
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
  UploadCloud,
  X,
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
        minStockLevel: 5,
        maxStockLevel: 100,
        isLowStock: false,
        isOutOfStock: false,
        lastStockUpdate: new Date(),
        stockStatus: 'in_stock',
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
        minStockLevel: 5,
        maxStockLevel: 100,
        isLowStock: false,
        isOutOfStock: false,
        lastStockUpdate: new Date(),
        stockStatus: 'in_stock',
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
  onSuccess,
}: {
  type: 'Create' | 'Update'
  product?: IProduct
  productId?: string
  onSuccess?: () => void
}) => {
  const router = useRouter()
  const t = useTranslations('Admin.ProductForm')
  const tProductsList = useTranslations('Admin.ProductsList')
  const [categories, setCategories] = useState<ICategory[]>([])
  const [subCategories, setSubCategories] = useState<ICategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const form = useForm<IProductInput>({
    resolver:
      type === 'Update'
        ? zodResolver(ProductUpdateSchema)
        : zodResolver(ProductInputSchema),
    defaultValues: productDefaultValues,
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

  // Charger les sous-catégories quand une catégorie est sélectionnée
  useEffect(() => {
    const loadSubCategories = async () => {
      if (selectedCategory) {
        try {
          const categoryTree = await getCategoryTree()
          const parentCategory = categoryTree.find(
            (cat) => cat.name === selectedCategory
          )
          if (parentCategory && parentCategory.subCategories) {
            setSubCategories(parentCategory.subCategories)
          } else {
            setSubCategories([])
          }
        } catch (error) {
          console.error('Error loading sub-categories:', error)
          setSubCategories([])
        }
      } else {
        setSubCategories([])
      }
    }
    loadSubCategories()
  }, [selectedCategory])

  // Initialiser selectedCategory et réinitialiser le formulaire pour l'édition
  useEffect(() => {
    if (product && type === 'Update') {
      setSelectedCategory(product.category || '')
      // Réinitialiser le formulaire avec les données du produit
      // Convertir lastStockUpdate en Date si c'est une string
      const productData = {
        ...product,
        lastStockUpdate: product.lastStockUpdate
          ? product.lastStockUpdate instanceof Date
            ? product.lastStockUpdate
            : new Date(product.lastStockUpdate)
          : new Date(),
        // S'assurer que toutes les valeurs optionnelles sont définies
        images: product.images || [],
        tags: product.tags || [],
        colors: product.colors || [],
        specifications: product.specifications || [],
        compatibility: product.compatibility || [],
        ratingDistribution: product.ratingDistribution || [],
        reviews: product.reviews || [],
      }
      form.reset(productData)
    }
  }, [product, type, form])

  // Charger les seuils globaux pour les valeurs par défaut lors de la création
  useEffect(() => {
    const loadGlobalThresholds = async () => {
      // Seulement lors de la création et si les valeurs par défaut sont encore les valeurs hardcodées
      if (type === 'Create') {
        try {
          const result = await getGlobalStockThresholds()
          if (result.success && result.thresholds) {
            const { globalLowStockThreshold } = result.thresholds

            // Mettre à jour les valeurs par défaut du formulaire
            // Seulement si les valeurs actuelles sont les valeurs hardcodées (5 et 100)
            const currentMinStock = form.getValues('minStockLevel')
            const currentMaxStock = form.getValues('maxStockLevel')

            if (currentMinStock === 5 && currentMaxStock === 100) {
              form.setValue('minStockLevel', globalLowStockThreshold)
              // Utiliser 20x le seuil faible comme max par défaut
              form.setValue(
                'maxStockLevel',
                globalLowStockThreshold * 20 || 100
              )
            }
          }
        } catch (error) {
          console.error('Erreur lors du chargement des seuils globaux:', error)
          // Continuer avec les valeurs par défaut hardcodées en cas d'erreur
        }
      }
    }

    loadGlobalThresholds()
  }, [type, form])

  async function onSubmit(values: IProductInput) {
    try {
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
          if (onSuccess) {
            onSuccess()
          } else {
            router.push(`/admin/products`)
          }
        }
      }

      if (type === 'Update') {
        if (!productId) {
          toast({
            variant: 'destructive',
            description: tProductsList('MissingProductId'),
          })
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
          toast({
            description: res.message,
          })
          if (onSuccess) {
            onSuccess()
          } else {
            // Recharger la page pour afficher les modifications
            router.refresh()
          }
        }
      }
    } catch (error) {
      console.error('Error in onSubmit:', error)
      toast({
        variant: 'destructive',
        description: tProductsList('FormSubmissionError'),
      })
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
              <Tag className='h-5 w-5 text-amber-500' />
              {t('BasicInformation')}
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
                      {t('ProductName')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('EnterProductName')}
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
                      {t('SlugURL')}
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder={t('ProductSlugPlaceholder')}
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
                          {t('Generate')}
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
                      {t('Category')}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedCategory(value)
                        // Réinitialiser la sous-catégorie quand on change de catégorie
                        form.setValue('subCategory', '')
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='h-11'>
                          <SelectValue placeholder={t('SelectCategory')} />
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
                name='subCategory'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>
                      {t('SubCategory')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedCategory || subCategories.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger className='h-11'>
                          <SelectValue
                            placeholder={
                              !selectedCategory
                                ? t('SelectCategoryFirst')
                                : subCategories.length === 0
                                  ? t('NoSubCategoriesAvailable')
                                  : t('SelectSubCategory')
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subCategories.map((subCategory) => (
                          <SelectItem
                            key={subCategory._id}
                            value={subCategory.name}
                          >
                            {subCategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='brand'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>
                      {t('Brand')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('EnterBrand')}
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
              <DollarSign className='h-5 w-5 text-amber-500' />
              {t('PricingStock')}
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
                      {t('ListPrice')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder={t('PricePlaceholder')}
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
                      {t('SalePrice')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder={t('PricePlaceholder')}
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
                      {t('AvailableStock')}
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

              {/* 🚀 NOUVEAUX CHAMPS POUR LA GESTION DES STOCKS */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='minStockLevel'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        {t('AlertThreshold')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='5'
                          className='h-11'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className='text-xs'>
                        {t('AlertThresholdDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='maxStockLevel'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        {t('MaxStockRecommended')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='100'
                          className='h-11'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className='text-xs'>
                        {t('MaxStockDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images Section - Design moderne et structuré */}
        <Card>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                <ImageIcon className='h-5 w-5 text-amber-500' />
                {t('ProductImages')}
              </CardTitle>
              {images.length > 0 && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    form.setValue('images', [])
                    toast({
                      description: t('AllImagesRemoved'),
                    })
                  }}
                  className='text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900'
                >
                  <Trash2 className='h-4 w-4 mr-1.5' />
                  {t('RemoveAll')}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            <FormField
              control={form.control}
              name='images'
              render={() => (
                <FormItem>
                  {/* Zone d'upload drag & drop moderne */}
                  <div className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 sm:p-8 transition-all hover:border-primary/50 hover:bg-muted/30 group'>
                    <div className='flex flex-col items-center justify-center space-y-4'>
                      {/* Icône UploadCloud */}
                      <div className='rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors'>
                        <UploadCloud className='h-8 w-8 text-amber-500' />
                      </div>

                      {/* Texte et bouton */}
                      <div className='text-center space-y-2'>
                        <p className='text-sm font-medium text-foreground'>
                          {t('AddImage')}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {t('MaxSize')}
                        </p>
                      </div>

                      {/* Bouton UploadButton stylisé */}
                      <div className='w-full max-w-[200px]'>
                        <UploadButton
                          endpoint='imageUploader'
                          onClientUploadComplete={(res: { url: string }[]) => {
                            if (res && res[0]?.url) {
                              form.setValue('images', [...images, res[0].url])
                              toast({
                                description: t('ImageUploadedSuccess'),
                              })
                            }
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: 'destructive',
                              description: `Erreur d'upload: ${error.message}`,
                            })
                          }}
                          content={{
                            button: ({ ready }) => (
                              <span className='text-sm font-medium'>
                                {ready ? t('ChooseFile') : t('Loading')}
                              </span>
                            ),
                            allowedContent: t('MaxSize'),
                          }}
                          className='ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:text-white ut-button:hover:bg-primary/90'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grille d'aperçu des images - Design moderne */}
                  {images.length > 0 && (
                    <div className='mt-6 space-y-4'>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium text-muted-foreground'>
                          {images.length} image{images.length > 1 ? 's' : ''}{' '}
                          uploadée{images.length > 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Grille responsive avec cartes stylées */}
                      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                        {images
                          .filter((image) => image && image.trim() !== '')
                          .map((image: string, index: number) => (
                            <div
                              key={`${image}-${index}`}
                              className='relative group aspect-square rounded-lg overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]'
                            >
                              <Image
                                src={image}
                                alt={`Image ${index + 1}`}
                                fill
                                className='object-cover'
                                sizes='(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw'
                                loading='lazy'
                                quality={75}
                                decoding='async'
                              />

                              {/* Overlay avec bouton de suppression au hover */}
                              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center'>
                                <Button
                                  type='button'
                                  variant='destructive'
                                  size='sm'
                                  className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg'
                                  onClick={() => {
                                    const newImages = images.filter(
                                      (_, i) => i !== index
                                    )
                                    form.setValue('images', newImages)
                                    toast({
                                      description: 'Image supprimée',
                                    })
                                  }}
                                  aria-label={`Supprimer l'image ${index + 1}`}
                                >
                                  <X className='h-4 w-4 mr-1' />
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
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
              <FileText className='h-5 w-5 text-amber-500' />
              {t('ContentDescriptions')}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>
                    {t('ProductDescription')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('DescribeProductDetail')}
                      className='resize-none min-h-[120px]'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t('DescriptionHelp')}</FormDescription>
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
                      {t('TechnicalSpecs')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('SpecsPlaceholder')}
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
                    <FormDescription>{t('SpecsDescription')}</FormDescription>
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
                      {t('Compatibility')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('CompatibilityPlaceholder')}
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
                      {t('CompatibilityDescription')}
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
              <Settings className='h-5 w-5 text-amber-500' />
              {t('PublicationSettings')}
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
                      {t('PublishProduct')}
                    </FormLabel>
                    <FormDescription className='text-xs'>
                      {t('PublishProductDescription')}
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
            onClick={async (e) => {
              e.preventDefault()

              // Forcer la validation du formulaire
              const isValid = await form.trigger()

              if (isValid) {
                const values = form.getValues()
                await onSubmit(values)
              } else {
                toast({
                  variant: 'destructive',
                  description: t('CorrectFormErrors'),
                })
              }
            }}
            className='flex-1 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200'
          >
            {form.formState.isSubmitting ? (
              <div className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                {type === 'Create'
                  ? t('Creating')
                  : t('Updating')}
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <CheckCircle className='h-5 w-5' />
                {type === 'Create'
                  ? t('CreateProduct')
                  : t('UpdateProduct')}
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm
