import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retours et Remplacements - MendelCorp',
  description:
    'Découvrez notre politique de retour et de remplacement pour tous vos achats.',
}

export default function RetoursRemplacementsPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-foreground mb-8'>
          Retours et Remplacements
        </h1>

        <div className='space-y-8'>
          <section className='bg-muted/50 p-6 rounded-lg'>
            <h2 className='text-2xl font-semibold text-foreground mb-4'>
              Politique de Retour
            </h2>
            <p className='text-muted-foreground mb-4'>
              Nous nous engageons à vous offrir une expérience d&apos;achat
              satisfaisante. Si vous n&apos;êtes pas entièrement satisfait de
              votre achat, nous facilitons les retours et remplacements.
            </p>
            <p className='text-muted-foreground'>
              Tous les retours sont gratuits et faciles à effectuer.
            </p>
          </section>

          <section className='grid md:grid-cols-2 gap-6'>
            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Délai de Retour
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>Délai standard</span>
                  <span className='font-semibold text-primary'>30 jours</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>Produits électroniques</span>
                  <span className='font-semibold'>14 jours</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>Produits personnalisés</span>
                  <span className='font-semibold'>7 jours</span>
                </div>
                <p className='text-sm text-muted-foreground mt-4'>
                  Le délai commence à partir de la date de livraison. Les
                  produits doivent être dans leur état d&apos;origine.
                </p>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Conditions de Retour
              </h3>
              <div className='space-y-3'>
                <div className='flex items-start space-x-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span className='text-sm text-muted-foreground'>
                    Produit dans son emballage d&apos;origine
                  </span>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span className='text-sm text-muted-foreground'>
                    Accessoires et documentation inclus
                  </span>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span className='text-sm text-muted-foreground'>
                    Aucun dommage visible
                  </span>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span className='text-sm text-muted-foreground'>
                    Étiquettes de prix intactes
                  </span>
                </div>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Processus de Retour
              </h3>
              <div className='space-y-3'>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold'>
                    1
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    Connectez-vous à votre compte
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold'>
                    2
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    Sélectionnez la commande à retourner
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold'>
                    3
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    Imprimez l&apos;étiquette de retour
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold'>
                    4
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    Expédiez le colis
                  </span>
                </div>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Remboursements
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>Mode de remboursement</span>
                  <span className='font-semibold'>Même moyen de paiement</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>Délai de traitement</span>
                  <span className='font-semibold'>5-7 jours ouvrés</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>Frais de retour</span>
                  <span className='font-semibold text-green-500'>Gratuit</span>
                </div>
                <p className='text-sm text-muted-foreground mt-4'>
                  Le remboursement sera effectué dès réception et validation du
                  produit retourné.
                </p>
              </div>
            </div>
          </section>

          <section className='bg-background border border-border rounded-lg p-6'>
            <h3 className='text-xl font-semibold text-foreground mb-4'>
              Remplacements
            </h3>
            <div className='space-y-4'>
              <div className='border-b border-border pb-4'>
                <h4 className='font-semibold text-foreground mb-2'>
                  Produit Défectueux
                </h4>
                <p className='text-sm text-muted-foreground'>
                  Si vous recevez un produit défectueux, nous vous enverrons un
                  remplacement immédiatement. Aucun frais supplémentaire.
                </p>
              </div>
              <div className='border-b border-border pb-4'>
                <h4 className='font-semibold text-foreground mb-2'>
                  Erreur de Commande
                </h4>
                <p className='text-sm text-muted-foreground'>
                  En cas d&apos;erreur de notre part, nous nous chargeons de
                  l&apos;échange et des frais de livraison.
                </p>
              </div>
              <div>
                <h4 className='font-semibold text-foreground mb-2'>
                  Changement d&apos;Avis
                </h4>
                <p className='text-sm text-muted-foreground'>
                  Vous pouvez échanger un produit contre un autre de valeur
                  équivalente ou supérieure (différence à votre charge).
                </p>
              </div>
            </div>
          </section>

          <section className='bg-background border border-border rounded-lg p-6'>
            <h3 className='text-xl font-semibold text-foreground mb-4'>
              Produits Non Retournables
            </h3>
            <div className='space-y-3'>
              <p className='text-muted-foreground mb-4'>
                Certains produits ne peuvent pas être retournés pour des raisons
                d&apos;hygiène ou de sécurité :
              </p>
              <ul className='space-y-1 text-sm text-muted-foreground'>
                <li>• Produits personnalisés ou sur mesure</li>
                <li>• Logiciels et licences numériques</li>
                <li>• Produits d&apos;hygiène personnelle</li>
                <li>• Produits alimentaires périssables</li>
                <li>• Produits endommagés par l&apos;utilisateur</li>
                <li>• Produits retournés après le délai</li>
              </ul>
            </div>
          </section>

          <section className='bg-muted/50 p-6 rounded-lg'>
            <h3 className='text-xl font-semibold text-foreground mb-4'>
              Besoin d&apos;Aide ?
            </h3>
            <p className='text-muted-foreground mb-4'>
              Notre équipe de service client est là pour vous accompagner dans
              vos retours et remplacements :
            </p>
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='text-center p-4 bg-background border border-border rounded-lg'>
                <div className='bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <span className='text-primary text-xl'>📧</span>
                </div>
                <h4 className='font-semibold mb-2'>Email</h4>
                <p className='text-sm text-muted-foreground mb-3'>
                  retours@mendelcorp.com
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
                <p className='text-xs text-muted-foreground'>
                  Lun-Ven 8h-18h
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
