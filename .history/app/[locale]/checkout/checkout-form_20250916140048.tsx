'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
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
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { createOrder } from '@/lib/actions/order.actions'
import {
  calculateFutureDate,
  formatDateTime,
  timeUntilMidnight,
} from '@/lib/utils'
import { ShippingAddressSchema } from '@/lib/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import CheckoutFooter from './checkout-footer'
import { ShippingAddress } from '@/types'
import useIsMounted from '@/hooks/use-is-mounted'
import Link from 'next/link'
import useCartStore from '@/hooks/use-cart-store'
import useSettingStore from '@/hooks/use-setting-store'
import { useTranslations } from 'next-intl'
import ProductPrice from '@/components/shared/product/product-price'

const shippingAddressDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        fullName: 'Jean Kouassi',
        street: '123 Avenue de la Paix',
        city: 'Abidjan',
        province: 'Abidjan',
        phone: '+225 07 12 34 56 78',
        postalCode: '00225',
        country: "Côte d'Ivoire",
      }
    : {
        fullName: '',
        street: '',
        city: '',
        province: '',
        phone: '+225 ',
        postalCode: '',
        country: "Côte d'Ivoire",
      }

const CheckoutForm = () => {
  const { toast } = useToast()
  const router = useRouter()
  const t = useTranslations('Checkout')
  const {
    setting: {
      site,
      availablePaymentMethods,
      defaultPaymentMethod,
      availableDeliveryDates,
    },
  } = useSettingStore()

  const {
    cart: {
      items,
      itemsPrice,
      shippingPrice,
      totalPrice,
      shippingAddress,
      deliveryDateIndex,
      paymentMethod = defaultPaymentMethod,
    },
    setShippingAddress,
    setPaymentMethod,
    updateItem,
    removeItem,
    clearCart,
    setDeliveryDateIndex,
  } = useCartStore()
  const isMounted = useIsMounted()

  const shippingAddressForm = useForm<ShippingAddress>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: shippingAddress || shippingAddressDefaultValues,
  })
  const onSubmitShippingAddress: SubmitHandler<ShippingAddress> = (values) => {
    setShippingAddress(values)
    setIsAddressSelected(true)
  }

  useEffect(() => {
    if (!isMounted || !shippingAddress) return
    shippingAddressForm.setValue('fullName', shippingAddress.fullName)
    shippingAddressForm.setValue('street', shippingAddress.street)
    shippingAddressForm.setValue('city', shippingAddress.city)
    shippingAddressForm.setValue('country', shippingAddress.country)
    shippingAddressForm.setValue('postalCode', shippingAddress.postalCode)
    shippingAddressForm.setValue('province', shippingAddress.province)
    shippingAddressForm.setValue('phone', shippingAddress.phone)
  }, [items, isMounted, router, shippingAddress, shippingAddressForm])

  const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false)
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] =
    useState<boolean>(false)
  const [isDeliveryDateSelected, setIsDeliveryDateSelected] =
    useState<boolean>(false)

  const handlePlaceOrder = async () => {
    const res = await createOrder({
      items,
      shippingAddress,
      expectedDeliveryDate: calculateFutureDate(
        availableDeliveryDates[deliveryDateIndex!].daysToDeliver
      ),
      deliveryDateIndex,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    })
    if (!res.success) {
      toast({
        description: res.message,
        variant: 'destructive',
      })
    } else {
      // Show success message
      toast({
        description: res.message,
        variant: 'default',
      })

      // Show email confirmation toast for Cash On Delivery
      if (paymentMethod === 'CashOnDelivery') {
        toast({
          description: t('OrderConfirmationEmail'),
          variant: 'default',
        })
      }

      clearCart()
      router.push(`/checkout/${res.data?.orderId}`)
    }
  }
  const handleSelectPaymentMethod = () => {
    setIsAddressSelected(true)
    setIsPaymentMethodSelected(true)
  }
  const handleSelectShippingAddress = () => {
    shippingAddressForm.handleSubmit(onSubmitShippingAddress)()
  }
  const CheckoutSummary = () => {
    return (
      <Card className='sticky top-4 shadow-lg'>
        <CardContent className='p-3 xs:p-4'>
          {!isAddressSelected && (
            <div className='border-b border-border/50 mb-3 xs:mb-4 pb-3 xs:pb-4'>
              <Button
                className='rounded-full w-full text-sm xs:text-base'
                onClick={handleSelectShippingAddress}
              >
                Livrer à cette adresse
              </Button>
              <p className='text-xs xs:text-sm text-center py-2 text-muted-foreground'>
                {t('ChooseAddressAndPayment')}
                pour calculer les frais de port et de manutention.
              </p>
            </div>
          )}
          {isAddressSelected && !isPaymentMethodSelected && (
            <div className='mb-3 xs:mb-4'>
              <Button
                className='rounded-full w-full text-sm xs:text-base'
                onClick={handleSelectPaymentMethod}
              >
                {t('UsePaymentMethod')}
              </Button>

              <p className='text-xs xs:text-sm text-center py-2 text-muted-foreground'>
                {t('PaymentMethodContinue')}
              </p>
            </div>
          )}
          {isPaymentMethodSelected && isAddressSelected && (
            <div>
              <Button
                onClick={handlePlaceOrder}
                className='rounded-full w-full text-sm xs:text-base'
              >
                {t('PlaceOrder')}
              </Button>
              <p className='text-xs xs:text-sm text-center py-2 text-muted-foreground'>
                En passant votre commande, vous acceptez la{' '}
                <Link
                  href='/page/privacy-policy'
                  className='text-primary hover:underline'
                >
                  politique de confidentialité
                </Link>{' '}
                et les{' '}
                <Link
                  href='/page/conditions-of-use'
                  className='text-primary hover:underline'
                >
                  conditions d&apos;utilisation
                </Link>{' '}
                de {site.name}.
              </p>
            </div>
          )}

          <div className='mt-4 xs:mt-6'>
            <div className='text-base xs:text-lg font-bold mb-3'>
              Résumé de la commande
            </div>
            <div className='space-y-2 xs:space-y-3'>
              <div className='flex justify-between text-sm xs:text-base'>
                <span>Articles:</span>
                <span>
                  <ProductPrice price={itemsPrice} plain />
                </span>
              </div>
              <div className='flex justify-between text-sm xs:text-base'>
                <span>Livraison:</span>
                <span>
                  {shippingPrice === undefined ? (
                    '--'
                  ) : shippingPrice === 0 ? (
                    <span className='text-green-600 font-medium'>GRATUIT</span>
                  ) : (
                    <ProductPrice price={shippingPrice} plain />
                  )}
                </span>
              </div>
              <div className='flex justify-between text-sm xs:text-base'></div>
              <div className='border-t border-border/50 pt-3 xs:pt-4'>
                <div className='flex justify-between font-bold text-base xs:text-lg'>
                  <span>Total de la commande:</span>
                  <span>
                    <ProductPrice price={totalPrice} plain />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <main className='p-1 xs:p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6'>
        <div className='lg:col-span-3 space-y-4 xs:space-y-6'>
          {/* shipping address */}
          <div>
            {isAddressSelected && shippingAddress ? (
              <div className='bg-card rounded-xl border shadow-sm p-3 xs:p-4'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold'>
                      1
                    </div>
                    <span className='text-base xs:text-lg font-bold'>
                      Adresse de livraison
                    </span>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-xs xs:text-sm'
                    onClick={() => {
                      setIsAddressSelected(false)
                      setIsPaymentMethodSelected(true)
                      setIsDeliveryDateSelected(true)
                    }}
                  >
                    Modifier
                  </Button>
                </div>
                <div className='mt-3 text-sm xs:text-base text-muted-foreground'>
                  <p className='font-medium text-foreground'>
                    {shippingAddress.fullName}
                  </p>
                  <p>{shippingAddress.street}</p>
                  <p>{`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}</p>
                </div>
              </div>
            ) : (
              <>
                <div className='flex items-center gap-2 mb-3 xs:mb-4'>
                  <div className='w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold'>
                    1
                  </div>
                  <span className='text-base xs:text-lg font-bold text-primary'>
                    Saisir l&apos;adresse de livraison
                  </span>
                </div>
                <Form {...shippingAddressForm}>
                  <form
                    method='post'
                    onSubmit={shippingAddressForm.handleSubmit(
                      onSubmitShippingAddress
                    )}
                    className='space-y-3 xs:space-y-4'
                  >
                    <Card className='shadow-sm'>
                      <CardContent className='p-3 xs:p-4 space-y-3 xs:space-y-4'>
                        <div className='text-base xs:text-lg font-bold mb-3'>
                          Votre adresse
                        </div>

                        <FormField
                          control={shippingAddressForm.control}
                          name='fullName'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-sm xs:text-base'>
                                {t('FullName')}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Saisir le nom complet'
                                  className='text-sm xs:text-base'
                                  maxLength={50}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={shippingAddressForm.control}
                          name='street'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-sm xs:text-base'>
                                Adresse
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Saisir l'adresse"
                                  className='text-sm xs:text-base'
                                  maxLength={100}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4'>
                          <FormField
                            control={shippingAddressForm.control}
                            name='city'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-sm xs:text-base'>
                                  {t('City')}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Saisir la ville'
                                    className='text-sm xs:text-base'
                                    maxLength={50}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='province'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-sm xs:text-base'>
                                  {t('Province')}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Saisir le lieu de livraison'
                                    className='text-sm xs:text-base'
                                    maxLength={50}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4'>
                          <FormField
                            control={shippingAddressForm.control}
                            name='postalCode'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-sm xs:text-base'>
                                  {t('PostalCode')}{' '}
                                  <span className='text-muted-foreground'>
                                    (optionnel, si vous avez un code postal)
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Saisir le code postal (optionnel)'
                                    className='text-sm xs:text-base'
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value
                                      field.onChange(
                                        value.trim() === '' ? undefined : value
                                      )
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='phone'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-sm xs:text-base'>
                                  {t('Phone')}
                                </FormLabel>
                                <FormControl>
                                  <PhoneInput
                                    placeholder='07 12 34 56 78'
                                    className='text-sm xs:text-base'
                                    value={
                                      field.value?.replace('+225 ', '') || ''
                                    } // Enlever +225 pour l'affichage
                                    onChange={(e) => {
                                      let value = e.target.value

                                      // Supprimer tous les caractères non numériques
                                      value = value.replace(/[^\d]/g, '')

                                      // Limiter à 10 chiffres
                                      value = value.substring(0, 10)

                                      // Formater avec des espaces
                                      if (value.length > 0) {
                                        const formatted = value.replace(
                                          /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                                          '$1 $2 $3 $4 $5'
                                        )
                                        // Stocker avec +225 dans le form mais ne l'afficher que dans le préfixe
                                        field.onChange(
                                          '+225 ' + formatted.trim()
                                        )
                                      } else {
                                        field.onChange('')
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={shippingAddressForm.control}
                          name='country'
                          render={() => (
                            <FormItem>
                              <FormLabel className='text-sm xs:text-base'>
                                {t('Country')}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  value="Côte d'Ivoire"
                                  className='text-sm xs:text-base bg-muted cursor-not-allowed'
                                  readOnly
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      <CardFooter className='p-3 xs:p-4'>
                        <Button
                          type='submit'
                          className='w-full rounded-full font-bold text-sm xs:text-base'
                        >
                          Livrer à cette adresse
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </Form>
              </>
            )}
          </div>

          {/* payment method */}
          <div className='border-t border-b border-border/50'>
            {isPaymentMethodSelected && paymentMethod ? (
              <div className='bg-card rounded-xl border shadow-sm p-3 xs:p-4'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold'>
                      2
                    </div>
                    <span className='text-base xs:text-lg font-bold'>
                      {t('PaymentMethod')}
                    </span>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-xs xs:text-sm'
                    onClick={() => {
                      setIsPaymentMethodSelected(false)
                      if (paymentMethod) setIsDeliveryDateSelected(true)
                    }}
                  >
                    Modifier
                  </Button>
                </div>
                <div className='mt-3 text-sm xs:text-base text-muted-foreground'>
                  <p className='font-medium text-foreground'>
                    {t(paymentMethod)}
                  </p>
                </div>
              </div>
            ) : isAddressSelected ? (
              <>
                <div className='flex items-center gap-2 mb-3 xs:mb-4'>
                  <div className='w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold'>
                    2
                  </div>
                  <span className='text-base xs:text-lg font-bold text-primary'>
                    {t('ChoosePaymentMethod')}
                  </span>
                </div>
                <Card className='shadow-sm'>
                  <CardContent className='p-3 xs:p-4'>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value)}
                      className='space-y-3'
                    >
                      {availablePaymentMethods.map((pm) => (
                        <div
                          key={pm.name}
                          className='flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors'
                        >
                          <RadioGroupItem
                            value={pm.name}
                            id={`payment-${pm.name}`}
                          />
                          <Label
                            className='font-medium text-sm xs:text-base cursor-pointer flex-1'
                            htmlFor={`payment-${pm.name}`}
                          >
                            {t(pm.name)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                  <CardFooter className='p-3 xs:p-4'>
                    <Button
                      onClick={handleSelectPaymentMethod}
                      className='w-full rounded-full font-bold text-sm xs:text-base'
                    >
                      {t('UsePaymentMethod')}
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <div className='flex items-center gap-2 text-muted-foreground text-base xs:text-lg font-bold my-4 py-3'>
                <div className='w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm font-bold'>
                  2
                </div>
                <span>{t('ChoosePaymentMethod')}</span>
              </div>
            )}
          </div>
          {/* items and delivery date */}
          <div>
            {isDeliveryDateSelected && deliveryDateIndex != undefined ? (
              <div className='grid  grid-cols-1 md:grid-cols-12  my-3 pb-3'>
                <div className='flex text-lg font-bold  col-span-5'>
                  <span className='w-8'>3 </span>
                  <span>{t('ItemsAndShipping')}</span>
                </div>
                <div className='col-span-5'>
                  <p>
                    Delivery date:{' '}
                    {
                      formatDateTime(
                        calculateFutureDate(
                          availableDeliveryDates[deliveryDateIndex]
                            .daysToDeliver
                        )
                      ).dateOnly
                    }
                  </p>
                  <ul>
                    {items.map((item, index) => (
                      <li key={`item-${index}`}>
                        {item.name} x {item.quantity} = {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='col-span-2'>
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      setIsPaymentMethodSelected(true)
                      setIsDeliveryDateSelected(false)
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : isPaymentMethodSelected && isAddressSelected ? (
              <>
                <div className='flex text-primary  text-lg font-bold my-2'>
                  <span className='w-8'>3 </span>
                  <span>{t('ReviewItemsAndShipping')}</span>
                </div>
                <Card className='md:ml-8'>
                  <CardContent className='p-4'>
                    <p className='mb-2'>
                      <span className='text-lg font-bold text-green-700'>
                        Arriving{' '}
                        {
                          formatDateTime(
                            calculateFutureDate(
                              availableDeliveryDates[deliveryDateIndex!]
                                .daysToDeliver
                            )
                          ).dateOnly
                        }
                      </span>{' '}
                      If you order in the next {timeUntilMidnight().hours} hours
                      and {timeUntilMidnight().minutes} minutes.
                    </p>
                    <div className='grid md:grid-cols-2 gap-6'>
                      <div>
                        {items.map((item, index) => (
                          <div
                            key={`item-detail-${index}`}
                            className='flex gap-4 py-2'
                          >
                            <div className='relative w-16 h-16'>
                              {item.image && item.image.trim() !== '' ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes='20vw'
                                  style={{
                                    objectFit: 'contain',
                                  }}
                                />
                              ) : (
                                <div className='w-full h-full bg-muted flex items-center justify-center'>
                                  <span className='text-muted-foreground text-xs'>
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className='flex-1'>
                              <p className='font-semibold'>
                                {item.name}, {item.color}, {item.size}
                              </p>
                              <p className='font-bold'>
                                <ProductPrice price={item.price} plain />
                              </p>

                              <Select
                                value={item.quantity.toString()}
                                onValueChange={(value) => {
                                  if (value === '0') removeItem(item)
                                  else updateItem(item, Number(value))
                                }}
                              >
                                <SelectTrigger className='w-24'>
                                  <SelectValue>
                                    Qty: {item.quantity}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent position='popper'>
                                  {Array.from({
                                    length: item.countInStock,
                                  }).map((_, i) => (
                                    <SelectItem key={i + 1} value={`${i + 1}`}>
                                      {i + 1}
                                    </SelectItem>
                                  ))}
                                  <SelectItem key='delete' value='0'>
                                    Delete
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className=' font-bold'>
                          <p className='mb-2'>{t('ChooseShippingSpeed')}:</p>

                          <ul>
                            <RadioGroup
                              value={
                                availableDeliveryDates[deliveryDateIndex!].name
                              }
                              onValueChange={(value) =>
                                setDeliveryDateIndex(
                                  availableDeliveryDates.findIndex(
                                    (address) => address.name === value
                                  )!
                                )
                              }
                            >
                              {availableDeliveryDates.map((dd) => (
                                <div key={dd.name} className='flex'>
                                  <RadioGroupItem
                                    value={dd.name}
                                    id={`address-${dd.name}`}
                                  />
                                  <Label
                                    className='pl-2 space-y-2 cursor-pointer'
                                    htmlFor={`address-${dd.name}`}
                                  >
                                    <div className='text-green-700 font-semibold'>
                                      {
                                        formatDateTime(
                                          calculateFutureDate(dd.daysToDeliver)
                                        ).dateOnly
                                      }
                                    </div>
                                    <div>
                                      <ProductPrice
                                        price={dd.shippingPrice}
                                        plain
                                      />
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className='flex text-muted-foreground text-lg font-bold my-4 py-3'>
                <span className='w-8'>3 </span>
                <span>{t('ItemsAndShipping')}</span>
              </div>
            )}
          </div>
          {isPaymentMethodSelected && isAddressSelected && (
            <div className='mt-4 xs:mt-6'>
              <div className='block lg:hidden'>
                <CheckoutSummary />
              </div>

              <Card className='hidden lg:block shadow-lg'>
                <CardContent className='p-3 xs:p-4 flex flex-col sm:flex-row justify-between items-center gap-3'>
                  <Button
                    onClick={handlePlaceOrder}
                    className='rounded-full text-sm xs:text-base'
                  >
                    Passer la commande
                  </Button>
                  <div className='flex-1 text-center sm:text-right'>
                    <p className='font-bold text-base xs:text-lg'>
                      Total de la commande:{' '}
                      <ProductPrice price={totalPrice} plain />
                    </p>
                    <p className='text-xs xs:text-sm text-muted-foreground'>
                      En passant votre commande, vous acceptez la{' '}
                      <Link
                        href='/page/privacy-policy'
                        className='text-primary hover:underline'
                      >
                        politique de confidentialité
                      </Link>{' '}
                      et les{' '}
                      <Link
                        href='/page/conditions-of-use'
                        className='text-primary hover:underline'
                      >
                        conditions d&apos;utilisation
                      </Link>{' '}
                      de {site.name}.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <CheckoutFooter />
        </div>
        <div className='hidden lg:block'>
          <CheckoutSummary />
        </div>
      </div>
    </main>
  )
}
export default CheckoutForm
