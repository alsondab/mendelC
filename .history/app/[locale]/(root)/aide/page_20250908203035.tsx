import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aide - MendelCorp',
  description:
    'Trouvez de l&apos;aide et des réponses à vos questions sur notre plateforme.',
}

export default function AidePage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-foreground mb-8'>Aide</h1>

        <div className='space-y-8'>
          <section className='bg-muted/50 p-6 rounded-lg'>
            <h2 className='text-2xl font-semibold text-foreground mb-4'>
              Comment pouvons-nous vous aider ?
            </h2>
            <p className='text-muted-foreground mb-4'>
              Notre équipe d&apos;assistance est là pour vous accompagner et
              répondre à toutes vos questions concernant nos produits et
              services.
            </p>
          </section>

          <section className='grid md:grid-cols-2 gap-6'>
            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Commandes et Livraison
              </h3>
              <div className='space-y-3'>
                <div className='border-b border-border pb-3'>
                  <h4 className='font-semibold text-foreground mb-2'>
                    Comment passer une commande ?
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Ajoutez les produits à votre panier, procédez au checkout et
                    suivez les étapes de commande.
                  </p>
                </div>
                <div className='border-b border-border pb-3'>
                  <h4 className='font-semibold text-foreground mb-2'>
                    Suivi de commande
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Consultez notre page de{' '}
                    <Link
                      href='/suivi-livraison'
                      className='text-primary hover:underline'
                    >
                      suivi de livraison
                    </Link>{' '}
                    pour suivre votre commande en temps réel.
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold text-foreground mb-2'>
                    Délais de livraison
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Livraison standard : 3-5 jours ouvrés. Options express
                    disponibles.
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Paiements et Facturation
              </h3>
              <div className='space-y-3'>
                <div className='border-b border-border pb-3'>
                  <h4 className='font-semibold text-foreground mb-2'>
                    Méthodes de paiement
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Cartes de crédit, PayPal, virement bancaire et paiement à la
                    livraison.
                  </p>
                </div>
                <div className='border-b border-border pb-3'>
                  <h4 className='font-semibold text-foreground mb-2'>
                    Sécurité des paiements
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Tous les paiements sont sécurisés avec un cryptage SSL. Nous
                    ne stockons pas vos informations de carte.
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold text-foreground mb-2'>
                    Factures
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Vos factures sont disponibles dans votre compte et envoyées
                    par email.
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Retours et Échanges
              </h3>
              <div className='space-y-3'>
                <div className='border-b border-border pb-3'>
                  <h4 className='font-semibold text-foreground mb-2'>
                    Politique de retour
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Consultez notre{' '}
                    <a
                      href='/politique-retour'
                      className='text-primary hover:underline'
                    >
                      politique de retour
                    </a>{' '}
                    pour connaître les conditions et délais.
                  </p>
                </div>
                <div className='border-b border-border pb-3'>
                  <h4 className='font-semibold text-foreground mb-2'>
                    Processus de retour
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Contactez notre service client pour obtenir une étiquette de
                    retour gratuite.
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold text-foreground mb-2'>
                    Remboursements
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Remboursement traité sous 5-7 jours ouvrés après réception
                    de l&apos;article.
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Support Technique
              </h3>
              <div className='space-y-3'>
                <div className='border-b border-border pb-3'>
                  <h4 className='font-semibold text-foreground mb-2'>
                    Installation
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Guides d&apos;installation fournis avec chaque produit.
                    Support technique disponible.
                  </p>
                </div>
                <div className='border-b border-border pb-3'>
                  <h4 className='font-semibold text-foreground mb-2'>
                    Garantie
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Tous nos produits sont couverts par la garantie du fabricant
                    (1-3 ans selon le produit).
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold text-foreground mb-2'>
                    Compatibilité
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Vérifiez les compatibilités avant l&apos;achat. Notre équipe
                    peut vous conseiller.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className='bg-background border border-border rounded-lg p-6'>
            <h3 className='text-xl font-semibold text-foreground mb-4'>
              Questions Fréquentes
            </h3>
            <div className='space-y-4'>
              <div className='border-b border-border pb-4'>
                <h4 className='font-semibold text-foreground mb-2'>
                  Puis-je modifier ma commande ?
                </h4>
                <p className='text-sm text-muted-foreground'>
                  Oui, tant que la commande n&apos;a pas été expédiée. Contactez
                  notre service client rapidement.
                </p>
              </div>
              <div className='border-b border-border pb-4'>
                <h4 className='font-semibold text-foreground mb-2'>
                  Que faire si un produit est défectueux ?
                </h4>
                <p className='text-sm text-muted-foreground'>
                  Contactez-nous immédiatement. Nous organiserons un échange ou
                  un remboursement sans frais.
                </p>
              </div>
              <div className='border-b border-border pb-4'>
                <h4 className='font-semibold text-foreground mb-2'>
                  Proposez-vous des devis personnalisés ?
                </h4>
                <p className='text-sm text-muted-foreground'>
                  Oui, pour les commandes importantes ou les entreprises.
                  Contactez notre équipe commerciale.
                </p>
              </div>
              <div>
                <h4 className='font-semibold text-foreground mb-2'>
                  Comment créer un compte ?
                </h4>
                <p className='text-sm text-muted-foreground'>
                  Cliquez sur "S&apos;inscrire" en haut à droite, remplissez le
                  formulaire et confirmez votre email.
                </p>
              </div>
            </div>
          </section>

          <section className='bg-muted/50 p-6 rounded-lg'>
            <h3 className='text-xl font-semibold text-foreground mb-4'>
              Besoin d&apos;aide supplémentaire ?
            </h3>
            <p className='text-muted-foreground mb-4'>
              Notre équipe de support est disponible pour vous aider :
            </p>
            <div className='grid md:grid-cols-3 gap-4'>
              <div className='text-center p-4 bg-background border border-border rounded-lg'>
                <div className='bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <span className='text-primary text-xl'>📧</span>
                </div>
                <h4 className='font-semibold mb-2'>Email</h4>
                <p className='text-sm text-muted-foreground mb-3'>
                  support@mendelcorp.com
                </p>
                <p className='text-xs text-muted-foreground'>
                  Réponse sous 24h
                </p>
              </div>
              <div className='text-center p-4 bg-background border border-border rounded-lg'>
                <div className='bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <span className='text-primary text-xl'>📞</span>
                </div>
                <h4 className='font-semibold mb-2'>Téléphone</h4>
                <p className='text-sm text-muted-foreground mb-3'>
                  +1 (555) 123-4567
                </p>
                <p className='text-xs text-muted-foreground'>Lun-Ven 8h-18h</p>
              </div>
              <div className='text-center p-4 bg-background border border-border rounded-lg'>
                <div className='bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <span className='text-primary text-xl'>💬</span>
                </div>
                <h4 className='font-semibold mb-2'>Chat</h4>
                <p className='text-sm text-muted-foreground mb-3'>
                  Support en direct
                </p>
                <p className='text-xs text-muted-foreground'>Disponible 24/7</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
