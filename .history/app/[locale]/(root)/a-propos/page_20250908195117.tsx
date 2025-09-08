import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À Propos - MendelCorp',
  description:
    'Découvrez l&apos;histoire et la mission de MendelCorp, votre partenaire technologique de confiance.',
}

export default function AProposPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-foreground mb-8'>
          À Propos de MendelCorp
        </h1>

        <div className='space-y-8'>
          <section className='bg-muted/50 p-6 rounded-lg'>
            <h2 className='text-2xl font-semibold text-foreground mb-4'>
              Notre Mission
            </h2>
            <p className='text-muted-foreground mb-4'>
              Chez MendelCorp, nous nous engageons à fournir des solutions
              technologiques de pointe qui répondent aux besoins de nos clients,
              qu&apos;ils soient des particuliers, des entreprises ou des
              institutions.
            </p>
            <p className='text-muted-foreground'>
              Notre mission est de rendre la technologie accessible, fiable et
              performante pour tous, en offrant des produits de qualité
              supérieure accompagnés d&apos;un service client exceptionnel.
            </p>
          </section>

          <section className='grid md:grid-cols-2 gap-6'>
            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Notre Histoire
              </h3>
              <p className='text-muted-foreground text-sm mb-4'>
                Fondée en 2020, MendelCorp est née de la vision de créer une
                plateforme e-commerce spécialisée dans les équipements
                technologiques professionnels.
              </p>
              <p className='text-muted-foreground text-sm'>
                Depuis nos débuts, nous avons évolué pour devenir un leader dans
                la vente d&apos;équipements de surveillance, de téléphonie, et
                de sécurité, en nous concentrant sur la qualité et
                l&apos;innovation.
              </p>
            </div>

            <div className='bg-background border border-border rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                Nos Valeurs
              </h3>
              <div className='space-y-3 text-sm'>
                <div className='flex items-start space-x-2'>
                  <span className='text-primary mt-1'>•</span>
                  <span>
                    <strong>Qualité:</strong> Produits testés et certifiés
                  </span>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-primary mt-1'>•</span>
                  <span>
                    <strong>Innovation:</strong> Solutions technologiques
                    avancées
                  </span>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-primary mt-1'>•</span>
                  <span>
                    <strong>Service:</strong> Support client 24/7
                  </span>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-primary mt-1'>•</span>
                  <span>
                    <strong>Fiabilité:</strong> Partenaire de confiance
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className='bg-background border border-border rounded-lg p-6'>
            <h3 className='text-xl font-semibold text-foreground mb-4'>
              Nos Spécialités
            </h3>
            <div className='grid md:grid-cols-3 gap-4'>
              <div className='text-center p-4 bg-muted/30 rounded-lg'>
                <div className='bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <span className='text-primary text-xl'>📹</span>
                </div>
                <h4 className='font-semibold mb-2'>Surveillance Vidéo</h4>
                <p className='text-sm text-muted-foreground'>
                  Caméras IP, systèmes NVR, accessoires de surveillance
                </p>
              </div>
              <div className='text-center p-4 bg-muted/30 rounded-lg'>
                <div className='bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <span className='text-primary text-xl'>📞</span>
                </div>
                <h4 className='font-semibold mb-2'>Téléphonie</h4>
                <p className='text-sm text-muted-foreground'>
                  Téléphones IP, systèmes PBX, solutions de communication
                </p>
              </div>
              <div className='text-center p-4 bg-muted/30 rounded-lg'>
                <div className='bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <span className='text-primary text-xl'>🛡️</span>
                </div>
                <h4 className='font-semibold mb-2'>Sécurité</h4>
                <p className='text-sm text-muted-foreground'>
                  Extincteurs, détecteurs de fumée, équipements de sécurité
                </p>
              </div>
            </div>
          </section>

          <section className='bg-muted/50 p-6 rounded-lg'>
            <h3 className='text-xl font-semibold text-foreground mb-4'>
              Pourquoi Choisir MendelCorp ?
            </h3>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div className='flex items-start space-x-3'>
                  <div className='w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1'>
                    ✓
                  </div>
                  <div>
                    <h4 className='font-semibold text-foreground'>
                      Produits de Qualité
                    </h4>
                    <p className='text-sm text-muted-foreground'>
                      Sélection rigoureuse des meilleures marques
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-3'>
                  <div className='w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1'>
                    ✓
                  </div>
                  <div>
                    <h4 className='font-semibold text-foreground'>
                      Support Expert
                    </h4>
                    <p className='text-sm text-muted-foreground'>
                      Équipe technique spécialisée
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-3'>
                  <div className='w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1'>
                    ✓
                  </div>
                  <div>
                    <h4 className='font-semibold text-foreground'>
                      Livraison Rapide
                    </h4>
                    <p className='text-sm text-muted-foreground'>
                      Expédition sous 24-48h
                    </p>
                  </div>
                </div>
              </div>
              <div className='space-y-4'>
                <div className='flex items-start space-x-3'>
                  <div className='w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1'>
                    ✓
                  </div>
                  <div>
                    <h4 className='font-semibold text-foreground'>
                      Garantie Étendue
                    </h4>
                    <p className='text-sm text-muted-foreground'>
                      Protection complète de vos achats
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-3'>
                  <div className='w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1'>
                    ✓
                  </div>
                  <div>
                    <h4 className='font-semibold text-foreground'>
                      Prix Compétitifs
                    </h4>
                    <p className='text-sm text-muted-foreground'>
                      Meilleurs prix du marché
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-3'>
                  <div className='w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1'>
                    ✓
                  </div>
                  <div>
                    <h4 className='font-semibold text-foreground'>
                      Service Client 24/7
                    </h4>
                    <p className='text-sm text-muted-foreground'>
                      Support disponible en permanence
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className='bg-background border border-border rounded-lg p-6'>
            <h3 className='text-xl font-semibold text-foreground mb-4'>
              Contactez-Nous
            </h3>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <h4 className='font-semibold text-foreground mb-3'>
                  Informations de Contact
                </h4>
                <div className='space-y-2 text-sm text-muted-foreground'>
                  <p>
                    <strong>Email:</strong> contact@mendelcorp.com
                  </p>
                  <p>
                    <strong>Téléphone:</strong> +1 (555) 123-4567
                  </p>
                  <p>
                    <strong>Adresse:</strong> 123 Tech Street, Silicon Valley,
                    CA 94025
                  </p>
                  <p>
                    <strong>Heures:</strong> Lun-Ven 8h-18h, Sam 9h-17h
                  </p>
                </div>
              </div>
              <div>
                <h4 className='font-semibold text-foreground mb-3'>
                  Suivez-Nous
                </h4>
                <div className='flex space-x-4'>
                  <a href='#' className='text-primary hover:underline'>
                    LinkedIn
                  </a>
                  <a href='#' className='text-primary hover:underline'>
                    Twitter
                  </a>
                  <a href='#' className='text-primary hover:underline'>
                    Facebook
                  </a>
                  <a href='#' className='text-primary hover:underline'>
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
