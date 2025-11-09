import { NextRequest, NextResponse } from 'next/server'
import { getSearchSuggestions } from '@/lib/actions/search.actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    // Utiliser la Server Action (réutilisable)
    const result = await getSearchSuggestions(query)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
