'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { updateAllStockStatus } from '@/lib/actions/stock.actions'

export function RefreshStockButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await updateAllStockStatus()
      // Recharger la page pour afficher les nouvelles données
      window.location.reload()
    } catch (error) {
      console.error("Erreur lors de l'actualisation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleRefresh}
      variant="outline"
      className="gap-2"
      disabled={isLoading}
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Actualisation...' : 'Actualiser tous les statuts'}
    </Button>
  )
}
