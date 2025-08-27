'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { SettingInputSchema } from '@/lib/validator'
import { ClientSetting, ISettingInput } from '@/types'
import { updateSetting } from '@/lib/actions/setting.actions'
import useSetting from '@/hooks/use-setting-store'
import { useTranslationValidator } from '@/hooks/use-translation-validator'
import TranslationValidator from '@/components/shared/translation-validator'
import { MissingTranslation } from '@/hooks/use-translation-validator'
import LanguageForm from './language-form'
import CurrencyForm from './currency-form'
import PaymentMethodForm from './payment-method-form'
import DeliveryDateForm from './delivery-date-form'
import SiteInfoForm from './site-info-form'
import CommonForm from './common-form'
import CarouselForm from './carousel-form'

const SettingForm = ({ setting }: { setting: ISettingInput }) => {
  const { setSetting } = useSetting()
  const {
    validationResults,
    validateCarouselTranslations,
    validateSiteInfoTranslations,
    clearValidationResults,
  } = useTranslationValidator()

  const form = useForm<ISettingInput>({
    resolver: zodResolver(SettingInputSchema),
    defaultValues: setting,
  })
  const {
    formState: { isSubmitting },
    watch,
  } = form

  const { toast } = useToast()

  // Surveiller les changements pour valider en temps réel
  const watchedCarousels = watch('carousels')
  const watchedSiteInfo = watch('site')

  // Valider les traductions quand les données changent
  React.useEffect(() => {
    if (watchedCarousels && watchedCarousels.length > 0) {
      validateCarouselTranslations(watchedCarousels)
    }
  }, [watchedCarousels, validateCarouselTranslations])

  React.useEffect(() => {
    if (watchedSiteInfo) {
      validateSiteInfoTranslations(watchedSiteInfo)
    }
  }, [watchedSiteInfo, validateSiteInfoTranslations])

  // Fonction pour ajouter une traduction manquante
  const handleAddTranslation = async (
    translation: MissingTranslation,
    frenchValue: string,
    englishValue: string
  ) => {
    try {
      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          namespace: translation.namespace,
          key: translation.key,
          frenchValue,
          englishValue,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          description: result.message,
        })
        // Revalider après ajout
        if (watchedCarousels) {
          validateCarouselTranslations(watchedCarousels)
        }
        if (watchedSiteInfo) {
          validateSiteInfoTranslations(watchedSiteInfo)
        }
      } else {
        toast({
          variant: 'destructive',
          description:
            result.error || "Erreur lors de l'ajout de la traduction",
        })
      }
    } catch {
      toast({
        variant: 'destructive',
        description: "Erreur lors de l'ajout de la traduction",
      })
    }
  }

  async function onSubmit(values: ISettingInput) {
    const res = await updateSetting({ ...values })
    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      })
    } else {
      toast({
        description: res.message,
      })
      setSetting(values as ClientSetting)
    }
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SiteInfoForm id='setting-site-info' form={form} />
        <CommonForm id='setting-common' form={form} />
        <CarouselForm id='setting-carousels' form={form} />

        {/* Validateur de traductions en temps réel */}
        <TranslationValidator
          validationResults={validationResults}
          onAddTranslation={handleAddTranslation}
          onClearValidation={clearValidationResults}
        />

        <LanguageForm id='setting-languages' form={form} />

        <CurrencyForm id='setting-currencies' form={form} />

        <PaymentMethodForm id='setting-payment-methods' form={form} />

        <DeliveryDateForm id='setting-delivery-dates' form={form} />

        <div>
          <Button
            type='submit'
            size='lg'
            disabled={isSubmitting}
            className='w-full mb-24'
          >
            {isSubmitting ? 'Submitting...' : `Save Setting`}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SettingForm
