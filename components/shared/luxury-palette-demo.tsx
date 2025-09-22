'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

/**
 * Composant de démonstration de la palette luxueuse Or et Rouge
 * Ce composant montre comment utiliser les nouvelles classes de couleurs
 */
export default function LuxuryPaletteDemo() {
  return (
    <div className='p-8 space-y-8'>
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold luxury-gradient-text'>
          Palette Luxueuse Or et Rouge
        </h1>
        <p className='text-lg text-muted-foreground'>
          Découvrez notre nouvelle palette de couleurs harmonieuse
        </p>
      </div>

      {/* Couleurs Or */}
      <Card className='luxury-shadow'>
        <CardHeader>
          <CardTitle className='luxury-gold'>Couleurs Or</CardTitle>
          <CardDescription>
            Différentes nuances d&apos;or pour un look luxueux
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='space-y-2'>
              <div className='h-16 bg-luxury-gold rounded-lg'></div>
              <p className='text-sm font-medium'>Or Luxueux</p>
              <p className='text-xs text-muted-foreground'>bg-luxury-gold</p>
            </div>
            <div className='space-y-2'>
              <div className='h-16 bg-luxury-gold-light rounded-lg'></div>
              <p className='text-sm font-medium'>Or Clair</p>
              <p className='text-xs text-muted-foreground'>
                bg-luxury-gold-light
              </p>
            </div>
            <div className='space-y-2'>
              <div className='h-16 bg-luxury-gold-dark rounded-lg'></div>
              <p className='text-sm font-medium'>Or Foncé</p>
              <p className='text-xs text-muted-foreground'>
                bg-luxury-gold-dark
              </p>
            </div>
            <div className='space-y-2'>
              <div className='h-16 bg-luxury-cream rounded-lg'></div>
              <p className='text-sm font-medium'>Crème</p>
              <p className='text-xs text-muted-foreground'>bg-luxury-cream</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Couleurs Rouge */}
      <Card className='luxury-shadow'>
        <CardHeader>
          <CardTitle className='luxury-red'>Couleurs Rouge</CardTitle>
          <CardDescription>
            Différentes nuances de rouge pour les accents
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='space-y-2'>
              <div className='h-16 bg-luxury-red rounded-lg'></div>
              <p className='text-sm font-medium'>Rouge Principal</p>
              <p className='text-xs text-muted-foreground'>bg-luxury-red</p>
            </div>
            <div className='space-y-2'>
              <div className='h-16 bg-luxury-red-light rounded-lg'></div>
              <p className='text-sm font-medium'>Rouge Clair</p>
              <p className='text-xs text-muted-foreground'>
                bg-luxury-red-light
              </p>
            </div>
            <div className='space-y-2'>
              <div className='h-16 bg-luxury-red-dark rounded-lg'></div>
              <p className='text-sm font-medium'>Rouge Foncé</p>
              <p className='text-xs text-muted-foreground'>
                bg-luxury-red-dark
              </p>
            </div>
            <div className='space-y-2'>
              <div className='h-16 bg-luxury-red-luxury rounded-lg'></div>
              <p className='text-sm font-medium'>Rouge Luxueux</p>
              <p className='text-xs text-muted-foreground'>
                bg-luxury-red-luxury
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Boutons d'exemple */}
      <Card className='luxury-shadow'>
        <CardHeader>
          <CardTitle>Boutons avec la Palette Luxueuse</CardTitle>
          <CardDescription>
            Exemples d&apos;utilisation des couleurs dans les boutons
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-4'>
            <Button className='luxury-gold-bg hover:bg-luxury-gold-dark'>
              Bouton Or
            </Button>
            <Button className='luxury-red-bg hover:bg-luxury-red-dark'>
              Bouton Rouge
            </Button>
            <Button
              variant='outline'
              className='luxury-gold-border text-luxury-gold hover:bg-luxury-gold hover:text-white'
            >
              Bouton Or Outline
            </Button>
            <Button
              variant='outline'
              className='luxury-red-border text-luxury-red hover:bg-luxury-red hover:text-white'
            >
              Bouton Rouge Outline
            </Button>
            <Button className='luxury-gradient text-white'>
              Bouton Dégradé
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Classes utilitaires */}
      <Card className='luxury-shadow'>
        <CardHeader>
          <CardTitle>Classes Utilitaires Disponibles</CardTitle>
          <CardDescription>
            Classes CSS personnalisées pour un style cohérent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div className='space-y-2'>
              <h4 className='font-semibold luxury-gold'>Classes Or :</h4>
              <ul className='space-y-1 text-muted-foreground'>
                <li>
                  <code>.luxury-gold</code> - Texte or
                </li>
                <li>
                  <code>.luxury-gold-bg</code> - Fond or
                </li>
                <li>
                  <code>.luxury-gold-border</code> - Bordure or
                </li>
              </ul>
            </div>
            <div className='space-y-2'>
              <h4 className='font-semibold luxury-red'>Classes Rouge :</h4>
              <ul className='space-y-1 text-muted-foreground'>
                <li>
                  <code>.luxury-red</code> - Texte rouge
                </li>
                <li>
                  <code>.luxury-red-bg</code> - Fond rouge
                </li>
                <li>
                  <code>.luxury-red-border</code> - Bordure rouge
                </li>
              </ul>
            </div>
            <div className='space-y-2'>
              <h4 className='font-semibold luxury-gold'>Effets :</h4>
              <ul className='space-y-1 text-muted-foreground'>
                <li>
                  <code>.luxury-gradient</code> - Dégradé or-rouge
                </li>
                <li>
                  <code>.luxury-gradient-text</code> - Texte dégradé
                </li>
                <li>
                  <code>.luxury-shadow</code> - Ombre dorée
                </li>
                <li>
                  <code>.luxury-hover</code> - Effet hover or
                </li>
              </ul>
            </div>
            <div className='space-y-2'>
              <h4 className='font-semibold luxury-red'>Couleurs Tailwind :</h4>
              <ul className='space-y-1 text-muted-foreground'>
                <li>
                  <code>bg-luxury-gold</code> - Fond or
                </li>
                <li>
                  <code>text-luxury-red</code> - Texte rouge
                </li>
                <li>
                  <code>border-luxury-gold</code> - Bordure or
                </li>
                <li>
                  <code>hover:bg-luxury-red</code> - Hover rouge
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
