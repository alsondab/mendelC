'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  getGlobalStockThresholds,
  updateGlobalStockThresholds,
} from '@/lib/actions/setting.actions'
import {
  applyGlobalThresholdsToAllProducts,
} from '@/lib/actions/stock.actions'
import { AlertTriangle, XCircle, Settings, Loader2, RefreshCw } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useTranslations } from 'next-intl'

export function GlobalStockThresholdsConfig() {
  const t = useTranslations('Admin.GlobalStockThresholds')
  const { toast } = useToast()
  const [globalLowStockThreshold, setGlobalLowStockThreshold] = useState(5)
  const [globalCriticalStockThreshold, setGlobalCriticalStockThreshold] =
    useState(2)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isApplying, setIsApplying] = useState(false)

  // Charger les seuils globaux au montage
  useEffect(() => {
    const loadThresholds = async () => {
      try {
        const result = await getGlobalStockThresholds()
        if (result.success && result.thresholds) {
          setGlobalLowStockThreshold(result.thresholds.globalLowStockThreshold)
          setGlobalCriticalStockThreshold(
            result.thresholds.globalCriticalStockThreshold
          )
        }
      } catch (error) {
        console.error('Erreur lors du chargement des seuils:', error)
        toast({
          title: t('Error'),
          description: t('ErrorLoading'),
          variant: 'destructive',
        })
      } finally {
        setIsLoadingSettings(false)
      }
    }

    loadThresholds()
  }, [toast, t])

  const handleSave = async () => {
    // Validation
    if (globalLowStockThreshold < 0 || globalCriticalStockThreshold < 0) {
      toast({
        title: t('ValidationError'),
        description: t('ThresholdsCannotBeNegative'),
        variant: 'destructive',
      })
      return
    }

    if (globalCriticalStockThreshold >= globalLowStockThreshold) {
      toast({
        title: t('ValidationError'),
        description: t('CriticalMustBeLessThanLow'),
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await updateGlobalStockThresholds({
        globalLowStockThreshold,
        globalCriticalStockThreshold,
      })

      if (result.success) {
        toast({
          title: t('Success'),
          description: result.message || t('ThresholdsUpdated'),
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: t('Error'),
        description:
          error instanceof Error
            ? error.message
            : t('ErrorSaving'),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyToAllProducts = async (applyToExisting: boolean) => {
    setIsApplying(true)
    try {
      const result = await applyGlobalThresholdsToAllProducts({
        applyToExistingProducts: applyToExisting,
      })

      if (result.success) {
        toast({
          title: t('Success'),
          description:
            result.message ||
            t('ProductsUpdated', { count: result.updatedCount || 0 }),
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: t('Error'),
        description:
          error instanceof Error
            ? error.message
            : t('ErrorApplying'),
        variant: 'destructive',
      })
    } finally {
      setIsApplying(false)
    }
  }

  if (isLoadingSettings) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
            <span className='ml-2 text-sm text-muted-foreground'>
              {t('Loading')}
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className='pb-3 sm:pb-6'>
        <CardTitle className='flex items-center gap-2 text-xl sm:text-2xl'>
          <Settings className='h-4 w-4 sm:h-5 sm:w-5' />
          {t('Title')}
        </CardTitle>
        <CardDescription className='text-xs sm:text-sm'>
          {t('Description')}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        {/* Seuil faible (avertissement) */}
        <div className='space-y-2'>
          <Label htmlFor='globalLowStockThreshold' className='text-sm sm:text-base'>
            {t('LowStockLabel')}
          </Label>
          <Input
            id='globalLowStockThreshold'
            type='number'
            min='0'
            value={globalLowStockThreshold}
            onChange={(e) =>
              setGlobalLowStockThreshold(parseInt(e.target.value) || 0)
            }
            className='text-sm sm:text-base'
            disabled={isLoading}
          />
          <p className='text-xs text-muted-foreground'>
            {t('LowStockDescription')}
          </p>
        </div>

        {/* Seuil critique */}
        <div className='space-y-2'>
          <Label
            htmlFor='globalCriticalStockThreshold'
            className='text-sm sm:text-base'
          >
            {t('CriticalStockLabel')}
          </Label>
          <Input
            id='globalCriticalStockThreshold'
            type='number'
            min='0'
            value={globalCriticalStockThreshold}
            onChange={(e) =>
              setGlobalCriticalStockThreshold(parseInt(e.target.value) || 0)
            }
            className='text-sm sm:text-base'
            disabled={isLoading}
          />
          <p className='text-xs text-muted-foreground'>
            {t('CriticalStockDescription')}
          </p>
        </div>

        {/* Indicateurs visuels */}
        <div className='rounded-lg bg-muted p-3 sm:p-4 space-y-2'>
          <p className='text-xs sm:text-sm font-medium'>{t('AlertScale')}</p>
          <div className='flex items-center gap-2 text-xs sm:text-sm'>
            <div className='flex items-center gap-1.5'>
              <div className='h-3 w-3 rounded-full bg-green-500' />
              <span className='text-muted-foreground'>
                {t('NormalStock', { threshold: globalLowStockThreshold })}
              </span>
            </div>
          </div>
          <div className='flex items-center gap-2 text-xs sm:text-sm'>
            <div className='flex items-center gap-1.5'>
              <AlertTriangle className='h-3 w-3 text-orange-500' />
              <span className='text-muted-foreground'>
                {t('LowStockRange', { 
                  min: globalCriticalStockThreshold + 1, 
                  max: globalLowStockThreshold 
                })}
              </span>
            </div>
          </div>
          <div className='flex items-center gap-2 text-xs sm:text-sm'>
            <div className='flex items-center gap-1.5'>
              <XCircle className='h-3 w-3 text-red-500' />
              <span className='text-muted-foreground'>
                {t('CriticalStock', { threshold: globalCriticalStockThreshold })}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
          <Button
            onClick={handleSave}
            disabled={isLoading || isApplying}
            className='w-full sm:w-auto'
          >
            {isLoading ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                {t('Saving')}
              </>
            ) : (
              t('SaveThresholds')
            )}
          </Button>

          {/* Appliquer aux produits existants */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='outline'
                disabled={isLoading || isApplying}
                className='w-full sm:w-auto'
              >
                <RefreshCw className='h-4 w-4 mr-2' />
                {t('ApplyToProducts')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('ApplyToProductsTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('ApplyToProductsDescription')}
                  <br />
                  <br />
                  <strong>{t('Option1')}</strong> {t('Option1Text')}
                  <br />
                  <strong>{t('Option2')}</strong> {t('Option2Text')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className='flex-col sm:flex-row gap-2'>
                <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleApplyToAllProducts(false)}
                  disabled={isApplying}
                  className='w-full sm:w-auto'
                >
                  {isApplying ? (
                    <>
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                      {t('Applying')}
                    </>
                  ) : (
                    t('OnlyProductsWithoutThreshold')
                  )}
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={() => handleApplyToAllProducts(true)}
                  disabled={isApplying}
                  className='w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90'
                >
                  {isApplying ? (
                    <>
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                      {t('Applying')}
                    </>
                  ) : (
                    t('AllProducts')
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

