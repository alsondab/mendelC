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
import { UploadCloud, Trash2, X } from 'lucide-react'
import Image from 'next/image'

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

              {/* ⚡ Optimization: Section Image de Catégorie - Design moderne identique aux produits */}
              <div className='space-y-4'>
                {/* Header avec titre */}
                <div className='flex items-center gap-2 mb-2'>
                  <Label className='text-base font-semibold'>
                    {t('CategoryImage')}
                  </Label>
                </div>

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
                        Ajouter une image
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Taille max : 4MB
                      </p>
                    </div>

                    {/* Bouton UploadButton stylisé */}
                    <div className='w-full max-w-[200px]'>
                      <UploadButton
                        endpoint='imageUploader'
                        onClientUploadComplete={(res: { url: string }[]) => {
                          if (res && res[0]?.url) {
                            setUploadedImage(res[0].url)
                            setValue('image', res[0].url, {
                              shouldValidate: true,
                            })
                            toast({
                              description: 'Image uploadée avec succès !',
                            })
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast({
                            variant: 'destructive',
                            description: `Erreur d&apos;upload: ${error.message}`,
                          })
                        }}
                        content={{
                          button: ({ ready }) => (
                            <span className='text-sm font-medium'>
                              {ready ? 'Choisir un fichier' : 'Chargement...'}
                            </span>
                          ),
                          allowedContent: 'Taille max 4MB',
                        }}
                        className='ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:text-white ut-button:hover:bg-primary/90'
                      />
                    </div>
                  </div>
                </div>

                {/* Aperçu de l'image uploadée - Design moderne */}
                {(watch('image')?.trim() || uploadedImage?.trim()) && (
                  <div className='mt-6 space-y-4'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Image uploadée
                      </p>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setUploadedImage('')
                          setValue('image', '', { shouldValidate: true })
                          toast({
                            description: 'Image supprimée',
                          })
                        }}
                        className='text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900'
                      >
                        <Trash2 className='h-4 w-4 mr-1.5' />
                        Supprimer
                      </Button>
                    </div>

                    {/* Carte stylée pour l'aperçu */}
                    <div className='relative group aspect-square max-w-[300px] rounded-lg overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]'>
                      <Image
                        src={watch('image') || uploadedImage || ''}
                        alt='Image de catégorie'
                        fill
                        className='object-cover'
                        sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 300px'
                        loading='lazy'
                        quality={60}
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
                            setUploadedImage('')
                            setValue('image', '', { shouldValidate: true })
                            toast({
                              description: 'Image supprimée',
                            })
                          }}
                          aria-label="Supprimer l'image"
                        >
                          <X className='h-4 w-4 mr-1' />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Input URL manuel (optionnel) */}
                <div className='space-y-2 pt-2 border-t border-muted'>
                  <Label
                    htmlFor='image-url'
                    className='text-sm text-muted-foreground'
                  >
                    {t('OrEnterImageUrl')} (optionnel)
                  </Label>
                  <Input
                    id='image-url'
                    {...register('image')}
                    placeholder={t('ImageUrl')}
                    onChange={(e) => {
                      const url = e.target.value
                      setUploadedImage(url)
                      setValue('image', url)
                    }}
                    className='text-sm'
                  />
                  {errors.image && (
                    <p className='text-xs text-destructive'>
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
