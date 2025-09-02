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
import ProductPrice from '@/components/shared/product/product-price'

const shippingAddressDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        fullName: 'Basir',
        street: '1911, 65 Sherbrooke Est',
        city: 'Montreal',
        province: 'Quebec',
        phone: '4181234567',
        postalCode: 'H2X 1C4',
        country: 'Canada',
      }
    : {
        fullName: '',
        street: '',
        city: '',
        province: '',
        phone: '',
        postalCode: '',
        country: '',
      }

const CheckoutForm = () => {
  const { toast } = useToast()
  const router = useRouter()
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
      taxPrice,
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
      taxPrice,
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
      if (paymentMethod === 'Cash On Delivery') {
        toast({
          description: `Order confirmation email has been sent to your email address`,
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
  const CheckoutSummary = () => (
    <Card>
      <CardContent className='p-4'>
        {!isAddressSelected && (
          <div className='border-b mb-4'>
            <Button
              className='rounded-full w-full'
              onClick={handleSelectShippingAddress}
            >
              Ship to this address
            </Button>
            <p className='text-xs text-center py-2'>
              Choose a shipping address and payment method in order to calculate
              shipping, handling, and tax.
            </p>
          </div>
        )}
        {isAddressSelected && !isPaymentMethodSelected && (
          <div className=' mb-4'>
            <Button
              className='rounded-full w-full'
              onClick={handleSelectPaymentMethod}
            >
              Use this payment method
            </Button>

            <p className='text-xs text-center py-2'>
              Choose a payment method to continue checking out. You&apos;ll
              still have a chance to review and edit your order before it&apos;s
              final.
            </p>
          </div>
        )}
        {isPaymentMethodSelected && isAddressSelected && (
          <div>
            <Button onClick={handlePlaceOrder} className='rounded-full w-full'>
              Place Your Order
            </Button>
            <p className='text-xs text-center py-2'>
              By placing your order, you agree to {site.name}&apos;s{' '}
              <Link href='/page/privacy-policy'>privacy notice</Link> and
              <Link href='/page/conditions-of-use'> conditions of use</Link>.
            </p>
          </div>
        )}

        <div>
          <div className='text-lg font-bold'>Order Summary</div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Items:</span>
              <span>
                <ProductPrice price={itemsPrice} plain />
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Shipping & Handling:</span>
              <span>
                {shippingPrice === undefined ? (
                  '--'
                ) : shippingPrice === 0 ? (
                  'FREE'
                ) : (
                  <ProductPrice price={shippingPrice} plain />
                )}
              </span>
            </div>
            <div className='flex justify-between'>
              <span> Tax:</span>
              <span>
                {taxPrice === undefined ? (
                  '--'
                ) : (
                  <ProductPrice price={taxPrice} plain />
                )}
              </span>
            </div>
            <div className='flex justify-between  pt-4 font-bold text-lg'>
              <span> Order Total:</span>
              <span>
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className='p-1 xs:p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6'>
        <div className='lg:col-span-3 space-y-4 xs:space-y-6'>
          {/* Shipping Address Section */}
          <div className='bg-card rounded-xl border shadow-sm'>
            {isAddressSelected && shippingAddress ? (
              <div className='p-3 xs:p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold'>
                      1
                    </div>
                    <h2 className='text-lg xs:text-xl font-bold'>Adresse de livraison</h2>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setIsAddressSelected(false)
                      setIsPaymentMethodSelected(true)
                      setIsDeliveryDateSelected(true)
                    }}
                    className='text-xs xs:text-sm'
                  >
                    Modifier
                  </Button>
                </div>
                <div className='bg-muted/30 rounded-lg p-3 xs:p-4'>
                  <p className='text-sm xs:text-base leading-relaxed'>
                    <span className='font-semibold'>{shippingAddress.fullName}</span><br />
                    {shippingAddress.street}<br />
                    {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                  </p>
                </div>
              </div>
            ) : (
              <div className='p-3 xs:p-4 sm:p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold'>
                    1
                  </div>
                  <h2 className='text-lg xs:text-xl font-bold'>Saisir l'adresse de livraison</h2>
                </div>
                <Form {...shippingAddressForm}>
                  <form
                    method='post'
                    onSubmit={shippingAddressForm.handleSubmit(
                      onSubmitShippingAddress
                    )}
                    className='space-y-4'
                  >
                    <div className='bg-muted/30 rounded-lg p-3 xs:p-4 space-y-4'>
                      <h3 className='text-base xs:text-lg font-semibold mb-3'>
                        Votre adresse
                      </h3>

                      <FormField
                        control={shippingAddressForm.control}
                        name='fullName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm xs:text-base'>Nom complet</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Saisir le nom complet'
                                className='text-sm xs:text-base'
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
                            <FormLabel className='text-sm xs:text-base'>Adresse</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Saisir l\'adresse'
                                className='text-sm xs:text-base'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <FormField
                          control={shippingAddressForm.control}
                          name='city'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-sm xs:text-base'>Ville</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder='Saisir la ville' 
                                  className='text-sm xs:text-base'
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
                              <FormLabel className='text-sm xs:text-base'>Province</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Saisir la province'
                                  className='text-sm xs:text-base'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <FormField
                          control={shippingAddressForm.control}
                          name='postalCode'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-sm xs:text-base'>Code postal</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Saisir le code postal'
                                  className='text-sm xs:text-base'
                                  {...field}
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
                              <FormLabel className='text-sm xs:text-base'>Téléphone</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Saisir le numéro de téléphone'
                                  className='text-sm xs:text-base'
                                  {...field}
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
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm xs:text-base'>Pays</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Saisir le pays'
                                className='text-sm xs:text-base'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='flex justify-end'>
                      <Button
                        type='submit'
                        className='rounded-full font-semibold text-sm xs:text-base'
                      >
                        Livrer à cette adresse
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </div>

          {/* Payment Method Section */}
          <div className='bg-card rounded-xl border shadow-sm'>
            {isPaymentMethodSelected && paymentMethod ? (
              <div className='p-3 xs:p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold'>
                      2
                    </div>
                    <h2 className='text-lg xs:text-xl font-bold'>Méthode de paiement</h2>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setIsPaymentMethodSelected(false)
                      if (paymentMethod) setIsDeliveryDateSelected(true)
                    }}
                    className='text-xs xs:text-sm'
                  >
                    Modifier
                  </Button>
                </div>
                <div className='bg-muted/30 rounded-lg p-3 xs:p-4'>
                  <p className='text-sm xs:text-base font-semibold'>{paymentMethod}</p>
                </div>
              </div>
            ) : isAddressSelected ? (
              <div className='p-3 xs:p-4 sm:p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold'>
                    2
                  </div>
                  <h2 className='text-lg xs:text-xl font-bold'>Choisir une méthode de paiement</h2>
                </div>
                <div className='bg-muted/30 rounded-lg p-3 xs:p-4 space-y-4'>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value)}
                  >
                    {availablePaymentMethods.map((pm) => (
                      <div key={pm.name} className='flex items-center space-x-3 py-2'>
                        <RadioGroupItem
                          value={pm.name}
                          id={`payment-${pm.name}`}
                        />
                        <Label
                          className='font-semibold text-sm xs:text-base cursor-pointer'
                          htmlFor={`payment-${pm.name}`}
                        >
                          {pm.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className='flex justify-end mt-4'>
                  <Button
                    onClick={handleSelectPaymentMethod}
                    className='rounded-full font-semibold text-sm xs:text-base'
                  >
                    Utiliser cette méthode de paiement
                  </Button>
                </div>
              </div>
            ) : (
              <div className='p-3 xs:p-4 sm:p-6'>
                <div className='flex items-center gap-2'>
                  <div className='w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-bold'>
                    2
                  </div>
                  <h2 className='text-lg xs:text-xl font-bold text-muted-foreground'>
                    Choisir une méthode de paiement
                  </h2>
                </div>
              </div>
            )}
          </div>
          {/* Items and Delivery Section */}
          <div className='bg-card rounded-xl border shadow-sm'>
            {isDeliveryDateSelected && deliveryDateIndex != undefined ? (
              <div className='p-3 xs:p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold'>
                      3
                    </div>
                    <h2 className='text-lg xs:text-xl font-bold'>Articles et livraison</h2>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setIsPaymentMethodSelected(true)
                      setIsDeliveryDateSelected(false)
                    }}
                    className='text-xs xs:text-sm'
                  >
                    Modifier
                  </Button>
                </div>
                <div className='bg-muted/30 rounded-lg p-3 xs:p-4 space-y-3'>
                  <p className='text-sm xs:text-base'>
                    <span className='font-semibold'>Date de livraison :</span>{' '}
                    {
                      formatDateTime(
                        calculateFutureDate(
                          availableDeliveryDates[deliveryDateIndex]
                            .daysToDeliver
                        )
                      ).dateOnly
                    }
                  </p>
                  <div className='space-y-2'>
                    {items.map((item, index) => (
                      <div key={`item-${index}`} className='text-sm xs:text-base'>
                        {item.name} x {item.quantity} = <ProductPrice price={item.price * item.quantity} plain />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : isPaymentMethodSelected && isAddressSelected ? (
              <>
                <div className='flex text-primary  text-lg font-bold my-2'>
                  <span className='w-8'>3 </span>
                  <span>Review items and shipping</span>
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
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes='20vw'
                                style={{
                                  objectFit: 'contain',
                                }}
                              />
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
                          <p className='mb-2'> Choose a shipping speed:</p>

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
                                      {(dd.freeShippingMinPrice > 0 &&
                                      itemsPrice >= dd.freeShippingMinPrice
                                        ? 0
                                        : dd.shippingPrice) === 0 ? (
                                        'FREE Shipping'
                                      ) : (
                                        <ProductPrice
                                          price={dd.shippingPrice}
                                          plain
                                        />
                                      )}
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
                <span>Items and shipping</span>
              </div>
            )}
          </div>
          {isPaymentMethodSelected && isAddressSelected && (
            <div className='mt-6'>
              <div className='block md:hidden'>
                <CheckoutSummary />
              </div>

              <Card className='hidden md:block '>
                <CardContent className='p-4 flex flex-col md:flex-row justify-between items-center gap-3'>
                  <Button onClick={handlePlaceOrder} className='rounded-full'>
                    Place Your Order
                  </Button>
                  <div className='flex-1'>
                    <p className='font-bold text-lg'>
                      Order Total: <ProductPrice price={totalPrice} plain />
                    </p>
                    <p className='text-xs'>
                      {' '}
                      By placing your order, you agree to {
                        site.name
                      }&apos;s{' '}
                      <Link href='/page/privacy-policy'>privacy notice</Link>{' '}
                      and
                      <Link href='/page/conditions-of-use'>
                        {' '}
                        conditions of use
                      </Link>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <CheckoutFooter />
        </div>
        <div className='hidden md:block'>
          <CheckoutSummary />
        </div>
      </div>
    </main>
  )
}
export default CheckoutForm
