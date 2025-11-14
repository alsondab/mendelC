import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  Button,
} from '@react-email/components'
import { getSetting } from '@/lib/actions/setting.actions'
import { routing } from '@/i18n/routing'

type VerificationEmailProps = {
  name: string
  token: string
}

VerificationEmail.PreviewProps = {
  name: 'John Doe',
  token: 'abc123def456',
} satisfies VerificationEmailProps

export default async function VerificationEmail({
  name,
  token,
}: VerificationEmailProps) {
  const { site } = await getSetting()

  // Construire l'URL de vérification avec le locale par défaut
  const baseUrl = site.url.endsWith('/') ? site.url.slice(0, -1) : site.url
  const defaultLocale = routing.defaultLocale
  const verificationUrl = `${baseUrl}/${defaultLocale}/verify-email?token=${token}`

  return (
    <Html>
      <Preview>
        Vérifiez votre adresse email pour activer votre compte {site.name}
      </Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl mx-auto p-6">
            <Heading className="text-2xl font-bold text-center mb-6 text-gray-900">
              Vérifiez votre adresse email
            </Heading>

            <Section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <Text className="text-gray-700 mb-4">
                Bonjour <strong>{name}</strong>,
              </Text>

              <Text className="text-gray-700 mb-4">
                Merci de vous être inscrit sur <strong>{site.name}</strong> !
                Pour activer votre compte et commencer à utiliser nos services,
                veuillez vérifier votre adresse email en cliquant sur le bouton
                ci-dessous.
              </Text>

              <Section className="text-center my-6">
                <Button
                  href={verificationUrl}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-center no-underline inline-block"
                >
                  Vérifier mon email
                </Button>
              </Section>

              <Text className="text-gray-600 text-sm mb-4">
                Ou copiez et collez ce lien dans votre navigateur :
              </Text>
              <Text className="text-gray-800 text-sm break-all bg-gray-50 p-3 rounded border border-gray-200 mb-4">
                {verificationUrl}
              </Text>

              <Section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <Text className="text-yellow-800 text-sm m-0 mb-2">
                  <strong>⏰ Important :</strong> Ce lien expire dans 24 heures.
                </Text>
                <Text className="text-yellow-700 text-sm m-0">
                  Si vous n&apos;avez pas créé de compte sur {site.name}, vous
                  pouvez ignorer cet email en toute sécurité.
                </Text>
              </Section>
            </Section>

            <Text className="text-gray-500 text-xs text-center mt-6">
              © {new Date().getFullYear()} {site.name}. Tous droits réservés.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
