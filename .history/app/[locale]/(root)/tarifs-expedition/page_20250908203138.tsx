import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tarifs et Politiques d&apos;Expédition - MendelCorp',
  description:
    'Découvrez nos tarifs d&apos;expédition et nos politiques de livraison pour tous vos achats.',
}

export default function TarifsExpeditionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Tarifs et Politiques d&apos;Expédition
        </h1>

        <div className="space-y-8">
          <section className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Options de Livraison
            </h2>
            <p className="text-muted-foreground mb-4">
              Nous proposons plusieurs options de livraison pour répondre à vos
              besoins, de la livraison standard à l&apos;expédition express.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Livraison Standard
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Délai</span>
                  <span className="font-semibold">3-5 jours ouvrés</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tarif</span>
                  <span className="font-semibold text-primary">Gratuit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Commande minimum
                  </span>
                  <span className="font-semibold">50€</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Livraison gratuite pour toute commande supérieure à 50€. Suivi
                  de colis disponible.
                </p>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Livraison Express
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Délai</span>
                  <span className="font-semibold">1-2 jours ouvrés</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tarif</span>
                  <span className="font-semibold text-primary">9,99€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Commande minimum
                  </span>
                  <span className="font-semibold">Aucune</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Livraison prioritaire avec suivi en temps réel et notification
                  SMS.
                </p>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Livraison Same-Day
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Délai</span>
                  <span className="font-semibold">Le jour même</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tarif</span>
                  <span className="font-semibold text-primary">19,99€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Disponibilité</span>
                  <span className="font-semibold">Grandes villes</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Livraison le jour même pour les commandes passées avant 14h
                  (disponible dans certaines zones).
                </p>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Retrait en Magasin
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Délai</span>
                  <span className="font-semibold">2-3 jours ouvrés</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tarif</span>
                  <span className="font-semibold text-primary">Gratuit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Commande minimum
                  </span>
                  <span className="font-semibold">Aucune</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Retrait gratuit dans nos magasins partenaires. Notification
                  par email quand votre commande est prête.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Zones de Livraison
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3">
                  France Métropolitaine
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Toutes les régions de France</li>
                  <li>• Livraison standard : 3-5 jours</li>
                  <li>• Livraison express : 1-2 jours</li>
                  <li>• Same-day : Paris, Lyon, Marseille</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">
                  International
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Union Européenne : 5-7 jours</li>
                  <li>• Suisse, Monaco : 3-5 jours</li>
                  <li>• Autres pays : 7-14 jours</li>
                  <li>• Frais de douane en sus</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Politiques Spéciales
            </h3>
            <div className="space-y-4">
              <div className="border-b border-border pb-4">
                <h4 className="font-semibold text-foreground mb-2">
                  Produits Fragiles
                </h4>
                <p className="text-sm text-muted-foreground">
                  Les produits fragiles (écrans, verre, etc.) sont expédiés avec
                  un emballage renforcé. Frais de livraison spéciaux : +5€.
                </p>
              </div>
              <div className="border-b border-border pb-4">
                <h4 className="font-semibold text-foreground mb-2">
                  Commandes Volumineuses
                </h4>
                <p className="text-sm text-muted-foreground">
                  Pour les commandes supérieures à 30kg, des frais de livraison
                  spéciaux peuvent s&apos;appliquer. Contactez-nous pour un
                  devis.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Livraison Programmable
                </h4>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez programmer votre livraison à une date et heure
                  précises. Service disponible pour un supplément de 15€.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-muted/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Suivi de Commande
            </h3>
            <p className="text-muted-foreground mb-4">
              Une fois votre commande expédiée, vous recevrez :
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Email de confirmation d&apos;expédition</li>
              <li>• Numéro de suivi du colis</li>
              <li>• Notifications SMS (option express)</li>
              <li>• Estimation de livraison précise</li>
              <li>• Possibilité de reprogrammer la livraison</li>
            </ul>
            <div className="mt-4">
              <Link
                href="/suivi-livraison"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Suivre ma commande
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
