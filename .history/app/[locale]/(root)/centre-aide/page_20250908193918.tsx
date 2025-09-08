import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Centre d&apos;Aide - MendelCorp',
  description:
    'Trouvez des réponses à vos questions et obtenez de l&apos;aide pour utiliser notre plateforme.',
}

export default function CentreAidePage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-foreground mb-8'>
          Centre d&apos;Aide
        </h1>

        <div className='space-y-8'>
          <section className='bg-muted/50 p-6 rounded-lg'>
            <h2 className='text-2xl font-semibold text-foreground mb-4'>
              Comment pouvons-nous vous aider ?
            </h2>
            <p className='text-muted-foreground mb-4'>
              Explorez nos guides, tutoriels et FAQ pour trouver rapidement les
              réponses à vos questions.
            </p>
          </section>

          <section className='grid md:grid-cols-2 gap-6'>
            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Commandes et Livraison
              </h3>
              <div className='space-y-2'>
                <a
                  href='/suivi-livraison'
                  className='block text-primary hover:underline'
                >
                  Suivre ma commande
                </a>
                <a
                  href='/politique-retour'
                  className='block text-primary hover:underline'
                >
                  Retourner un article
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Modifier une commande
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Annuler une commande
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Problèmes de livraison
                </a>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Compte et Paiement
              </h3>
              <div className='space-y-2'>
                <a href='#' className='block text-primary hover:underline'>
                  Créer un compte
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Réinitialiser mon mot de passe
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Méthodes de paiement
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Factures et reçus
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Sécurité des paiements
                </a>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Produits et Services
              </h3>
              <div className='space-y-2'>
                <a href='#' className='block text-primary hover:underline'>
                  Guides d&apos;installation
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Support technique
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Garanties
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Compatibilité
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Mise à jour des produits
                </a>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Support Client
              </h3>
              <div className='space-y-2'>
                <a
                  href='/service-client'
                  className='block text-primary hover:underline'
                >
                  Nous contacter
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Chat en direct
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Téléphone
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Email
                </a>
                <a href='#' className='block text-primary hover:underline'>
                  Tickets de support
                </a>
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
                  Comment puis-je suivre ma commande ?
                </h4>
                <p className='text-sm text-muted-foreground'>
                  Vous pouvez suivre votre commande en utilisant le numéro de
                  commande reçu par email ou en vous connectant à votre compte.
                </p>
              </div>
              <div className='border-b border-border pb-4'>
                <h4 className='font-semibold text-foreground mb-2'>
                  Quels sont les délais de livraison ?
                </h4>
                <p className='text-sm text-muted-foreground'>
                  Les délais de livraison standard sont de 3-5 jours ouvrés. Des
                  options de livraison express sont disponibles.
                </p>
              </div>
              <div className='border-b border-border pb-4'>
                <h4 className='font-semibold text-foreground mb-2'>
                  Puis-je modifier ma commande ?
                </h4>
                <p className='text-sm text-muted-foreground'>
                  Oui, vous pouvez modifier votre commande tant qu&apos;elle
                  n&apos;a pas été expédiée. Contactez notre service client pour
                  plus d&apos;informations.
                </p>
              </div>
              <div>
                <h4 className='font-semibold text-foreground mb-2'>
                  Comment retourner un article ?
                </h4>
                <p className='text-sm text-muted-foreground'>
                  Vous avez 30 jours pour retourner un article. Consultez notre
                  <a
                    href='/politique-retour'
                    className='text-primary hover:underline ml-1'
                  >
                    politique de retour
                  </a>
                  pour plus de détails.
                </p>
              </div>
            </div>
          </section>

          <section className='bg-muted/50 p-6 rounded-lg text-center'>
            <h3 className='text-xl font-semibold text-foreground mb-4'>
              Vous ne trouvez pas ce que vous cherchez ?
            </h3>
            <p className='text-muted-foreground mb-4'>
              Notre équipe de support est là pour vous aider 24/7.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a
                href='/service-client'
                className='bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors'
              >
                Contacter le support
              </a>
              <a
                href='#'
                className='border border-border px-6 py-2 rounded-lg hover:bg-muted transition-colors'
              >
                Chat en direct
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
