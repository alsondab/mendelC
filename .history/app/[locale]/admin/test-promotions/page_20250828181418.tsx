'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

export default function TestPromotionsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const testPromotions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/cron/check-promotions', {
        method: 'POST',
      })
      const data = await response.json()
      setResult(data)

      if (data.success) {
        toast({
          description: `Test réussi: ${data.message}`,
        })
      } else {
        toast({
          variant: 'destructive',
          description: `Erreur: ${data.error}`,
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Erreur lors du test',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>
        🧪 Test du Système de Promotions
      </h1>

      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Test Manuel des Promotions</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Cliquez sur le bouton ci-dessous pour tester manuellement le
              système de vérification des promotions expirées.
            </p>

            <Button
              onClick={testPromotions}
              disabled={isLoading}
              className='w-full'
            >
              {isLoading ? 'Test en cours...' : '🧪 Tester les Promotions'}
            </Button>

            {result && (
              <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                <h3 className='font-semibold mb-2'>Résultat du test :</h3>
                <pre className='text-sm overflow-auto'>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📋 Instructions</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <p>
              <strong>1.</strong> Créez un produit avec une promotion temporaire
            </p>
            <p>
              <strong>2.</strong> Définissez une date d'expiration dans le passé
            </p>
            <p>
              <strong>3.</strong> Cliquez sur "Tester les Promotions"
            </p>
            <p>
              <strong>4.</strong> Vérifiez que les tags ont changé
            </p>
            <p>
              <strong>5.</strong> Vérifiez que le prix est remis à l'original
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔍 Dépannage</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <p>
              <strong>Si les promotions n'expirent pas :</strong>
            </p>
            <ul className='list-disc list-inside ml-4 space-y-1'>
              <li>
                Vérifiez que <code>isPromotionActive</code> est{' '}
                <code>true</code>
              </li>
              <li>
                Vérifiez que <code>promotionExpiryDate</code> est dans le passé
              </li>
              <li>
                Vérifiez que le produit a le tag <code>todays-deal</code>
              </li>
              <li>Vérifiez les logs dans la console</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
