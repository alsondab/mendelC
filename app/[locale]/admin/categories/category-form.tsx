'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import Image from 'next/image'
import { Upload, Trash2 } from 'lucide-react'

const categorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
  description: z.string().optional(),
  image: z.string().optional(),
  parentCategory: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().min(0).default(0),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  categoryId?: string
}

export function CategoryForm({ categoryId }: CategoryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [parentCategories, setParentCategories] = useState<ICategory[]>([])
  const [isEditMode] = useState(!!categoryId)
  const [uploadedImage, setUploadedImage] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
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
  useEffect(() => {
    if (categoryId) {
      const loadCategory = async () => {
        try {
          const category = await getCategoryById(categoryId)
          if (category) {
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
            if (category.image) {
              setUploadedImage(category.image)
            }
          }
        } catch (error) {
          console.error('Error loading category:', error)
          toast({
            title: 'Erreur',
            description: 'Impossible de charger la catégorie',
            variant: 'destructive',
          })
        }
      }
      loadCategory()
    }
  }, [categoryId, reset])

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
          title: 'Succès',
          description: isEditMode
            ? 'Catégorie mise à jour avec succès'
            : 'Catégorie créée avec succès',
        })
        router.push('/admin/categories')
        router.refresh()
      } else {
        toast({
          title: 'Erreur',
          description: result.message,
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
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
              <CardTitle>Informations de base</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Nom de la catégorie *</Label>
                <Input
                  id='name'
                  {...register('name')}
                  placeholder='Ex: Ordinateurs portables'
                />
                {errors.name && (
                  <p className='text-sm text-destructive'>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='slug'>Slug *</Label>
                <Input
                  id='slug'
                  {...register('slug')}
                  placeholder='Ex: ordinateurs-portables'
                />
                {errors.slug && (
                  <p className='text-sm text-destructive'>
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  {...register('description')}
                  placeholder='Description de la catégorie...'
                  rows={3}
                />
                {errors.description && (
                  <p className='text-sm text-destructive'>
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className='space-y-4'>
                <Label htmlFor='image'>Image de la catégorie</Label>

                {/* Upload Section */}
                <div className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors'>
                  <Upload className='h-8 w-8 mx-auto text-muted-foreground mb-2' />
                  <p className='text-sm text-muted-foreground mb-4'>
                    Glissez-déposez votre image ou cliquez pour sélectionner
                  </p>
                  <UploadButton
                    endpoint='imageUploader'
                    onClientUploadComplete={(res: { url: string }[]) => {
                      const imageUrl = res[0].url
                      setUploadedImage(imageUrl)
                      setValue('image', imageUrl)
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
                </div>

                {/* Image Preview */}
                {(uploadedImage || watch('image')) && (
                  <div className='space-y-2'>
                    <Label>Aperçu de l&apos;image</Label>
                    <div className='relative w-full h-48 rounded-lg overflow-hidden border'>
                      {(uploadedImage || watch('image')) &&
                      (uploadedImage || watch('image')).trim() !== '' ? (
                        <Image
                          src={uploadedImage || watch('image')}
                          alt='Aperçu de la catégorie'
                          fill
                          className='object-cover'
                          sizes='(max-width: 768px) 100vw, 50vw'
                        />
                      ) : (
                        <div className='w-full h-full bg-muted flex items-center justify-center'>
                          <span className='text-muted-foreground'>
                            Aucune image
                          </span>
                        </div>
                      )}
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        className='absolute top-2 right-2'
                        onClick={() => {
                          setUploadedImage('')
                          setValue('image', '')
                        }}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Manual URL Input */}
                <div className='space-y-2'>
                  <Label htmlFor='image'>
                    Ou saisissez une URL d&apos;image
                  </Label>
                  <Input
                    id='image'
                    {...register('image')}
                    placeholder="URL de l'image"
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
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='parentCategory'>Catégorie parent</Label>
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
                    <SelectValue placeholder='Sélectionner une catégorie parent' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>
                      Aucune (catégorie principale)
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
                <Label htmlFor='sortOrder'>Ordre d&apos;affichage</Label>
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
                <Label htmlFor='isActive'>Catégorie active</Label>
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
              Annuler
            </Button>
            <Button type='submit' disabled={isLoading} className='flex-1'>
              {isLoading
                ? 'Enregistrement...'
                : isEditMode
                  ? 'Mettre à jour'
                  : 'Créer'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
