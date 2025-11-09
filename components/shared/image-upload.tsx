'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { UploadButton } from '@/lib/uploadthing'
import { toast } from '@/hooks/use-toast'
import { X, Upload, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  endpoint: 'carouselImageUploader' | 'logoUploader' | 'imageUploader'
  maxSize?: string
  aspectRatio?: 'carousel' | 'logo' | 'square'
  className?: string
  label?: string
  compact?: boolean // ⚡ Optimization: Mode compact pour petits écrans
}

/**
 * ⚡ Optimization: Composant réutilisable pour l'upload d'images avec UploadThing
 *
 * Caractéristiques :
 * - Upload sécurisé via UploadThing (CDN automatique)
 * - Prévisualisation optimisée avec Next/Image
 * - Remplacement d'image facile
 * - Gestion d'erreurs avec toasts
 * - Optimisation automatique des images (formats modernes)
 */
export default function ImageUpload({
  value,
  onChange,
  endpoint,
  maxSize = '8MB',
  aspectRatio = 'square',
  className,
  label,
  compact = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  // ⚡ Optimization: Dimensions selon l'aspect ratio avec responsivité optimisée
  const getAspectRatioClasses = () => {
    if (compact) {
      // Mode ultra-compact pour très petits écrans
      const compactClasses = {
        carousel: 'aspect-[16/6] min-h-[50px] xs:min-h-[60px] sm:min-h-[70px]',
        logo: 'aspect-square max-w-[70px] xs:max-w-[80px] sm:max-w-[100px]',
        square:
          'aspect-square min-h-[50px] xs:min-h-[60px] sm:min-h-[70px] max-h-[70px] xs:max-h-[80px] sm:max-h-[90px]',
      }
      return compactClasses[aspectRatio] || compactClasses.square
    }
    // Mode normal avec responsivité progressive
    const baseClasses = {
      carousel: 'aspect-[16/6] min-h-[100px] xs:min-h-[120px] sm:min-h-[150px]',
      logo: 'aspect-square max-w-[120px] xs:max-w-[150px] sm:max-w-[180px] md:max-w-[200px]',
      square:
        'aspect-square min-h-[120px] xs:min-h-[150px] sm:min-h-[180px] md:min-h-[200px]',
    }
    return baseClasses[aspectRatio] || baseClasses.square
  }

  const handleUploadComplete = (res: { url: string }[]) => {
    if (res && res[0]?.url) {
      onChange(res[0].url)
      toast({
        title: 'Image uploadée avec succès',
        description: "L'image a été optimisée et est prête à être utilisée.",
      })
      setIsUploading(false)
    }
  }

  const handleUploadError = (error: Error) => {
    toast({
      variant: 'destructive',
      title: "Erreur lors de l'upload",
      description:
        error.message || 'Une erreur est survenue lors du téléversement.',
    })
    setIsUploading(false)
  }

  const handleRemove = () => {
    onChange('')
    toast({
      title: 'Image supprimée',
      description: "L'image a été retirée.",
    })
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          htmlFor={`image-upload-${endpoint}`}
          className={cn(
            'block text-[10px] xs:text-xs sm:text-sm font-medium text-foreground',
            compact && 'text-[10px] xs:text-xs'
          )}
        >
          {label}
        </label>
      )}

      {value && value.trim() !== '' ? (
        <div className="relative group">
          {/* ⚡ Optimization: Prévisualisation avec Next/Image pour optimisation automatique */}
          <div
            className={cn(
              'relative overflow-hidden rounded-md border bg-muted',
              getAspectRatioClasses()
            )}
          >
            <Image
              src={value}
              alt={label || 'Image uploadée'}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              // ⚡ Optimization: Lazy loading pour les images déjà uploadées
              loading="lazy"
              // ⚡ Optimization: Qualité réduite pour meilleures performances (60 pour admin)
              quality={60}
              // ⚡ Optimization: Décodage asynchrone pour améliorer le TBT
              decoding="async"
            />

            {/* ⚡ Optimization: Overlay responsive avec boutons ultra-compacts sur très petits écrans */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-1 xs:p-2">
                <div className="w-full max-w-[160px] xs:max-w-[180px] sm:max-w-[200px]">
                  <UploadButton
                    endpoint={endpoint}
                    onClientUploadComplete={(res) => {
                      if (res && res[0]?.url) {
                        onChange(res[0].url)
                        setIsUploading(false)
                      }
                    }}
                    onUploadError={handleUploadError}
                    content={{
                      button: ({ ready }) => (
                        <span className="text-[10px] xs:text-xs sm:text-sm">
                          {ready ? 'Choisir' : 'Chargement...'}
                        </span>
                      ),
                      allowedContent: '',
                    }}
                  />
                </div>
              </div>
            )}
            {!isUploading && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col xs:flex-row items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 p-1 xs:p-1.5 sm:p-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="text-[10px] xs:text-xs sm:text-sm h-6 xs:h-7 sm:h-8 px-1.5 xs:px-2 sm:px-3 min-w-[60px] xs:min-w-[70px]"
                  onClick={() => setIsUploading(true)}
                  aria-label="Remplacer l'image"
                >
                  <Upload
                    className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 mr-0.5 xs:mr-1 sm:mr-2"
                    aria-hidden="true"
                  />
                  <span className="hidden xs:inline">Remplacer</span>
                  <span className="xs:hidden">Rem.</span>
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="text-[10px] xs:text-xs sm:text-sm h-6 xs:h-7 sm:h-8 px-1.5 xs:px-2 sm:px-3 min-w-[60px] xs:min-w-[70px]"
                  onClick={handleRemove}
                  aria-label="Supprimer l'image"
                >
                  <X
                    className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 mr-0.5 xs:mr-1 sm:mr-2"
                    aria-hidden="true"
                  />
                  <span className="hidden xs:inline">Supprimer</span>
                  <span className="xs:hidden">Sup.</span>
                </Button>
              </div>
            )}
          </div>

          {/* ⚡ Optimization: URL affichée pour référence (masquée sur très petits écrans si compact) */}
          {!compact && (
            <div className="mt-1.5 xs:mt-2 text-[10px] xs:text-xs text-muted-foreground truncate">
              URL: {value}
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            'border-2 border-dashed rounded-md',
            getAspectRatioClasses(),
            compact
              ? 'p-1 xs:p-1.5 sm:p-2' // ⚡ Optimization: Padding ultra-compact pour très petits écrans
              : 'p-2 xs:p-3 sm:p-4 md:p-6'
          )}
          role="region"
          aria-label={label || "Zone de téléversement d'image"}
        >
          <div
            className={cn(
              'flex flex-col items-center justify-center h-full',
              compact
                ? 'space-y-0.5 xs:space-y-1 sm:space-y-1.5' // ⚡ Optimization: Espacements ultra-réduits
                : 'space-y-1.5 xs:space-y-2 sm:space-y-3 md:space-y-4'
            )}
          >
            {/* ⚡ Optimization: Icône réduite progressivement selon la taille d'écran */}
            <ImageIcon
              className={cn(
                'text-muted-foreground flex-shrink-0',
                compact
                  ? 'h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6'
                  : 'h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12'
              )}
              aria-hidden="true"
            />
            <div
              className={cn(
                'text-center w-full px-1',
                compact
                  ? 'space-y-0.5'
                  : 'space-y-1 xs:space-y-1.5 sm:space-y-2'
              )}
            >
              {/* ⚡ Optimization: Texte ultra-compact pour très petits écrans */}
              <p
                className={cn(
                  'font-medium text-foreground truncate',
                  compact
                    ? 'text-[9px] xs:text-[10px] sm:text-[11px]'
                    : 'text-[10px] xs:text-xs sm:text-sm'
                )}
              >
                {label || 'Téléverser une image'}
              </p>
              {/* ⚡ Optimization: Masquer les formats sur très petits écrans */}
              {!compact && (
                <p className="hidden xs:block text-[9px] xs:text-[10px] sm:text-xs text-muted-foreground">
                  Formats: JPG, PNG, WebP, AVIF
                </p>
              )}
              <p
                className={cn(
                  'text-muted-foreground',
                  compact
                    ? 'text-[8px] xs:text-[9px] sm:text-[10px]'
                    : 'text-[9px] xs:text-[10px] sm:text-xs'
                )}
              >
                Max: {maxSize}
              </p>
            </div>

            {/* ⚡ Optimization: UploadButton ultra-responsive avec tailles adaptatives */}
            <div
              className={cn(
                'w-full flex justify-center',
                compact
                  ? 'max-w-[120px] xs:max-w-[140px] sm:max-w-[160px]'
                  : 'max-w-[160px] xs:max-w-[180px] sm:max-w-[200px] md:max-w-none'
              )}
            >
              <UploadButton
                endpoint={endpoint}
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                aria-label={`Téléverser une image, taille maximale ${maxSize}`}
                content={{
                  button: ({ ready }) => (
                    <span
                      className={cn(
                        compact
                          ? 'text-[10px] xs:text-[11px] sm:text-xs'
                          : 'text-[11px] xs:text-xs sm:text-sm'
                      )}
                    >
                      {ready ? 'Choisir un fichier' : 'Chargement...'}
                    </span>
                  ),
                  allowedContent: '',
                }}
                className="ut-button:w-full ut-button:text-[10px] xs:ut-button:text-xs sm:ut-button:text-sm ut-button:h-7 xs:ut-button:h-8 sm:ut-button:h-9"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
