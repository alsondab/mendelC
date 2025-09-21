import { useCallback } from 'react'

interface UsePhoneInputProps {
  countryCode?: string
  onValueChange?: (value: string) => void
}

export const usePhoneInput = ({
  countryCode = '+225',
  onValueChange,
}: UsePhoneInputProps = {}) => {
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value

      // Supprimer TOUS les codes pays présents (l'utilisateur ne doit pas les saisir)
      while (value.includes(countryCode)) {
        value = value.replace(countryCode, '').trim()
      }

      // Supprimer tous les caractères non numériques
      value = value.replace(/[^\d]/g, '')

      // Limiter à 10 chiffres
      value = value.substring(0, 10)

      // Formater avec des espaces et ajouter le code pays
      if (value.length > 0) {
        const formatted = value.replace(
          /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
          '$1 $2 $3 $4 $5'
        )
        const finalValue = `${countryCode} ${formatted}`
        onValueChange?.(finalValue)
      } else {
        const finalValue = `${countryCode} `
        onValueChange?.(finalValue)
      }
    },
    [countryCode, onValueChange]
  )

  return {
    handlePhoneChange,
    maxLength: 17, // +225 + 10 chiffres + 3 espaces
  }
}
