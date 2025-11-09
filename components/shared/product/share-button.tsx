'use client'

import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { toast } from '@/hooks/use-toast'

interface ShareButtonProps {
  url: string
  title: string
  description?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean // Afficher le texte sur desktop
}

export default function ShareButton({
  url,
  title,
  description,
  className = '',
  size = 'md',
  showText = false,
}: ShareButtonProps) {
  const t = useTranslations('Product')
  const [canShare, setCanShare] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Vérifier si Web Share API est disponible (mobile)
    setCanShare(
      typeof navigator !== 'undefined' &&
        'share' in navigator &&
        window.innerWidth < 768
    )
    setIsMobile(window.innerWidth < 768)
  }, [])

  const shareData = {
    title,
    text: description || title,
    url,
  }

  const handleNativeShare = async () => {
    // Vérifier que nous sommes bien dans un contexte où le partage est possible
    if (typeof navigator === 'undefined' || !navigator.share) {
      console.warn('Web Share API non disponible')
      return
    }

    try {
      // navigator.share() ouvre le menu de partage natif
      // On ne montre PAS de toast de succès car certains navigateurs
      // résolvent la promesse immédiatement même si l'utilisateur n'a pas encore partagé
      await navigator.share(shareData)
      // Pas de toast ici - l'utilisateur sait qu'il a partagé via l'interface native
    } catch (error) {
      // Si l'utilisateur annule (AbortError), ne rien afficher
      if ((error as Error).name === 'AbortError') {
        // L'utilisateur a annulé - pas de toast, c'est normal
        return
      }
      // Autre erreur - on peut afficher un toast d'erreur si nécessaire
      console.error('Erreur lors du partage:', error)
      // Pas de toast d'erreur non plus pour éviter la confusion
    }
  }

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = encodeURIComponent(description || title)

    let shareUrl = ''

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
        break
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`
        break
      default:
        return
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
    // Pas de toast ici car la fenêtre s'ouvre immédiatement
    // Le toast ne s'affiche que si l'utilisateur partage effectivement
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: t('Link copied'),
        description: t('Product link copied to clipboard'),
      })
    } catch (error) {
      console.error('Erreur lors de la copie:', error)
      toast({
        title: t('Error'),
        description: t('Failed to copy link'),
        variant: 'destructive',
      })
    }
  }

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  // Convertir size pour Button component (n'accepte que 'sm', 'lg', 'default', 'icon')
  const buttonSize = size === 'md' ? 'default' : size === 'sm' ? 'sm' : 'lg'

  // Sur mobile avec Web Share API, utiliser le bouton natif
  // Note: canShare est true uniquement si Web Share API est disponible ET on est sur mobile
  if (canShare && isMobile) {
    return (
      <Button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleNativeShare()
        }}
        variant="outline"
        size={buttonSize}
        className={`${sizeClasses[size]} ${className} rounded-full border-red-300 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all shadow-sm hover:shadow-md hover:text-red-600 dark:hover:text-red-400`}
        aria-label={t('Share product')}
      >
        <Share2 className={iconSizeClasses[size]} />
      </Button>
    )
  }

  // Sur desktop ou mobile sans Web Share API, utiliser le menu déroulant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={showText ? 'default' : 'outline'}
          size={showText ? 'default' : buttonSize}
          className={`${
            showText
              ? 'px-4 py-2.5 gap-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all bg-red-600 hover:bg-red-700 text-white'
              : `${sizeClasses[size]} rounded-full border-red-300 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 shadow-sm hover:shadow-md hover:text-red-600 dark:hover:text-red-400`
          } ${className} transition-all`}
          aria-label={t('Share product')}
        >
          <Share2 className={showText ? 'h-4 w-4' : iconSizeClasses[size]} />
          {showText && (
            <span className="hidden sm:inline-block">{t('Share')}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isMobile &&
          typeof navigator !== 'undefined' &&
          'share' in navigator && (
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleNativeShare()
              }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              <span>{t('Share')}</span>
            </DropdownMenuItem>
          )}
        <DropdownMenuItem onClick={() => handleSocialShare('facebook')}>
          <Facebook className="mr-2 h-4 w-4 text-blue-600" />
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare('twitter')}>
          <Twitter className="mr-2 h-4 w-4 text-blue-400" />
          <span>Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare('whatsapp')}>
          <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
          <span>WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare('linkedin')}>
          <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
          <span>LinkedIn</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare('email')}>
          <Mail className="mr-2 h-4 w-4" />
          <span>{t('Email')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard}>
          <Share2 className="mr-2 h-4 w-4" />
          <span>{t('Copy link')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
