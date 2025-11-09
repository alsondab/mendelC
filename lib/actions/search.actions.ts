'use server'

import { getCachedSearchSuggestions } from '@/lib/cache/search-cache'

/**
 * Server Action pour récupérer les suggestions de recherche
 * Plus rapide qu'une API Route car appel direct sans surcharge HTTP
 */
export async function getSearchSuggestions(query: string) {
  try {
    if (!query || query.trim().length < 2) {
      return { suggestions: [], total: 0 }
    }

    const result = await getCachedSearchSuggestions(query.trim())
    return result
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions:', error)
    return { suggestions: [], total: 0 }
  }
}
