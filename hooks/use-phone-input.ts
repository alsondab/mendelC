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

      // Supprimer le code pays s'il est présent (pour éviter la duplication)
      value = value.replace(countryCode, '').trim()

      // Supprimer tous les caractères non numériques
      value = value.replace(/[^\d]/g, '')

      // Limiter à 10 chiffres
      value = value.substring(0, 10)

      // Formater avec des espaces
      if (value.length > 0) {
        const formatted = value.replace(
          /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
          '$1 $2 $3 $4 $5'
        )
        // Retourner SEULEMENT les chiffres formatés, pas le code pays
        onValueChange?.(formatted.trim())
      } else {
        onValueChange?.('')
      }
    },
    [countryCode, onValueChange]
  )

  return {
    handlePhoneChange,
    maxLength: 14, // 10 chiffres + 4 espaces
  }
}
