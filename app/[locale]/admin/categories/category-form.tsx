'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import {
  createCategory,
  updateCategory,
  getCategoryById,
} from '@/lib/actions/category.actions'
import { getAllMainCategories } from '@/lib/actions/category.actions'
import { ICategory } from '@/types'
import { toSlug } from '@/lib/utils'
import { UploadButton } from '@/lib/uploadthing'
import { Upload, Trash2 } from 'lucide-react'

// Composant pour l'aperçu d'image avec gestion d'erreur
function ImagePreviewComponent({
  imageSrc,
  t,
}: {
  imageSrc: string | undefined
  t: (key: string) => string
}) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    // Reset states when image source changes
    setImageError(false)
    setImageLoaded(false)
  }, [imageSrc])

  if (!imageSrc || imageSrc.trim() === '') {
    return (
      <div className='w-full h-full bg-muted flex items-center justify-center'>
        <span className='text-muted-foreground'>{t('NoImage')}</span>
      </div>
    )
  }

  if (imageError) {
    return (
      <div className='w-full h-full bg-muted flex flex-col items-center justify-center gap-2 p-4'>
        <span className='text-muted-foreground text-sm text-center'>
          {t('NoImage')}
        </span>
        <span className='text-xs text-muted-foreground/70 break-all text-center'>
          {imageSrc}
        </span>
      </div>
    )
  }

  // Utiliser une balise img normale pour toutes les images (plus fiable)
  return (
    <>
      {!imageLoaded && (
        <div className='absolute inset-0 bg-muted flex items-center justify-center'>
          <span className='text-muted-foreground text-xs'>Chargement...</span>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={t('ImagePreview')}
        className={`w-full h-full object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onError={() => {
          // Gérer l'erreur silencieusement - ne pas logger pour éviter les erreurs console
          setImageError(true)
          setImageLoaded(false)
        }}
        onLoad={() => {
          setImageError(false)
          setImageLoaded(true)
        }}
        loading='lazy'
      />
    </>
  )
}

interface CategoryFormProps {
  categoryId?: string
  category?: ICategory
  onSuccess?: () => void
}

export function CategoryForm({
  categoryId,
  category,
  onSuccess,
}: CategoryFormProps) {
  const t = useTranslations('Admin.CategoryForm')

  const getCategorySchema = () =>
    z.object({
      name: z.string().min(1, t('NameRequired')),
      slug: z.string().min(1, t('SlugRequired')),
      description: z.string().optional(),
      image: z.string().optional(),
      parentCategory: z.string().optional(),
      isActive: z.boolean().default(true),
      sortOrder: z.number().min(0).default(0),
    })

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [parentCategories, setParentCategories] = useState<ICategory[]>([])
  const [isEditMode] = useState(!!categoryId)
  const [uploadedImage, setUploadedImage] = useState<string>('')

  type CategoryFormData = z.infer<ReturnType<typeof getCategorySchema>>

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(getCategorySchema()),
    defaultValues: {
      isActive: true,
      sortOrder: 0,
    },
  })

  const watchedName = watch('name')

  // Auto-generate slug from name
  useEffect(() => {
    if (watchedName && !isEditMode) {
      setValue('slug', toSlug(watchedName))
    }
  }, [watchedName, setValue, isEditMode])

  // Load parent categories
  useEffect(() => {
    const loadParentCategories = async () => {
      try {
        const categories = await getAllMainCategories()
        setParentCategories(categories)
      } catch (error) {
        console.error('Error loading parent categories:', error)
      }
    }
    loadParentCategories()
  }, [])

  // Load category data for editing
  // Si category est fourni (depuis le dialog), l'utiliser directement
  // Sinon, charger depuis categoryId
  useEffect(() => {
    if (category) {
      // Catégorie fournie directement (depuis le dialog)
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image || '',
        parentCategory: category.parentCategory || '',
        isActive: category.isActive,
        sortOrder: category.sortOrder,
      })
      // Set the uploaded image state if there's an existing image
      // C'est important pour que l'aperçu s'affiche immédiatement
      if (category.image && category.image.trim() !== '') {
        setUploadedImage(category.image)
        setValue('image', category.image, { shouldValidate: false })
      } else {
        setUploadedImage('')
      }
    } else if (categoryId) {
      // Charger la catégorie depuis l'API
      const loadCategory = async () => {
        try {
          const loadedCategory = await getCategoryById(categoryId)
          if (loadedCategory) {
            reset({
              name: loadedCategory.name,
              slug: loadedCategory.slug,
              description: loadedCategory.description || '',
              image: loadedCategory.image || '',
              parentCategory: loadedCategory.parentCategory || '',
              isActive: loadedCategory.isActive,
              sortOrder: loadedCategory.sortOrder,
            })
            if (loadedCategory.image && loadedCategory.image.trim() !== '') {
              setUploadedImage(loadedCategory.image)
              setValue('image', loadedCategory.image, { shouldValidate: false })
            } else {
              setUploadedImage('')
            }
          }
        } catch (error) {
          console.error('Error loading category:', error)
          toast({
            title: t('Error'),
            description: t('ErrorLoadingCategory'),
            variant: 'destructive',
          })
        }
      }
      loadCategory()
    } else {
      // Pas de catégorie, réinitialiser
      setUploadedImage('')
    }
  }, [category, categoryId, reset, setValue, t])

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true)
    try {
      // Nettoyer les données : convertir les chaînes vides en undefined
      const cleanData = {
        ...data,
        parentCategory:
          data.parentCategory === '' ? undefined : data.parentCategory,
      }

      let result
      if (isEditMode && categoryId) {
        result = await updateCategory({
          _id: categoryId,
          ...cleanData,
        })
      } else {
        result = await createCategory(cleanData)
      }

      if (result.success) {
        toast({
          title: t('Success'),
          description: isEditMode ? t('CategoryUpdated') : t('CategoryCreated'),
        })
        // Si onSuccess est fourni, l'appeler (cas du dialog)
        // Sinon, rediriger vers la page des catégories (cas de la page normale)
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/admin/categories')
          router.refresh()
        }
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
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Main Form */}
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>{t('BasicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>{t('CategoryName')} *</Label>
                <Input
                  id='name'
                  {...register('name')}
                  placeholder={t('CategoryNamePlaceholder')}
                />
                {errors.name && (
                  <p className='text-sm text-destructive'>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='slug'>{t('Slug')} *</Label>
                <Input
                  id='slug'
                  {...register('slug')}
                  placeholder={t('SlugPlaceholder')}
                />
                {errors.slug && (
                  <p className='text-sm text-destructive'>
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>{t('Description')}</Label>
                <Textarea
                  id='description'
                  {...register('description')}
                  placeholder={t('DescriptionPlaceholder')}
                  rows={3}
                />
                {errors.description && (
                  <p className='text-sm text-destructive'>
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className='space-y-4'>
                <Label htmlFor='image'>{t('CategoryImage')}</Label>

                {/* Upload Section */}
                <div className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors'>
                  <Upload className='h-8 w-8 mx-auto text-muted-foreground mb-2' />
                  <p className='text-sm text-muted-foreground mb-4'>
                    {t('DragDropImage')}
                  </p>
                  <UploadButton
                    endpoint='imageUploader'
                    onClientUploadComplete={(res: { url: string }[]) => {
                      if (res && res.length > 0 && res[0].url) {
                        const imageUrl = res[0].url
                        console.log('Image uploaded successfully:', imageUrl)
                        setUploadedImage(imageUrl)
                        setValue('image', imageUrl, { shouldValidate: true })
                        toast({
                          description: t('ImageUploaded'),
                        })
                      }
                    }}
                    onUploadError={(error: Error) => {
                      console.error('Upload error:', error)
                      toast({
                        variant: 'destructive',
                        description: t('UploadError', { error: error.message }),
                      })
                    }}
                  />
                </div>

                {/* Image Preview - Toujours afficher si uploadedImage ou watch('image') a une valeur */}
                {(() => {
                  const currentImage = uploadedImage || watch('image') || ''
                  const hasImage = currentImage && currentImage.trim() !== ''

                  if (!hasImage) return null

                  return (
                    <div className='space-y-2'>
                      <Label>{t('ImagePreview')}</Label>
                      <div className='relative w-full h-48 rounded-lg overflow-hidden border bg-muted'>
                        <ImagePreviewComponent imageSrc={currentImage} t={t} />
                        <Button
                          type='button'
                          variant='destructive'
                          size='sm'
                          className='absolute top-2 right-2 z-10'
                          onClick={() => {
                            setUploadedImage('')
                            setValue('image', '')
                          }}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  )
                })()}

                {/* Manual URL Input */}
                <div className='space-y-2'>
                  <Label htmlFor='image'>{t('OrEnterImageUrl')}</Label>
                  <Input
                    id='image'
                    {...register('image')}
                    placeholder={t('ImageUrl')}
                    onChange={(e) => {
                      setUploadedImage('')
                      setValue('image', e.target.value)
                    }}
                  />
                  {errors.image && (
                    <p className='text-sm text-destructive'>
                      {errors.image.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>{t('Configuration')}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='parentCategory'>{t('ParentCategory')}</Label>
                <Select
                  onValueChange={(value) =>
                    setValue(
                      'parentCategory',
                      value === 'none' ? undefined : value
                    )
                  }
                  defaultValue={watch('parentCategory') || 'none'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('SelectParentCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>
                      {t('NoneMainCategory')}
                    </SelectItem>
                    {parentCategories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='sortOrder'>{t('DisplayOrder')}</Label>
                <Input
                  id='sortOrder'
                  type='number'
                  min='0'
                  {...register('sortOrder', { valueAsNumber: true })}
                />
                {errors.sortOrder && (
                  <p className='text-sm text-destructive'>
                    {errors.sortOrder.message}
                  </p>
                )}
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='isActive'
                  checked={watch('isActive')}
                  onCheckedChange={(checked: boolean) =>
                    setValue('isActive', checked)
                  }
                />
                <Label htmlFor='isActive'>{t('CategoryActive')}</Label>
              </div>
            </CardContent>
          </Card>

          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.push('/admin/categories')}
              className='flex-1'
            >
              {t('Cancel')}
            </Button>
            <Button type='submit' disabled={isLoading} className='flex-1'>
              {isLoading ? t('Saving') : isEditMode ? t('Update') : t('Create')}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
