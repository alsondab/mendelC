import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Retour - MendelCorp',
  description:
    'Découvrez notre politique de retour simple et flexible pour tous vos achats.',
}

export default function PolitiqueRetourPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-foreground mb-8'>
          Politique de Retour
        </h1>

        <div className='space-y-8'>
          <section className='bg-muted/50 p-6 rounded-lg'>
            <h2 className='text-2xl font-semibold text-foreground mb-4'>
              Retours et échanges
            </h2>
            <p className='text-muted-foreground mb-4'>
              Nous nous engageons à vous offrir une expérience d&apos;achat
              satisfaisante. Notre politique de retour flexible vous permet de
              retourner ou échanger vos articles dans les 30 jours suivant la
              livraison.
            </p>
          </section>

          <section className='grid md:grid-cols-2 gap-6'>
            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Conditions de retour
              </h3>
              <div className='space-y-3 text-sm'>
                <div className='flex items-start space-x-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>Articles neufs et non utilisés</span>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>Emballage d&apos;origine intact</span>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>Accessoires et documentation inclus</span>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>Délai de 30 jours après livraison</span>
                </div>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Processus de retour
              </h3>
              <div className='space-y-3 text-sm'>
                <div className='flex items-center space-x-3'>
                  <div className='w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold'>
                    1
                  </div>
                  <span>Contactez notre service client</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold'>
                    2
                  </div>
                  <span>Recevez votre étiquette de retour</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold'>
                    3
                  </div>
                  <span>Expédiez le colis</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold'>
                    4
                  </div>
                  <span>Remboursement sous 5-7 jours</span>
                </div>
              </div>
            </div>
          </section>

          <section className='bg-background border border-border rounded-lg p-6'>
            <h3 className='text-xl font-semibold text-foreground mb-4'>
              Remboursements
            </h3>
            <div className='grid md:grid-cols-3 gap-4'>
              <div className='text-center p-4 bg-muted/30 rounded-lg'>
                <h4 className='font-semibold mb-2'>Carte de crédit</h4>
                <p className='text-sm text-muted-foreground'>
                  5-7 jours ouvrés
                </p>
              </div>
              <div className='text-center p-4 bg-muted/30 rounded-lg'>
                <h4 className='font-semibold mb-2'>PayPal</h4>
                <p className='text-sm text-muted-foreground'>
                  3-5 jours ouvrés
                </p>
              </div>
              <div className='text-center p-4 bg-muted/30 rounded-lg'>
                <h4 className='font-semibold mb-2'>Virement bancaire</h4>
                <p className='text-sm text-muted-foreground'>
                  7-10 jours ouvrés
                </p>
              </div>
            </div>
          </section>

          <section className='bg-muted/50 p-6 rounded-lg'>
            <h3 className='text-xl font-semibold text-foreground mb-4'>
              Contact pour les retours
            </h3>
            <div className='grid md:grid-cols-2 gap-4'>
              <div>
                <p className='font-semibold mb-2'>Service Client</p>
                <p className='text-sm text-muted-foreground'>
                  support@mendelcorp.com
                </p>
                <p className='text-sm text-muted-foreground'>
                  +1 (555) 123-4567
                </p>
              </div>
              <div>
                <p className='font-semibold mb-2'>Heures d&apos;ouverture</p>
                <p className='text-sm text-muted-foreground'>Lun-Ven: 8h-18h</p>
                <p className='text-sm text-muted-foreground'>Sam: 9h-17h</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
