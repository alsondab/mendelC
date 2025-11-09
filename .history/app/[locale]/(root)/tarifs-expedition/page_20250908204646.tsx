import { Metadata } from 'next'

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

        <div className="bg-muted/50 p-6 rounded-lg">
          <p className="text-muted-foreground text-lg">
            Découvrez nos tarifs d&apos;expédition et nos politiques de
            livraison pour tous vos achats. Nous proposons plusieurs options de
            livraison pour répondre à vos besoins, de la livraison standard à
            l&apos;expédition express.
          </p>
        </div>
      </div>
    </div>
  )
}
