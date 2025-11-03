import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { COLORS, THEMES } from '@/lib/constants'
import { ISettingInput } from '@/types'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

export default function CommonForm({
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
        <CardTitle>Paramètres généraux</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={control}
            name='common.pageSize'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Taille de page</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Entrez la taille de page'
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Nombre de produits affichés par page dans les listes (ex: liste
                  produits, résultats de recherche)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={control}
            name='common.defaultColor'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Couleur par défaut</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ''}
                    onValueChange={(value) => field.onChange(value)}
                    disabled
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a color' />
                    </SelectTrigger>
                    <SelectContent>
                      {COLORS.map((color, index) => (
                        <SelectItem key={index} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Non configurable - Couleur or/jaune fixe
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='common.defaultTheme'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Thème par défaut</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ''}
                    onValueChange={(value) => field.onChange(value)}
                    disabled
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a theme' />
                    </SelectTrigger>
                    <SelectContent>
                      {THEMES.map((theme, index) => (
                        <SelectItem key={index} value={theme}>
                          {theme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  À implémenter dans une version ultérieure
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={control}
            name='common.isMaintenanceMode'
            render={({ field }) => (
              <FormItem className='space-x-2 items-center'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled
                  />
                </FormControl>
                <div className='space-y-1'>
                  <FormLabel>Mode maintenance</FormLabel>
                  <FormDescription>
                    À implémenter dans une version ultérieure
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
