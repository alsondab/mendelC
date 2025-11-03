import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ISettingInput } from '@/types'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import ImageUpload from '@/components/shared/image-upload'

export default function SiteInfoForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const { control } = form

  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>Informations du site</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={control}
            name='site.name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder='Entrez le nom du site' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='site.url'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder='Enter url' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col gap-5 md:flex-row'>
          {/* ⚡ Optimization: Utilisation du composant ImageUpload pour le logo */}
          <FormField
            control={control}
            name='site.logo'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Logo du site</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    endpoint='logoUploader'
                    maxSize='2MB'
                    aspectRatio='logo'
                    label='Logo (format carré recommandé)'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='site.description'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter description'
                    className='h-40'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={control}
            name='site.slogan'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Slogan</FormLabel>
                <FormControl>
                  <Input placeholder='Enter slogan name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='site.keywords'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Mots-clés</FormLabel>
                <FormControl>
                  <Input placeholder='Enter keywords' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={control}
            name='site.phone'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder='Enter phone number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='site.email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email address' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={control}
            name='site.address'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder='Enter address' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='site.copyright'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Copyright</FormLabel>
                <FormControl>
                  <Input placeholder='Enter copyright' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
