'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { createCategory } from '@/lib/actions/category.actions'

interface CategoryFormSimpleProps {
  categoryId?: string
}

export function CategoryFormSimple({ categoryId }: CategoryFormSimpleProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true,
    sortOrder: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await createCategory(formData)
      
      if (result.success) {
        toast({
          title: 'Succès',
          description: 'Catégorie créée avec succès',
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
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle catégorie</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nom de la catégorie *</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='Ex: Ordinateurs portables'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='slug'>Slug *</Label>
            <Input
              id='slug'
              name='slug'
              value={formData.slug}
              onChange={handleInputChange}
              placeholder='Ex: ordinateurs-portables'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              placeholder='Description de la catégorie...'
              className='w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='sortOrder'>Ordre d'affichage</Label>
            <Input
              id='sortOrder'
              name='sortOrder'
              type='number'
              min='0'
              value={formData.sortOrder}
              onChange={handleInputChange}
            />
          </div>

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
              {isLoading ? 'Enregistrement...' : 'Créer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
