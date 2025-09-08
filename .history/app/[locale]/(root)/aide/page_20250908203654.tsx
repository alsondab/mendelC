import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aide et Support - MendelCorp',
  description:
    'Trouvez de l&apos;aide et des réponses à vos questions sur notre plateforme.',
}

export default function AidePage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-foreground mb-8'>
          Aide et Support
        </h1>
        
        <div className='bg-muted/50 p-6 rounded-lg'>
          <p className='text-muted-foreground text-lg'>
            Notre équipe d&apos;assistance est là pour vous accompagner et répondre à toutes 
            vos questions concernant nos produits et services. Nous nous engageons à vous 
            offrir un support de qualité pour une expérience d&apos;achat optimale.
          </p>
        </div>
      </div>
    </div>
  )
}