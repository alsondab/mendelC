import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité - MendelCorp',
  description:
    'Découvrez comment nous collectons, utilisons et protégeons vos informations personnelles.',
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-foreground mb-8'>
          Politique de Confidentialité
        </h1>

        <div className='bg-muted/50 p-6 rounded-lg'>
          <p className='text-muted-foreground text-lg'>
            Chez MendelCorp, nous nous engageons à protéger votre vie privée et
            vos données personnelles. Cette politique explique comment nous
            collectons, utilisons et protégeons vos informations. En utilisant
            notre site, vous acceptez les pratiques décrites dans cette
            politique de confidentialité.
          </p>
        </div>
      </div>
    </div>
  )
}
