import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions of Use - MendelCorp',
  description:
    'Read our terms of use to understand the rules and regulations of our platform.',
}

export default function ConditionsOfUsePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Conditions of Use
        </h1>

        <div className="bg-muted/50 p-6 rounded-lg">
          <p className="text-muted-foreground text-lg">
            By accessing and using our website, you agree to be bound by these
            terms of use. These terms apply to all visitors, users, and others
            who access or use the service.
          </p>
        </div>
      </div>
    </div>
  )
}
