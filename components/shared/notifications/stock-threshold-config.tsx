'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { updateStockThresholds } from '@/lib/actions/stock.actions'
import { Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface StockThresholdConfigProps {
  productId: string
  productName: string
  currentMinStockLevel: number
  currentMaxStockLevel: number
  currentStock: number
}

export function StockThresholdConfig({
  productId,
  productName,
  currentMinStockLevel,
  currentMaxStockLevel,
  currentStock,
}: StockThresholdConfigProps) {
  const [open, setOpen] = useState(false)
  const [minStockLevel, setMinStockLevel] = useState(currentMinStockLevel)
  const [maxStockLevel, setMaxStockLevel] = useState(currentMaxStockLevel)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (minStockLevel < 0) {
      toast({
        title: 'Erreur de validation',
        description: 'Le seuil minimum ne peut pas être négatif',
        variant: 'destructive',
      })
      return
    }

    if (maxStockLevel <= minStockLevel) {
      toast({
        title: 'Erreur de validation',
        description:
          'Le seuil maximum doit être supérieur au seuil minimum',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await updateStockThresholds({
        productId,
        minStockLevel,
        maxStockLevel,
      })

      if (result.success) {
        toast({
          title: 'Succès',
          description: result.message,
        })
        setOpen(false)
      } else {
        toast({
          title: 'Erreur',
          description: result.message,
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la mise à jour',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMinStockLevel(currentMinStockLevel)
    setMaxStockLevel(currentMaxStockLevel)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='text-xs sm:text-sm'
          onClick={() => {
            setMinStockLevel(currentMinStockLevel)
            setMaxStockLevel(currentMaxStockLevel)
          }}
        >
          <Settings className='h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5' />
          <span className='hidden xs:inline'>Seuils</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md' aria-describedby='stock-threshold-description'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className='text-lg sm:text-xl'>
              Configurer les seuils de stock
            </DialogTitle>
            <DialogDescription id='stock-threshold-description' className='text-sm'>
              {productName}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='minStockLevel' className='text-sm'>
                Seuil minimum (alerte)
              </Label>
              <Input
                id='minStockLevel'
                type='number'
                min='0'
                value={minStockLevel}
                onChange={(e) =>
                  setMinStockLevel(parseInt(e.target.value) || 0)
                }
                className='text-sm'
              />
              <p className='text-xs text-muted-foreground'>
                Alerte lorsque le stock ≤ cette valeur
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='maxStockLevel' className='text-sm'>
                Seuil maximum (stock optimal)
              </Label>
              <Input
                id='maxStockLevel'
                type='number'
                min={minStockLevel + 1}
                value={maxStockLevel}
                onChange={(e) =>
                  setMaxStockLevel(parseInt(e.target.value) || 0)
                }
                className='text-sm'
              />
              <p className='text-xs text-muted-foreground'>
                Stock optimal recommandé pour ce produit
              </p>
            </div>

            <div className='rounded-lg bg-muted p-3 space-y-1'>
              <p className='text-xs font-medium'>Stock actuel</p>
              <p className='text-sm font-bold'>
                {currentStock} unité{currentStock > 1 ? 's' : ''}
              </p>
              <p className='text-xs text-muted-foreground'>
                {currentStock <= currentMinStockLevel
                  ? '⚠️ Stock faible ou rupture'
                  : currentStock >= currentMaxStockLevel
                  ? '✅ Stock optimal'
                  : '⚠️ En dessous du stock optimal'}
              </p>
            </div>
          </div>
          <DialogFooter className='flex-col sm:flex-row gap-2 sm:gap-0'>
            <Button
              variant='outline'
              onClick={handleReset}
              disabled={isLoading}
              className='w-full sm:w-auto'
            >
              Réinitialiser
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className='w-full sm:w-auto'
            >
              {isLoading ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Sauvegarde...
                </>
              ) : (
                'Sauvegarder'
              )}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

