'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Tag, TrendingUp, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  activatePromotion,
  deactivatePromotion,
  getPromotionStats,
} from '@/lib/actions/promotion.actions'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface PromotionStats {
  activePromotions: number
  expiredPromotions: number
  totalPromotions: number
}

const PromotionsTable = () => {
  const [stats, setStats] = useState<PromotionStats>({
    activePromotions: 0,
    expiredPromotions: 0,
    totalPromotions: 0,
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadPromotionStats()
  }, [])

  const loadPromotionStats = async () => {
    try {
      const promotionStats = await getPromotionStats()
      setStats(promotionStats)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActivatePromotion = async (productId: string) => {
    try {
      // Exemple d'activation de promotion
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 7) // 7 jours

      const result = await activatePromotion(productId, {
        expiryDate,
        originalPrice: 100,
        salePrice: 69,
      })

      if (result.success) {
        toast({
          description: 'Promotion activée avec succès',
        })
        loadPromotionStats()
      } else {
        toast({
          variant: 'destructive',
          description: result.message || "Erreur lors de l'activation",
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: "Erreur lors de l'activation de la promotion",
      })
    }
  }

  const handleDeactivatePromotion = async (productId: string) => {
    try {
      const result = await deactivatePromotion(productId)

      if (result.success) {
        toast({
          description: 'Promotion désactivée avec succès',
        })
        loadPromotionStats()
      } else {
        toast({
          variant: 'destructive',
          description: result.message || 'Erreur lors de la désactivation',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Erreur lors de la désactivation de la promotion',
      })
    }
  }

  if (loading) {
    return <div className='text-center py-8'>Chargement des promotions...</div>
  }

  return (
    <div className='space-y-6'>
      {/* Statistiques des promotions */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Promotions Actives
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {stats.activePromotions}
            </div>
            <p className='text-xs text-muted-foreground'>Promotions en cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Promotions Expirées
            </CardTitle>
            <AlertTriangle className='h-4 w-4 text-orange-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-orange-600'>
              {stats.expiredPromotions}
            </div>
            <p className='text-xs text-muted-foreground'>À traiter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Promotions
            </CardTitle>
            <Tag className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {stats.totalPromotions}
            </div>
            <p className='text-xs text-muted-foreground'>
              Toutes promotions confondues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Guide des promotions */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Clock className='h-5 w-5' />
            Guide des Promotions Temporaires
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-3'>
              <h4 className='font-semibold text-green-700'>
                ✅ Comment ça marche :
              </h4>
              <ul className='text-sm space-y-2 text-gray-600'>
                <li>
                  • Définissez une <strong>date d'expiration</strong> pour
                  chaque promotion
                </li>
                <li>
                  • Le système <strong>expire automatiquement</strong> les
                  promotions
                </li>
                <li>
                  • Les tags sont <strong>ajustés intelligemment</strong> selon
                  les performances
                </li>
                <li>
                  • Les produits performants deviennent{' '}
                  <strong>best-seller</strong> automatiquement
                </li>
              </ul>
            </div>

            <div className='space-y-3'>
              <h4 className='font-semibold text-blue-700'>
                🎯 Tags automatiques :
              </h4>
              <ul className='text-sm space-y-2 text-gray-600'>
                <li>
                  • <Badge variant='outline'>best-seller</Badge> : Si +10 ventes
                  pendant la promotion
                </li>
                <li>
                  • <Badge variant='outline'>featured</Badge> : Si bien vendu
                </li>
                <li>
                  • <Badge variant='outline'>new-arrival</Badge> : Si produit
                  récent (&lt;30 jours)
                </li>
                <li>
                  • <Badge variant='outline'>premium</Badge> : Si prix &gt;500€
                </li>
              </ul>
            </div>
          </div>

          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <h5 className='font-semibold text-blue-800 mb-2'>
              💡 Exemple de cycle de promotion :
            </h5>
            <div className='text-sm text-blue-700 space-y-1'>
              <p>
                <strong>Jour 1-7 :</strong> Produit en promotion avec tag{' '}
                <code>todays-deal</code>
              </p>
              <p>
                <strong>Jour 8 :</strong> Promotion expirée, tags ajustés
                automatiquement
              </p>
              <p>
                <strong>Résultat :</strong> Si bien vendu →{' '}
                <code>best-seller</code> + <code>featured</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-2'>
            <Button
              variant='outline'
              onClick={() => loadPromotionStats()}
              className='flex items-center gap-2'
            >
              <Calendar className='h-4 w-4' />
              Actualiser les statistiques
            </Button>

            <Button
              variant='outline'
              onClick={() => {
                toast({
                  description:
                    'Fonctionnalité à venir : Planification automatique des promotions',
                })
              }}
              className='flex items-center gap-2'
            >
              <Clock className='h-4 w-4' />
              Planifier une promotion
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PromotionsTable
