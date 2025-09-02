'use client'

import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function SearchToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const t = useTranslations()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      setQuery('')
    }
  }

  return (
    <>
      {/* Search Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium border border-border/50"
      >
        <Search className="h-4 w-4" />
        <span>{t('Header.Search')}</span>
      </Button>

      {/* Search Popup */}
      {isOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder={t('Header.Search Site', { name: 'Mendel' })}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pr-10"
                  autoFocus
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
