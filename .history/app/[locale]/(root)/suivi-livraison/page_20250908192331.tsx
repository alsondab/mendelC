import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Suivi de Livraison - MendelCorp',
  description: 'Suivez votre commande en temps réel et obtenez des mises à jour sur l&apos;état de votre livraison.',
}

export default function SuiviLivraisonPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Suivi de Livraison</h1>
        
        <div className="space-y-8">
          <section className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Suivez votre commande</h2>
            <p className="text-muted-foreground mb-4">
              Entrez votre numéro de commande ou de suivi pour obtenir des informations en temps réel 
              sur l&apos;état de votre livraison.
            </p>
          </section>

          <section className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Rechercher une commande</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Numéro de commande
                </label>
                <input
                  type="text"
                  placeholder="Ex: #12345"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email de commande
                </label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Suivre la commande
              </button>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">États de livraison</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Commande confirmée</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">En préparation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Expédiée</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">En transit</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm">Livrée</span>
                </div>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Informations utiles</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Délai de livraison standard: 3-5 jours ouvrés</p>
                <p>• Livraison express disponible</p>
                <p>• Notifications par email et SMS</p>
                <p>• Suivi en temps réel</p>
                <p>• Support client 24/7</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
