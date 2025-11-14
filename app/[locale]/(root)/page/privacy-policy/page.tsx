import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - MendelCorp',
  description:
    'Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Privacy Policy
        </h1>

        <div className="bg-muted/50 p-6 rounded-lg">
          <p className="text-muted-foreground text-lg">
            At MendelCorp, we are committed to protecting your privacy and
            personal data. This policy explains how we collect, use, and protect
            your information. By using our site, you agree to the practices
            described in this privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
}
