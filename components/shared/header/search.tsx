'use client'

import { SearchIcon, X, Filter, Clock, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { useTranslations } from 'next-intl'
import { ICategory } from '@/types'
import { useState, useRef, useEffect } from 'react'

interface SearchProps {
  categories: (ICategory & { subCategories: ICategory[] })[]
  siteName: string
}

export default function Search({ categories, siteName }: SearchProps) {
  const t = useTranslations()
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<
    Array<{
      type: 'product' | 'category' | 'subcategory' | 'recent'
      text: string
      category?: string
      brand?: string
      subCategory?: string
    }>
  >([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  // Charger les recherches récentes depuis le localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recent-searches')
    if (savedSearches) {
      try {
        const searches = JSON.parse(savedSearches)
        setRecentSearches(searches.slice(0, 5)) // Limiter à 5 recherches récentes
      } catch (error) {
        console.error(
          'Erreur lors du chargement des recherches récentes:',
          error
        )
      }
    }
  }, [])

  // Générer des suggestions intelligentes depuis l'API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchValue.trim().length >= 2) {
        setIsLoadingSuggestions(true)

        try {
          const response = await fetch(
            `/api/search/suggestions?q=${encodeURIComponent(searchValue.trim())}`
          )

          if (response.ok) {
            const data = await response.json()

            // Combiner avec les recherches récentes
            const recentSuggestions = recentSearches
              .filter(
                (term) =>
                  term.toLowerCase().includes(searchValue.toLowerCase()) &&
                  term.toLowerCase() !== searchValue.toLowerCase()
              )
              .map((term) => ({
                type: 'recent' as const,
                text: term,
              }))

            // Combiner toutes les suggestions
            const allSuggestions = [...recentSuggestions, ...data.suggestions]

            // Dédupliquer et limiter
            const uniqueSuggestions = allSuggestions
              .filter(
                (suggestion, index, self) =>
                  index === self.findIndex((s) => s.text === suggestion.text)
              )
              .slice(0, 8)

            setSuggestions(uniqueSuggestions)
            setShowSuggestions(uniqueSuggestions.length > 0)
            setSelectedSuggestionIndex(-1)
          } else {
            console.error('Erreur lors de la récupération des suggestions')
            setSuggestions([])
            setShowSuggestions(false)
          }
        } catch (error) {
          console.error(
            'Erreur lors de la récupération des suggestions:',
            error
          )
          setSuggestions([])
          setShowSuggestions(false)
        } finally {
          setIsLoadingSuggestions(false)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
      }
    }

    // Debounce pour éviter trop d'appels API
    const timeoutId = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [searchValue, recentSearches])

  // Focus sur l'input quand la recherche s'étend
  useEffect(() => {
    if (isExpanded && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isExpanded])

  // Gestion des touches clavier pour les suggestions
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showSuggestions) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedSuggestionIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedSuggestionIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          )
          break
        case 'Enter':
          event.preventDefault()
          if (
            selectedSuggestionIndex >= 0 &&
            suggestions[selectedSuggestionIndex]
          ) {
            const selectedSuggestion = suggestions[selectedSuggestionIndex]
            setSearchValue(selectedSuggestion.text)
            setShowSuggestions(false)

            // Sauvegarder la recherche dans les recherches récentes
            const searchTerm = selectedSuggestion.text.trim()
            const currentSearches = recentSearches.filter(
              (term) => term !== searchTerm
            )
            const newSearches = [searchTerm, ...currentSearches].slice(0, 5)

            setRecentSearches(newSearches)
            localStorage.setItem('recent-searches', JSON.stringify(newSearches))

            // Déclencher la recherche
            setTimeout(() => {
              window.location.href = `/search?q=${encodeURIComponent(selectedSuggestion.text)}`
            }, 100)
          }
          break
        case 'Escape':
          setShowSuggestions(false)
          setSelectedSuggestionIndex(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSuggestions, suggestions, selectedSuggestionIndex, recentSearches])

  // Fermer la recherche étendue et les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element

      // Ne pas fermer si on clique sur des éléments du Select, des suggestions, ou du container de recherche
      const isClickInsideSearch = target.closest('.search-container')
      const isClickInsideSelect =
        target.closest('[data-radix-popper-content-wrapper]') ||
        target.closest('[data-radix-select-content]') ||
        target.closest('[data-radix-select-item]') ||
        target.closest('[role="option"]') ||
        target.closest('[data-state]')

      if (isClickInsideSearch || isClickInsideSelect) {
        return // Ne rien faire si on clique dans la zone de recherche
      }

      // Fermer les suggestions sur desktop
      if (showSuggestions && !isExpanded) {
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
      }

      // Fermer la recherche étendue sur mobile
      if (isExpanded) {
        setIsExpanded(false)
        setShowFilters(false)
        setShowSuggestions(false)
      }
    }

    // Utiliser un délai pour éviter les fermetures accidentelles
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded, showSuggestions])

  const handleSearchClick = () => {
    setIsExpanded(true)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      const searchTerm = searchValue.trim()

      // Sauvegarder la recherche dans le localStorage
      const currentSearches = recentSearches.filter(
        (term) => term !== searchTerm
      )
      const newSearches = [searchTerm, ...currentSearches].slice(0, 5)

      setRecentSearches(newSearches)
      localStorage.setItem('recent-searches', JSON.stringify(newSearches))

      // Fermer les suggestions
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)

      // Redirection vers la page de recherche
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`
    }
  }

  const clearSearch = () => {
    setSearchValue('')
    setIsExpanded(false)
    setShowFilters(false)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
  }

  const removeRecentSearch = (termToRemove: string) => {
    const newSearches = recentSearches.filter((term) => term !== termToRemove)
    setRecentSearches(newSearches)
    localStorage.setItem('recent-searches', JSON.stringify(newSearches))
  }

  const clearAllRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recent-searches')
  }

  // Empêcher la fermeture lors de la sélection d'une catégorie
  const handleCategoryChange = (value: string) => {
    // Ne pas fermer la recherche quand on change de catégorie
    console.log('Catégorie sélectionnée:', value)
  }

  return (
    <div className='search-container relative'>
      {/* Desktop Search */}
      <div className='hidden lg:block'>
        <div className='relative'>
          <form onSubmit={handleSearchSubmit} className='space-y-4'>
          <div className='relative'>
            <div className='flex items-stretch h-14 rounded-2xl overflow-hidden bg-background/60 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 ring-1 ring-white/10'>
              <Select name='category'>
                <SelectTrigger className='w-auto h-full bg-gradient-to-br from-muted/40 to-muted/20 border-0 rounded-none border-r border-white/20 focus:ring-0 backdrop-blur-sm'>
                  <SelectValue placeholder={t('Header.All')} />
                </SelectTrigger>
                <SelectContent
                  position='popper'
                  className='border-0 shadow-2xl bg-background/95 backdrop-blur-xl ring-1 ring-white/20'
                >
                  <SelectItem value='all'>{t('Header.All')}</SelectItem>
                  {categories.map((category) => (
                    <div key={category._id}>
                      <SelectItem value={category.name}>
                        {category.name}
                      </SelectItem>
                      {category.subCategories &&
                        category.subCategories.length > 0 && (
                          <>
                            {category.subCategories.map((subCategory) => (
                              <SelectItem
                                key={subCategory._id}
                                value={`${category.name}|${subCategory.name}`}
                                className='ml-4 text-sm'
                              >
                                └ {subCategory.name}
                              </SelectItem>
                            ))}
                          </>
                        )}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <Input
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value)
                    setShowSuggestions(e.target.value.trim().length >= 2)
                  }}
                  onFocus={() =>
                    setShowSuggestions(searchValue.trim().length >= 2)
                  }
                className='flex-1 border-0 rounded-none bg-transparent text-foreground text-base h-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60'
                placeholder={t('Header.Search Site', { name: siteName })}
                type='search'
                  autoComplete='off'
              />
              <button
                type='submit'
                className='bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground h-full px-6 py-2 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl'
              >
                <SearchIcon className='w-5 h-5' />
              </button>
            </div>
            {/* Glow effect */}
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
          </div>
        </form>

          {/* Suggestions Desktop */}
          {showSuggestions && (
            <div className='absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto'>
              <div className='p-2'>
                <div className='flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground mb-1 border-b border-border/30'>
                  <TrendingUp className='w-3.5 h-3.5' />
                  <span className='font-medium'>Suggestions</span>
                  {isLoadingSuggestions && (
                    <span className='ml-auto text-xs opacity-70'>
                      Chargement...
                    </span>
                  )}
                </div>
                {suggestions.length > 0 ? (
                  <div className='py-1'>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`${suggestion.type}-${suggestion.text}-${index}`}
                        onClick={(e) => {
                          e.preventDefault()
                          setSearchValue(suggestion.text)
                          setShowSuggestions(false)
                          setSelectedSuggestionIndex(-1)

                          // Sauvegarder la recherche
                          const searchTerm = suggestion.text.trim()
                          const currentSearches = recentSearches.filter(
                            (term) => term !== searchTerm
                          )
                          const newSearches = [
                            searchTerm,
                            ...currentSearches,
                          ].slice(0, 5)

                          setRecentSearches(newSearches)
                          localStorage.setItem(
                            'recent-searches',
                            JSON.stringify(newSearches)
                          )

                          // Déclencher la recherche
                          setTimeout(() => {
                            window.location.href = `/search?q=${encodeURIComponent(suggestion.text)}`
                          }, 100)
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 ${
                          index === selectedSuggestionIndex
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'hover:bg-muted/50 text-foreground border border-transparent'
                        }`}
                      >
                        <SearchIcon className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                        <div className='flex-1 min-w-0'>
                          <div className='font-medium truncate'>
                            {suggestion.text}
                          </div>
                          {suggestion.type === 'product' &&
                            suggestion.brand && (
                              <div className='text-xs text-muted-foreground truncate'>
                                {suggestion.brand} • {suggestion.category}
                              </div>
                            )}
                          {suggestion.type === 'category' && (
                            <div className='text-xs text-muted-foreground'>
                              Catégorie
                            </div>
                          )}
                          {suggestion.type === 'subcategory' && (
                            <div className='text-xs text-muted-foreground truncate'>
                              Sous-catégorie • {suggestion.category}
                            </div>
                          )}
                          {suggestion.type === 'recent' && (
                            <div className='text-xs text-muted-foreground flex items-center gap-1'>
                              <Clock className='w-3 h-3' />
                              Recherche récente
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : !isLoadingSuggestions ? (
                  <div className='px-3 py-4 text-sm text-muted-foreground text-center'>
                    Aucune suggestion trouvée
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search - Collé au menu */}
      <div className='lg:hidden'>
        {/* Barre de recherche compacte (état par défaut) - Espacée du menu */}
        {!isExpanded && (
          <button
            onClick={handleSearchClick}
            className='flex items-center justify-center gap-1 h-8 sm:h-9 md:h-10 px-2 sm:px-2 md:px-3 rounded-full sm:rounded-lg bg-background/90 backdrop-blur-sm border border-border/60 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 text-sm text-muted-foreground hover:text-foreground ml-2 sm:ml-3'
          >
            <SearchIcon className='w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5' />
            {/* Très petits écrans (< 375px) : Seulement l'icône */}
            <span className='font-medium text-xs hidden min-[375px]:inline sm:hidden'>
              {t('Header.Search')}
            </span>
            {/* Petits écrans (375px - 768px) : Icône + "Recherche" */}
            <span className='font-medium text-xs hidden sm:inline md:hidden'>
              {t('Header.Search')}
            </span>
            {/* Écrans moyens (768px+) : Icône + "Rechercher" */}
            <span className='font-medium text-xs hidden md:inline'>
              {t('Search.Search')}
            </span>
          </button>
        )}

        {/* Barre de recherche étendue */}
        {isExpanded && (
          <div className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300'>
            <div className='absolute top-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg animate-in slide-in-from-top duration-300'>
              <div className='px-4 py-3 space-y-3'>
                {/* Header avec bouton fermer */}
                <div className='flex items-center justify-between'>
                  <h2 className='text-lg font-semibold'>{t('Search.Search')}</h2>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={clearSearch}
                    className='h-8 w-8 p-0 hover:bg-muted/50'
                  >
                    <X className='w-4 h-4' />
                  </Button>
                </div>

                {/* Barre de recherche principale */}
                <form onSubmit={handleSearchSubmit} className='space-y-3'>
                  <div className='relative'>
                    <div className='flex items-stretch h-12 rounded-xl overflow-hidden bg-background border border-border shadow-sm'>
                      <Input
                        ref={searchRef}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() =>
                          setShowSuggestions(searchValue.trim().length >= 2)
                        }
                        className='flex-1 border-0 rounded-none bg-transparent text-foreground text-base h-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 px-4'
                        placeholder={t('Header.Search Site', {
                          name: siteName,
                        })}
                        type='search'
                        autoComplete='off'
                      />
                      <button
                        type='submit'
                        className='bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground h-full px-4 py-2 transition-all duration-200 flex items-center justify-center'
                      >
                        <SearchIcon className='w-5 h-5' />
                      </button>
                    </div>

                    {/* Suggestions intelligentes */}
                    {showSuggestions && (
                      <div className='absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto'>
                        <div className='p-2'>
                          <div className='flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground mb-2'>
                            <TrendingUp className='w-3 h-3' />
                            Suggestions{' '}
                            {isLoadingSuggestions && '(Chargement...)'}
                          </div>
                          {suggestions.length > 0
                            ? suggestions.map((suggestion, index) => (
                                <button
                                  key={`${suggestion.type}-${suggestion.text}-${index}`}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setSearchValue(suggestion.text)
                                    setShowSuggestions(false)
                                    setSelectedSuggestionIndex(-1)

                                    // Sauvegarder la recherche dans les recherches récentes
                                    const searchTerm = suggestion.text.trim()
                                    const currentSearches =
                                      recentSearches.filter(
                                        (term) => term !== searchTerm
                                      )
                                    const newSearches = [
                                      searchTerm,
                                      ...currentSearches,
                                    ].slice(0, 5)

                                    setRecentSearches(newSearches)
                                    localStorage.setItem(
                                      'recent-searches',
                                      JSON.stringify(newSearches)
                                    )

                                    // Déclencher la recherche
                                    setTimeout(() => {
                                      window.location.href = `/search?q=${encodeURIComponent(suggestion.text)}`
                                    }, 100)
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 flex items-center gap-2 ${
                                    index === selectedSuggestionIndex
                                      ? 'bg-primary/10 text-primary'
                                      : 'hover:bg-muted/50 text-foreground'
                                  }`}
                                >
                                  <SearchIcon className='w-3 h-3 text-muted-foreground' />
                                  <div className='flex-1'>
                                    <div className='font-medium'>
                                      {suggestion.text}
                                    </div>
                                    {suggestion.type === 'product' &&
                                      suggestion.brand && (
                                        <div className='text-xs text-muted-foreground'>
                                          {suggestion.brand} •{' '}
                                          {suggestion.category}
                                        </div>
                                      )}
                                    {suggestion.type === 'category' && (
                                      <div className='text-xs text-muted-foreground'>
                                        Catégorie
                                      </div>
                                    )}
                                    {suggestion.type === 'subcategory' && (
                                      <div className='text-xs text-muted-foreground'>
                                        Sous-catégorie • {suggestion.category}
                                      </div>
                                    )}
                                    {suggestion.type === 'recent' && (
                                      <div className='text-xs text-muted-foreground flex items-center gap-1'>
                                        <Clock className='w-3 h-3' />
                                        Recherche récente
                                      </div>
                                    )}
                                  </div>
                                </button>
                              ))
                            : !isLoadingSuggestions && (
                                <div className='px-3 py-2 text-sm text-muted-foreground'>
                                  Aucune suggestion trouvée
                                </div>
                              )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bouton filtres */}
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setShowFilters(!showFilters)}
                    className='w-full h-10 justify-between'
                  >
                    <span className='flex items-center gap-2'>
                      <Filter className='w-4 h-4' />
                      Catégories
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {showFilters ? 'Masquer' : 'Afficher'}
                    </span>
                  </Button>

                  {/* Filtres de catégories */}
                  {showFilters && (
                    <div className='animate-in slide-in-from-top duration-200 space-y-2'>
                      <Select
                        name='category'
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger className='h-10'>
                          <SelectValue placeholder={t('Header.All')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>{t('Header.All')}</SelectItem>
                          {categories.map((category) => (
                            <div key={category._id}>
                              <SelectItem value={category.name}>
                                {category.name}
                              </SelectItem>
                              {category.subCategories &&
                                category.subCategories.length > 0 && (
                                  <>
                                    {category.subCategories.map(
                                      (subCategory) => (
                                        <SelectItem
                                          key={subCategory._id}
                                          value={`${category.name}|${subCategory.name}`}
                                          className='ml-4 text-sm'
                                        >
                                          └ {subCategory.name}
                                        </SelectItem>
                                      )
                                    )}
                                  </>
                                )}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form>

                {/* Recherches récentes dynamiques */}
                {recentSearches.length > 0 && (
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm text-muted-foreground'>
                        Recherches récentes ({recentSearches.length})
                      </p>
                      <button
                        onClick={clearAllRecentSearches}
                        className='text-xs text-muted-foreground hover:text-foreground transition-colors duration-200'
                      >
                        Tout effacer
                      </button>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {recentSearches.map((term) => (
                        <div
                          key={term}
                          className='flex items-center gap-1 px-3 py-1 text-xs bg-muted/50 hover:bg-muted rounded-full transition-colors duration-200 group'
                        >
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              setSearchValue(term)
                            }}
                            className='flex-1 text-left'
                          >
                            {term}
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              removeRecentSearch(term)
                            }}
                            className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-500'
                          >
                            <X className='w-3 h-3' />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
