import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

type CardItem = {
  title: string
  link: { text: string; href: string }
  items: {
    name: string
    items?: string[]
    image: string
    href: string
  }[]
}

export function HomeCard({ cards }: { cards: CardItem[] }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-4'>
      {cards.map((card) => (
        <Card
          key={card.title}
          className='rounded-2xl flex flex-col shadow-lg hover:shadow-xl transition-shadow'
        >
          <CardContent className='p-3 xs:p-4 sm:p-6 flex-1'>
            <h3 className='text-base xs:text-lg sm:text-xl font-bold mb-3 xs:mb-4 sm:mb-6'>
              {card.title}
            </h3>
            <div className='grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4'>
              {card.items.map((item, index) => {
                // ⚡ Optimization: Priority uniquement pour les 4 premières images de la première carte (above-the-fold)
                const isFirstCard = cards.indexOf(card) === 0
                const isPriority = isFirstCard && index < 4
                return (
                  <Link
                    key={`${item.name}-${index}`}
                    href={item.href}
                    className='flex flex-col group'
                  >
                    <div className='relative overflow-hidden rounded-lg xs:rounded-xl bg-muted/30 p-2 xs:p-3 sm:p-4 mb-2 xs:mb-3 group-hover:bg-muted/50 transition-colors'>
                      {item.image && item.image.trim() !== '' ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          className='aspect-square object-scale-down max-w-full h-auto mx-auto rounded-md xs:rounded-lg'
                          height={80}
                          width={80}
                          sizes='(max-width: 640px) 80px, (max-width: 768px) 100px, 120px'
                          priority={isPriority}
                          loading={isPriority ? 'eager' : 'lazy'}
                          quality={75}
                        />
                      ) : (
                        <div className='aspect-square flex items-center justify-center bg-muted rounded-md xs:rounded-lg'>
                          <span className='text-muted-foreground text-xs'>
                            Aucune image
                          </span>
                        </div>
                      )}
                    </div>
                    <p className='text-center text-xs xs:text-sm whitespace-nowrap overflow-hidden text-ellipsis font-medium'>
                      {item.name}
                    </p>
                  </Link>
                )
              })}
            </div>
          </CardContent>
          {card.link && (
            <CardFooter className='p-3 xs:p-4 sm:p-6 pt-0'>
              <Link
                href={card.link.href}
                className='inline-flex items-center justify-center w-full px-3 xs:px-4 py-2 rounded-lg xs:rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors text-sm xs:text-base'
              >
                {card.link.text}
              </Link>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}
