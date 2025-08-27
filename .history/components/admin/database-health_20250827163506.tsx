'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle, Database, Users, RefreshCw } from 'lucide-react'

interface DatabaseStats {
  users: number
  accounts: number
  duplicateAccounts: number
  orphanedAccounts: number
  lastCheck: string
}

export default function DatabaseHealth() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDatabaseStats = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/admin/database-health')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques')
      }
      
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const runCleanup = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/admin/cleanup-database', {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors du nettoyage')
      }
      
      const result = await response.json()
      console.log('Nettoyage terminé:', result)
      
      // Rafraîchir les statistiques
      await fetchDatabaseStats()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du nettoyage')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDatabaseStats()
  }, [])

  const getHealthStatus = () => {
    if (!stats) return 'unknown'
    
    if (stats.duplicateAccounts > 0 || stats.orphanedAccounts > 0) {
      return 'warning'
    }
    
    return 'healthy'
  }

  const getHealthIcon = () => {
    const status = getHealthStatus()
    
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Database className="h-5 w-5 text-gray-500" />
    }
  }

  const getHealthColor = () => {
    const status = getHealthStatus()
    
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!stats && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Santé de la Base de Données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Impossible de charger les statistiques de la base de données.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Santé de la Base de Données
        </CardTitle>
        <CardDescription>
          Surveillez l'état de votre base de données et détectez les problèmes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Statut</span>
                <Badge className={getHealthColor()}>
                  {getHealthIcon()}
                  {getHealthStatus() === 'healthy' ? 'Sain' : 
                   getHealthStatus() === 'warning' ? 'Attention' : 'Inconnu'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Utilisateurs</span>
                <span className="text-2xl font-bold">{stats.users}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Comptes OAuth</span>
                <span className="text-2xl font-bold">{stats.accounts}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Comptes dupliqués</span>
                <Badge variant={stats.duplicateAccounts > 0 ? 'destructive' : 'secondary'}>
                  {stats.duplicateAccounts}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Comptes orphelins</span>
                <Badge variant={stats.orphanedAccounts > 0 ? 'destructive' : 'secondary'}>
                  {stats.orphanedAccounts}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dernière vérification</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(stats.lastCheck).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={fetchDatabaseStats} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          {stats && (stats.duplicateAccounts > 0 || stats.orphanedAccounts > 0) && (
            <Button 
              onClick={runCleanup} 
              disabled={loading}
              variant="destructive"
              size="sm"
            >
              Nettoyer la Base
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
