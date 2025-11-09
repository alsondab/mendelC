import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retours et Remplacements - MendelCorp',
  description:
    'Découvrez notre politique de retour et de remplacement pour tous vos achats.',
}

export default function RetoursRemplacementsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Retours et Remplacements
        </h1>

        <div className="bg-muted/50 p-6 rounded-lg">
          <p className="text-muted-foreground text-lg">
            Nous nous engageons à vous offrir une expérience d&apos;achat
            satisfaisante. Si vous n&apos;êtes pas entièrement satisfait de
            votre achat, nous facilitons les retours et remplacements. Tous les
            retours sont gratuits et faciles à effectuer.
          </p>
        </div>
      </div>
    </div>
  )
}
