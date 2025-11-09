'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { AddressInputSchema } from '@/lib/validator'
import { IAddress, IAddressInput } from '@/types'
import { createAddress, updateAddress } from '@/lib/actions/address.actions'
import { useTranslations } from 'next-intl'

interface AddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address?: IAddress | null
  mode: 'create' | 'edit'
}

export default function AddressDialog({
  open,
  onOpenChange,
  address,
  mode,
}: AddressDialogProps) {
  const t = useTranslations('Address')

  const form = useForm<IAddressInput>({
    resolver: zodResolver(AddressInputSchema),
    defaultValues: {
      fullName: '',
      street: '',
      city: '',
      province: '',
      postalCode: '',
      country: "Côte d'Ivoire",
      phone: '',
      isDefault: false,
    },
  })

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (mode === 'edit' && address) {
      // Extraire les 10 chiffres du numéro (enlever +225 si présent)
      let phoneDisplay = address.phone.replace(/\s/g, '')
      if (phoneDisplay.startsWith('+225')) {
        phoneDisplay = phoneDisplay.replace('+225', '')
      }
      // Formater avec espaces pour l'affichage (ex: 07 10 14 58 64)
      const formattedPhone = phoneDisplay
        .replace(/(\d{2})(?=\d)/g, '$1 ')
        .trim()

      form.reset({
        fullName: address.fullName,
        street: address.street,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        country: address.country,
        phone: formattedPhone,
        isDefault: address.isDefault,
      })
    } else {
      form.reset({
        fullName: '',
        street: '',
        city: '',
        province: '',
        postalCode: '',
        country: "Côte d'Ivoire",
        phone: '',
        isDefault: false,
      })
    }
  }, [address, mode, form])

  const onSubmit = async (data: IAddressInput) => {
    try {
      // Normaliser le numéro de téléphone : enlever tous les espaces et le préfixe +225 si présent
      const digitsOnly = data.phone
        .trim()
        .replace(/\s/g, '')
        .replace(/^\+225/, '')

      // Vérifier qu'il n'y a que des chiffres et exactement 10
      if (!/^\d{10}$/.test(digitsOnly)) {
        toast({
          title: t('Error'),
          description:
            'Le numéro de téléphone doit contenir exactement 10 chiffres (ex: 07 10 14 58 64)',
          variant: 'destructive',
        })
        return
      }

      // Construire le numéro normalisé avec +225
      const normalizedPhone = '+225' + digitsOnly

      const normalizedData = {
        ...data,
        phone: normalizedPhone,
      }

      // L'action createAddress récupère automatiquement le user depuis la session
      // donc on peut passer les données sans le champ user
      let result
      if (mode === 'create') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result = await createAddress(normalizedData as any)
      } else {
        if (!address?._id) {
          toast({
            title: t('Error'),
            description: t('Address ID is required for update'),
            variant: 'destructive',
          })
          return
        }
        result = await updateAddress({
          _id: address._id,
          ...normalizedData,
        })
      }

      if (result.success) {
        toast({
          title: t('Success'),
          description:
            mode === 'create'
              ? t('Address created successfully')
              : t('Address updated successfully'),
        })
        onOpenChange(false)
        form.reset()
      } else {
        toast({
          title: t('Error'),
          description: result.message || t('An error occurred'),
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: t('Error'),
        description: t('An unexpected error occurred'),
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t('Add Address') : t('Edit Address')}
          </DialogTitle>
          <DialogDescription>
            {t('Address Dialog Description')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Full Name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter full name')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Street Address')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter street address')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('City')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('Enter city')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Province')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('Enter province')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Postal Code')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('Enter postal code')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Country')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('Enter country')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => {
                // Normaliser la valeur : enlever +225 si présent au début
                const currentValue = field.value || ''
                const cleanedValue = currentValue
                  .replace(/\+225\s*/g, '')
                  .trim()

                return (
                  <FormItem>
                    <FormLabel>{t('Phone')}</FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={cleanedValue}
                        onChange={(e) => {
                          // Permettre seulement les chiffres et espaces dans le champ
                          const value = e.target.value.replace(/[^\d\s]/g, '')
                          // Limiter à 10 chiffres maximum
                          const digitsOnly = value.replace(/\s/g, '')
                          if (digitsOnly.length > 10) return
                          // Formater automatiquement avec des espaces tous les 2 chiffres
                          const formatted = digitsOnly
                            .replace(/(\d{2})(?=\d)/g, '$1 ')
                            .trim()
                          field.onChange(formatted)
                        }}
                        placeholder="07 10 14 58 64"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('Enter phone number without +225')} (ex: 07 10 14 58
                      64)
                    </p>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t('Set as default address')}</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {t('Default address description')}
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('Cancel')}
              </Button>
              <Button type="submit">
                {mode === 'create' ? t('Add') : t('Update')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
