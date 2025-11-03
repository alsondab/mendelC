/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { ISettingInput } from '@/types'
import { TrashIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

export default function DeliveryDateForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'availableDeliveryDates',
  })
  const {
    setValue,
    watch,
    control,
    formState: { errors },
  } = form

  const availableDeliveryDates = watch('availableDeliveryDates')
  const defaultDeliveryDate = watch('defaultDeliveryDate')

  useEffect(() => {
    const validCodes = availableDeliveryDates.map((lang) => lang.name)
    if (!validCodes.includes(defaultDeliveryDate)) {
      setValue('defaultDeliveryDate', '')
    }
  }, [JSON.stringify(availableDeliveryDates)])

  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>Dates de livraison</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='p-3 bg-muted rounded-md mb-4'>
          <p className='text-sm text-muted-foreground'>
            <strong>Note importante :</strong> Les prix doivent être saisis en{' '}
            <strong>CFA</strong> (ex: 2000 pour 2000 CFA, 5000 pour 5000 CFA).
            Les noms doivent être en français (ex: &quot;Demain&quot;,
            &quot;Dans 3 jours&quot;, &quot;Dans 5 jours&quot;).
          </p>
        </div>
        <div className='space-y-4'>
          {fields.map((field, index) => (
            <div key={field.id} className='flex gap-2'>
              <FormField
                control={form.control}
                name={`availableDeliveryDates.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    {index == 0 && <FormLabel>Nom</FormLabel>}
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Ex: Demain, Dans 3 jours, Dans 5 jours'
                      />
                    </FormControl>
                    <FormMessage>
                      {errors.availableDeliveryDates?.[index]?.name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`availableDeliveryDates.${index}.daysToDeliver`}
                render={({ field }) => (
                  <FormItem>
                    {index == 0 && <FormLabel>Jours</FormLabel>}
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        placeholder='1'
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage>
                      {
                        errors.availableDeliveryDates?.[index]?.daysToDeliver
                          ?.message
                      }
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`availableDeliveryDates.${index}.shippingPrice`}
                render={({ field }) => (
                  <FormItem>
                    {index == 0 && (
                      <FormLabel>Prix de livraison (CFA)</FormLabel>
                    )}
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type='number'
                          {...field}
                          placeholder='2000'
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className='pr-16'
                          value={field.value || ''}
                        />
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                          CFA
                        </span>
                      </div>
                    </FormControl>
                    {field.value > 0 && (
                      <FormDescription className='text-xs'>
                        {field.value.toLocaleString('fr-FR')} CFA
                      </FormDescription>
                    )}
                    <FormMessage>
                      {
                        errors.availableDeliveryDates?.[index]?.shippingPrice
                          ?.message
                      }
                    </FormMessage>
                  </FormItem>
                )}
              />
              <div>
                {index == 0 && <div className=''>Action</div>}
                <Button
                  type='button'
                  disabled={fields.length === 1}
                  variant='outline'
                  className={index == 0 ? 'mt-2' : ''}
                  onClick={() => {
                    remove(index)
                  }}
                >
                  <TrashIcon className='w-4 h-4' />
                </Button>
              </div>{' '}
            </div>
          ))}

          <Button
            type='button'
            variant={'outline'}
            onClick={() =>
              append({
                name: '',
                daysToDeliver: 0,
                shippingPrice: 0,
              })
            }
          >
            Ajouter une date de livraison
          </Button>
        </div>

        <FormField
          control={control}
          name='defaultDeliveryDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de livraison par défaut</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Sélectionner une date de livraison' />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDeliveryDates
                      .filter((x) => x.name)
                      .map((deliveryDate, index) => (
                        <SelectItem key={index} value={deliveryDate.name}>
                          {deliveryDate.name}
                          {deliveryDate.shippingPrice > 0 && (
                            <span className='ml-2 text-xs text-muted-foreground'>
                              ({deliveryDate.shippingPrice.toLocaleString(
                                'fr-FR'
                              )}{' '}
                              CFA)
                            </span>
                          )}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage>{errors.defaultDeliveryDate?.message}</FormMessage>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
