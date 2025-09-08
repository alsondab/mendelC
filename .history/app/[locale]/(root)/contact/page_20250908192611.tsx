import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - MendelCorp',
  description: 'Contactez notre équipe pour toute question ou assistance concernant nos produits et services.',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Contactez-Nous</h1>
        
        <div className="space-y-8">
          <section className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Nous sommes là pour vous aider</h2>
            <p className="text-muted-foreground mb-4">
              Notre équipe de support est disponible pour répondre à toutes vos questions 
              et vous accompagner dans vos projets technologiques.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Informations de Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-primary text-sm">📧</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Email</h4>
                      <p className="text-sm text-muted-foreground">contact@mendelcorp.com</p>
                      <p className="text-sm text-muted-foreground">support@mendelcorp.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-primary text-sm">📞</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Téléphone</h4>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      <p className="text-sm text-muted-foreground">Support technique: +1 (555) 123-4568</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-primary text-sm">📍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Adresse</h4>
                      <p className="text-sm text-muted-foreground">
                        123 Tech Innovation Drive<br />
                        Silicon Valley, CA 94025<br />
                        États-Unis
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-primary text-sm">🕒</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Heures d&apos;ouverture</h4>
                      <p className="text-sm text-muted-foreground">
                        Lundi - Vendredi: 8h00 - 18h00<br />
                        Samedi: 9h00 - 17h00<br />
                        Dimanche: Fermé
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Support Spécialisé</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Support Technique</h4>
                      <p className="text-xs text-muted-foreground">Installation et configuration</p>
                    </div>
                    <span className="text-primary text-sm font-semibold">24/7</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Support Commercial</h4>
                      <p className="text-xs text-muted-foreground">Commandes et facturation</p>
                    </div>
                    <span className="text-primary text-sm font-semibold">8h-18h</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Support Entreprise</h4>
                      <p className="text-xs text-muted-foreground">Solutions sur mesure</p>
                    </div>
                    <span className="text-primary text-sm font-semibold">8h-20h</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Envoyez-nous un message</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Sujet
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Support technique</option>
                    <option>Question commerciale</option>
                    <option>Retour/Échange</option>
                    <option>Partenariat</option>
                    <option>Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Décrivez votre demande en détail..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Envoyer le message
                </button>
              </form>
            </div>
          </section>

          <section className="bg-muted/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-foreground mb-4">Autres Moyens de Contact</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background border border-border rounded-lg">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary text-xl">💬</span>
                </div>
                <h4 className="font-semibold mb-2">Chat en Direct</h4>
                <p className="text-sm text-muted-foreground mb-3">Assistance immédiate</p>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors">
                  Démarrer le chat
                </button>
              </div>
              
              <div className="text-center p-4 bg-background border border-border rounded-lg">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary text-xl">📋</span>
                </div>
                <h4 className="font-semibold mb-2">Ticket de Support</h4>
                <p className="text-sm text-muted-foreground mb-3">Suivi de votre demande</p>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors">
                  Créer un ticket
                </button>
              </div>
              
              <div className="text-center p-4 bg-background border border-border rounded-lg">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary text-xl">📞</span>
                </div>
                <h4 className="font-semibold mb-2">Rappel Gratuit</h4>
                <p className="text-sm text-muted-foreground mb-3">Nous vous rappelons</p>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors">
                  Demander un rappel
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
