import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help and Support - MendelCorp',
  description: 'Find help and answers to your questions about our platform.',
}

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Help and Support
        </h1>

        <div className="bg-muted/50 p-6 rounded-lg">
          <p className="text-muted-foreground text-lg">
            Our support team is here to assist you and answer all your questions
            about our products and services. We are committed to providing you
            with quality support for an optimal shopping experience.
          </p>
        </div>
      </div>
    </div>
  )
}
