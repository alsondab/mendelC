import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Questions Fréquentes - MendelCorp',
  description:
    'Trouvez des réponses aux questions les plus courantes sur nos produits et services.',
}

export default function QuestionsFrequentesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Questions Fréquentes
        </h1>

        <div className="space-y-8">
          <section className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-4">FAQ</h2>
            <p className="text-muted-foreground mb-4">
              Voici les réponses aux questions les plus fréquemment posées par
              nos clients.
            </p>
          </section>

          <div className="space-y-6">
            <section className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Commandes et Paiement
              </h3>
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Comment passer une commande ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez les produits à votre panier, procédez au checkout,
                    sélectionnez votre adresse de livraison et votre méthode de
                    paiement, puis confirmez votre commande.
                  </p>
                </div>
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Quelles méthodes de paiement acceptez-vous ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Nous acceptons les cartes de crédit (Visa, Mastercard,
                    American Express), PayPal, et le paiement à la livraison.
                  </p>
                </div>
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Mes informations de paiement sont-elles sécurisées ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Oui, tous les paiements sont traités de manière sécurisée
                    avec un cryptage SSL. Nous ne stockons pas vos informations
                    de carte de crédit.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Puis-je annuler ma commande ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Vous pouvez annuler votre commande tant qu&apos;elle
                    n&apos;a pas été expédiée. Contactez notre service client
                    pour plus d&apos;informations.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Livraison et Expédition
              </h3>
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Quels sont les délais de livraison ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Les délais de livraison standard sont de 3-5 jours ouvrés.
                    Des options de livraison express (1-2 jours) sont
                    disponibles.
                  </p>
                </div>
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Livrez-vous partout ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Nous livrons dans tout le pays. Les frais de livraison
                    varient selon la destination et la méthode de livraison
                    choisie.
                  </p>
                </div>
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Comment suivre ma commande ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Vous recevrez un numéro de suivi par email. Vous pouvez
                    également suivre votre commande depuis votre compte ou notre
                    page de
                    <a
                      href="/suivi-livraison"
                      className="text-primary hover:underline ml-1"
                    >
                      suivi de livraison
                    </a>
                    .
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Puis-je modifier l&apos;adresse de livraison ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Oui, vous pouvez modifier l&apos;adresse de livraison tant
                    que la commande n&apos;a pas été expédiée. Contactez notre
                    service client.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Retours et Remboursements
              </h3>
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Quelle est votre politique de retour ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Vous avez 30 jours pour retourner un article non utilisé
                    dans son emballage d&apos;origine. Consultez notre{' '}
                    <a
                      href="/politique-retour"
                      className="text-primary hover:underline"
                    >
                      politique de retour
                    </a>{' '}
                    complète.
                  </p>
                </div>
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Comment retourner un article ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Contactez notre service client pour obtenir une étiquette de
                    retour. Les frais de retour sont à votre charge, sauf en cas
                    de défaut du produit.
                  </p>
                </div>
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Quand serai-je remboursé ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Le remboursement est traité dans les 5-7 jours ouvrés après
                    réception et inspection de l&apos;article retourné.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Puis-je échanger un article ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Oui, nous proposons des échanges. Contactez notre service
                    client pour organiser l&apos;échange.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Produits et Support
              </h3>
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Offrez-vous une garantie ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Tous nos produits sont couverts par la garantie du
                    fabricant. La durée varie selon le produit (généralement 1-3
                    ans).
                  </p>
                </div>
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Proposez-vous un support technique ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Oui, notre équipe de support technique est disponible pour
                    vous aider avec l&apos;installation et la configuration de
                    vos produits.
                  </p>
                </div>
                <div className="border-b border-border pb-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Les produits sont-ils compatibles ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Chaque produit indique ses compatibilités. En cas de doute,
                    contactez notre service client avant l&apos;achat.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Proposez-vous des guides d&apos;installation ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Oui, la plupart de nos produits incluent des guides
                    d&apos;installation. Des guides supplémentaires sont
                    disponibles dans notre
                    <a
                      href="/centre-aide"
                      className="text-primary hover:underline ml-1"
                    >
                      centre d&apos;aide
                    </a>
                    .
                  </p>
                </div>
              </div>
            </section>
          </div>

          <section className="bg-muted/50 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Vous avez d&apos;autres questions ?
            </h3>
            <p className="text-muted-foreground mb-4">
              Notre équipe de support est là pour vous aider.
            </p>
            <a
              href="/service-client"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors inline-block"
            >
              Contacter le support
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}
