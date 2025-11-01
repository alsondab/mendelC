import { NextRequest, NextResponse } from 'next/server'
import { getCachedSearchSuggestions } from '@/lib/cache/search-cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    // Utiliser le cache pour les suggestions
    const cachedResult = await getCachedSearchSuggestions(query)

    return NextResponse.json(cachedResult)
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
