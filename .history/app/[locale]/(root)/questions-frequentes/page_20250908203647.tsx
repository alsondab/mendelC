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

        <div className="bg-muted/50 p-6 rounded-lg">
          <p className="text-muted-foreground text-lg">
            Trouvez des réponses aux questions les plus courantes sur nos
            produits et services. Notre équipe a rassemblé les informations
            essentielles pour vous aider à mieux comprendre nos offres et nos
            politiques.
          </p>
        </div>
      </div>
    </div>
  )
}
