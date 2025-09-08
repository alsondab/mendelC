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

        <div className='space-y-8'>
          <section className='bg-muted/50 p-6 rounded-lg'>
            <h2 className='text-2xl font-semibold text-foreground mb-4'>
              Introduction
            </h2>
            <p className='text-muted-foreground mb-4'>
              Chez MendelCorp, nous nous engageons à protéger votre vie privée et
              vos données personnelles. Cette politique explique comment nous
              collectons, utilisons et protégeons vos informations.
            </p>
            <p className='text-muted-foreground'>
              En utilisant notre site, vous acceptez les pratiques décrites dans
              cette politique de confidentialité.
            </p>
          </section>

          <section className='space-y-6'>
            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                1. Informations que nous collectons
              </h3>
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-foreground mb-2'>
                    Informations personnelles
                  </h4>
                  <ul className='space-y-1 text-sm text-muted-foreground ml-4'>
                    <li>• Nom et prénom</li>
                    <li>• Adresse email</li>
                    <li>• Numéro de téléphone</li>
                    <li>• Adresse de livraison et de facturation</li>
                    <li>• Informations de paiement (cryptées)</li>
                  </ul>
                </div>
                <div>
                  <h4 className='font-semibold text-foreground mb-2'>
                    Informations techniques
                  </h4>
                  <ul className='space-y-1 text-sm text-muted-foreground ml-4'>
                    <li>• Adresse IP</li>
                    <li>• Type de navigateur</li>
                    <li>• Pages visitées</li>
                    <li>• Durée de visite</li>
                    <li>• Cookies et technologies similaires</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                2. Comment nous utilisons vos informations
              </h3>
              <div className='space-y-3 text-sm text-muted-foreground'>
                <div className='flex items-start space-x-2'>
                  <span className='text-primary mt-1'>•</span>
                  <span>
                    <strong>Traitement des commandes:</strong> Pour traiter et
                    expédier vos commandes
                  </span>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-primary mt-1'>•</span>
                  <span>
                    <strong>Service client:</strong> Pour répondre à vos questions
                    et demandes
                  </span>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-primary mt-1'>•</span>
                  <span>
                    <strong>Amélioration du site:</strong> Pour analyser et
                    améliorer notre site web
                  </span>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-primary mt-1'>•</span>
                  <span>
                    <strong>Marketing:</strong> Pour vous envoyer des offres
                    personnalisées (avec votre consentement)
                  </span>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-primary mt-1'>•</span>
                  <span>
                    <strong>Sécurité:</strong> Pour protéger contre la fraude et
                    les activités malveillantes
                  </span>
                </div>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                3. Partage de vos informations
              </h3>
              <div className='space-y-3 text-sm text-muted-foreground'>
                <p>
                  Nous ne vendons jamais vos informations personnelles à des tiers.
                  Nous pouvons partager vos informations uniquement dans les cas
                  suivants :
                </p>
                <ul className='space-y-1 ml-4'>
                  <li>• Avec des prestataires de services de confiance</li>
                  <li>• Pour respecter des obligations légales</li>
                  <li>• Pour protéger nos droits et notre sécurité</li>
                  <li>• Avec votre consentement explicite</li>
                </ul>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                4. Sécurité de vos données
              </h3>
              <div className='space-y-3 text-sm text-muted-foreground'>
                <p>
                  Nous mettons en place des mesures de sécurité appropriées pour
                  protéger vos informations :
                </p>
                <ul className='space-y-1 ml-4'>
                  <li>• Chiffrement SSL/TLS pour les transmissions</li>
                  <li>• Accès restreint aux données personnelles</li>
                  <li>• Surveillance continue des systèmes</li>
                  <li>• Formation du personnel sur la protection des données</li>
                  <li>• Sauvegardes régulières et sécurisées</li>
                </ul>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                5. Vos droits
              </h3>
              <div className='space-y-3 text-sm text-muted-foreground'>
                <p>Conformément au RGPD, vous avez les droits suivants :</p>
                <ul className='space-y-1 ml-4'>
                  <li>• <strong>Accès:</strong> Demander une copie de vos données</li>
                  <li>• <strong>Rectification:</strong> Corriger des informations inexactes</li>
                  <li>• <strong>Suppression:</strong> Demander la suppression de vos données</li>
                  <li>• <strong>Limitation:</strong> Restreindre le traitement de vos données</li>
                  <li>• <strong>Portabilité:</strong> Récupérer vos données dans un format lisible</li>
                  <li>• <strong>Opposition:</strong> Vous opposer au traitement de vos données</li>
                </ul>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                6. Cookies
              </h3>
              <div className='space-y-3 text-sm text-muted-foreground'>
                <p>
                  Nous utilisons des cookies pour améliorer votre expérience sur
                  notre site :
                </p>
                <ul className='space-y-1 ml-4'>
                  <li>• <strong>Cookies essentiels:</strong> Nécessaires au fonctionnement du site</li>
                  <li>• <strong>Cookies analytiques:</strong> Pour analyser l&apos;utilisation du site</li>
                  <li>• <strong>Cookies de préférences:</strong> Pour mémoriser vos choix</li>
                  <li>• <strong>Cookies marketing:</strong> Pour des publicités personnalisées</li>
                </ul>
                <p>
                  Vous pouvez gérer vos préférences de cookies dans les paramètres
                  de votre navigateur.
                </p>
              </div>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                7. Conservation des données
              </h3>
              <div className='space-y-3 text-sm text-muted-foreground'>
                <p>
                  Nous conservons vos données personnelles uniquement le temps
                  nécessaire aux finalités pour lesquelles elles ont été
                  collectées :
                </p>
                <ul className='space-y-1 ml-4'>
                  <li>• Données de compte : 3 ans après la dernière activité</li>
                  <li>• Données de commande : 10 ans (obligation légale)</li>
                  <li>• Données marketing : Jusqu&apos;à votre désabonnement</li>
                  <li>• Données techniques : 2 ans maximum</li>
                </ul>
              </div>
            </div>
          </section>

          <section className='bg-muted/50 p-6 rounded-lg'>
            <h3 className='text-xl font-semibold text-foreground mb-4'>
              Contact et Questions
            </h3>
            <p className='text-muted-foreground mb-4'>
              Si vous avez des questions sur cette politique de confidentialité
              ou souhaitez exercer vos droits, contactez-nous :
            </p>
            <div className='space-y-2 text-sm'>
              <p>
                <strong>Délégué à la Protection des Données:</strong>{' '}
                dpo@mendelcorp.com
              </p>
              <p>
                <strong>Email général:</strong> privacy@mendelcorp.com
              </p>
              <p>
                <strong>Téléphone:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong>Adresse:</strong> 123 Tech Innovation Drive, Silicon
                Valley, CA 94025
              </p>
            </div>
            <p className='text-sm text-muted-foreground mt-4'>
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
