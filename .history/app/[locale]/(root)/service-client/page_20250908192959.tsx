import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Service Client - MendelCorp',
  description:
    'Notre équipe de service client est là pour vous aider avec vos questions et préoccupations.',
}

export default function ServiceClientPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Service Client
        </h1>

        <div className="space-y-8">
          <section className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Nous sommes là pour vous aider
            </h2>
            <p className="text-muted-foreground mb-4">
              Notre équipe de service client dédiée est disponible pour répondre
              à toutes vos questions et vous accompagner dans votre expérience
              d&apos;achat.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Contact Direct
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Email:</strong> support@mendelcorp.com
                </p>
                <p>
                  <strong>Téléphone:</strong> +1 (555) 123-4567
                </p>
                <p>
                  <strong>Heures d&apos;ouverture:</strong> Lun-Ven 8h-18h
                </p>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Support Technique
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Email:</strong> tech@mendelcorp.com
                </p>
                <p>
                  <strong>Chat en direct:</strong> Disponible 24/7
                </p>
                <p>
                  <strong>Consultation:</strong> Gratuite sur rendez-vous
                </p>
              </div>
            </div>
          </section>

          <section className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Comment nous contacter
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary text-xl">📧</span>
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">
                  Réponse sous 24h
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary text-xl">📞</span>
                </div>
                <h3 className="font-semibold mb-2">Téléphone</h3>
                <p className="text-sm text-muted-foreground">
                  Support immédiat
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary text-xl">💬</span>
                </div>
                <h3 className="font-semibold mb-2">Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Assistance en temps réel
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
