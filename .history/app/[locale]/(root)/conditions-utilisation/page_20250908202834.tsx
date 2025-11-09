import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions d&apos;Utilisation - MendelCorp',
  description:
    'Consultez nos conditions d&apos;utilisation pour comprendre les règles et réglementations de notre plateforme.',
}

export default function ConditionsUtilisationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Conditions d&apos;Utilisation
        </h1>

        <div className="space-y-8">
          <section className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Acceptation des Conditions
            </h2>
            <p className="text-muted-foreground mb-4">
              En accédant et en utilisant notre site web, vous acceptez
              d&apos;être lié par ces conditions d&apos;utilisation. Si vous
              n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre
              site.
            </p>
            <p className="text-muted-foreground">
              Ces conditions s&apos;appliquent à tous les visiteurs,
              utilisateurs et autres personnes qui accèdent ou utilisent le
              service.
            </p>
          </section>

          <section className="space-y-6">
            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                1. Utilisation du Site
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  • Vous devez être âgé d&apos;au moins 18 ans pour utiliser ce
                  site
                </p>
                <p>
                  • Vous êtes responsable de maintenir la confidentialité de
                  votre compte
                </p>
                <p>
                  • Vous ne devez pas utiliser le site à des fins illégales ou
                  non autorisées
                </p>
                <p>
                  • Vous ne devez pas transmettre de virus ou de code
                  malveillant
                </p>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                2. Commandes et Paiements
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  • Toutes les commandes sont soumises à acceptation de notre
                  part
                </p>
                <p>• Les prix sont sujets à modification sans préavis</p>
                <p>
                  • Les paiements doivent être effectués avant l&apos;expédition
                </p>
                <p>• Nous nous réservons le droit de refuser toute commande</p>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                3. Propriété Intellectuelle
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  • Le contenu du site est protégé par les droits d&apos;auteur
                </p>
                <p>
                  • Vous ne pouvez pas reproduire ou distribuer notre contenu
                  sans autorisation
                </p>
                <p>
                  • Les marques commerciales appartiennent à leurs propriétaires
                  respectifs
                </p>
                <p>
                  • Toute utilisation non autorisée est strictement interdite
                </p>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                4. Limitation de Responsabilité
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Nous ne sommes pas responsables des dommages indirects</p>
                <p>
                  • Notre responsabilité est limitée au montant payé pour le
                  produit
                </p>
                <p>
                  • Nous ne garantissons pas l&apos;absence d&apos;erreurs sur
                  le site
                </p>
                <p>
                  • L&apos;utilisation du site se fait à vos propres risques
                </p>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                5. Modifications des Conditions
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  • Nous nous réservons le droit de modifier ces conditions à
                  tout moment
                </p>
                <p>
                  • Les modifications entrent en vigueur dès leur publication
                </p>
                <p>
                  • Il est de votre responsabilité de consulter régulièrement
                  ces conditions
                </p>
                <p>
                  • L&apos;utilisation continue du site constitue une
                  acceptation des modifications
                </p>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                6. Droit Applicable
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Ces conditions sont régies par le droit français</p>
                <p>
                  • Tout litige sera soumis à la juridiction des tribunaux
                  compétents
                </p>
                <p>• En cas de conflit, la version française prévaut</p>
                <p>
                  • Les clauses invalides n&apos;affectent pas la validité du
                  reste
                </p>
              </div>
            </div>
          </section>

          <section className="bg-muted/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Contact
            </h3>
            <p className="text-muted-foreground mb-4">
              Si vous avez des questions concernant ces conditions
              d&apos;utilisation, n&apos;hésitez pas à nous contacter.
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Email:</strong> legal@mendelcorp.com
              </p>
              <p>
                <strong>Téléphone:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong>Adresse:</strong> 123 Tech Innovation Drive, Silicon
                Valley, CA 94025
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
