'use client'

import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, CheckCircle, Languages, Plus, X } from 'lucide-react'
import { MissingTranslation, TranslationValidationResult } from '@/hooks/use-translation-validator'

interface TranslationValidatorProps {
  validationResults: TranslationValidationResult
  onAddTranslation?: (translation: MissingTranslation, frenchValue: string, englishValue: string) => void
  onClearValidation?: () => void
}

export default function TranslationValidator({
  validationResults,
  onAddTranslation,
  onClearValidation
}: TranslationValidatorProps) {
  const [expandedTranslations, setExpandedTranslations] = React.useState<Set<string>>(new Set())
  const [translationInputs, setTranslationInputs] = React.useState<Record<string, { fr: string; en: string }>>({})

  // Initialiser les inputs de traduction
  React.useEffect(() => {
    const inputs: Record<string, { fr: string; en: string }> = {}
    validationResults.missingTranslations.forEach(item => {
      const key = `${item.namespace}.${item.key}`
      inputs[key] = {
        fr: item.suggestedTranslation || item.key,
        en: item.key
      }
    })
    setTranslationInputs(inputs)
  }, [validationResults.missingTranslations])

  const toggleExpanded = (key: string) => {
    const newExpanded = new Set(expandedTranslations)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedTranslations(newExpanded)
  }

  const handleAddTranslation = (item: MissingTranslation) => {
    const key = `${item.namespace}.${item.key}`
    const inputs = translationInputs[key]
    
    if (onAddTranslation && inputs) {
      onAddTranslation(item, inputs.fr, inputs.en)
    }
  }

  const updateTranslationInput = (key: string, language: 'fr' | 'en', value: string) => {
    setTranslationInputs(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [language]: value
      }
    }))
  }

  if (validationResults.isValid) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Toutes les traductions sont valides !</AlertTitle>
        <AlertDescription className="text-green-700">
          Aucune traduction manquante détectée. Votre site est prêt pour toutes les langues.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-orange-800">
              Traductions manquantes détectées
            </CardTitle>
          </div>
          <Badge variant="destructive" className="text-sm">
            {validationResults.totalMissing} manquantes
          </Badge>
        </div>
        <p className="text-sm text-orange-700">
          Ces éléments n&apos;ont pas de traduction et causeront des erreurs sur votre site.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {validationResults.missingTranslations.map((item) => {
          const key = `${item.namespace}.${item.key}`
          const isExpanded = expandedTranslations.has(key)
          const inputs = translationInputs[key] || { fr: '', en: '' }

          return (
            <div key={key} className="border border-orange-200 rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-sm">{item.context}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.namespace}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(key)}
                  className="h-6 px-2"
                >
                  {isExpanded ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                </Button>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                <strong>Clé :</strong> {item.key}
              </div>

              {isExpanded && (
                <div className="space-y-3 pt-2 border-t border-orange-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`fr-${key}`} className="text-xs text-gray-600">
                        Français
                      </Label>
                      <Input
                        id={`fr-${key}`}
                        value={inputs.fr}
                        onChange={(e) => updateTranslationInput(key, 'fr', e.target.value)}
                        placeholder="Traduction française"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`en-${key}`} className="text-xs text-gray-600">
                        English
                      </Label>
                      <Input
                        id={`en-${key}`}
                        value={inputs.en}
                        onChange={(e) => updateTranslationInput(key, 'en', e.target.value)}
                        placeholder="English translation"
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleAddTranslation(item)}
                    className="w-full h-8 text-xs"
                    disabled={!inputs.fr.trim() || !inputs.en.trim()}
                  >
                    Ajouter cette traduction
                  </Button>
                </div>
              )}
            </div>
          )
        })}

        <Separator className="my-4" />
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-orange-700">
            Cliquez sur <Plus className="h-3 w-3 inline" /> pour ajouter les traductions manquantes
          </p>
          {onClearValidation && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearValidation}
              className="h-8"
            >
              Effacer la validation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
