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

        <div className="bg-muted/50 p-6 rounded-lg">
          <p className="text-muted-foreground text-lg">
            En accédant et en utilisant notre site web, vous acceptez
            d&apos;être lié par ces conditions d&apos;utilisation. Ces
            conditions s&apos;appliquent à tous les visiteurs, utilisateurs et
            autres personnes qui accèdent ou utilisent le service.
          </p>
        </div>
      </div>
    </div>
  )
}
