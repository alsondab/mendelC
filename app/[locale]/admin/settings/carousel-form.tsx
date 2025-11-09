import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ISettingInput } from '@/types'
import { TrashIcon } from 'lucide-react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import ImageUpload from '@/components/shared/image-upload'

export default function CarouselForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'carousels',
  })
  const {
    formState: { errors },
  } = form
  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>Carrousels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border rounded-lg space-y-4 bg-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Carrousel {index + 1}</h3>
                <Button
                  type="button"
                  disabled={fields.length === 1}
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`carousels.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Titre du carrousel" />
                      </FormControl>
                      <FormMessage>
                        {errors.carousels?.[index]?.title?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`carousels.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de destination</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage>
                        {errors.carousels?.[index]?.url?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* ⚡ Optimization: Utilisation du composant ImageUpload pour meilleure UX */}
                <FormField
                  control={form.control}
                  name={`carousels.${index}.image`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Image du carrousel</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          endpoint="carouselImageUploader"
                          maxSize="8MB"
                          aspectRatio="carousel"
                          label="Image bannière (ratio 16:6 recommandé)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant={'outline'}
            onClick={() =>
              append({ url: '', title: '', image: '', buttonCaption: '' })
            }
          >
            Ajouter un carrousel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
