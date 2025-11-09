import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

import { formatCurrency } from '@/lib/utils'
import { IOrder } from '@/lib/db/models/order.model'
import { getSetting } from '@/lib/actions/setting.actions'

type OrderCancellationProps = {
  order: IOrder
}

OrderCancellationEmail.PreviewProps = {
  order: {
    _id: '123456789',
    user: { name: 'Jean Dupont', email: 'jean@example.com' },
    items: [
      {
        name: 'Produit exemple',
        quantity: 2,
        price: 29.99,
        image: 'https://example.com/image.jpg',
      },
    ],
    totalPrice: 59.98,
    createdAt: new Date(),
    cancelledAt: new Date(),
  } as IOrder,
}

export default async function OrderCancellationEmail({
  order,
}: OrderCancellationProps) {
  const setting = await getSetting()
  const siteName = setting?.site?.name || 'MendelCorp'

  return (
    <Html>
      <Head />
      <Preview>Votre commande a été annulée</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            {/* Header */}
            <Section className="text-center mb-8">
              <Heading className="text-2xl font-bold text-gray-900 mb-2">
                Commande Annulée
              </Heading>
              <Text className="text-gray-600">
                Votre commande #{order._id.toString()} a été annulée avec succès
              </Text>
            </Section>

            {/* Order Details */}
            <Section className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <Heading className="text-lg font-semibold text-gray-900 mb-4">
                Détails de la commande annulée
              </Heading>

              <Row className="mb-4">
                <Column>
                  <Text className="text-sm text-gray-600">
                    Numéro de commande
                  </Text>
                  <Text className="font-medium text-gray-900">
                    #{order._id.toString()}
                  </Text>
                </Column>
                <Column>
                  <Text className="text-sm text-gray-600">
                    Date d&apos;annulation
                  </Text>
                  <Text className="font-medium text-gray-900">
                    {order.cancelledAt
                      ? new Date(order.cancelledAt).toLocaleDateString(
                          'fr-FR',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )
                      : 'N/A'}
                  </Text>
                </Column>
              </Row>

              <Row className="mb-4">
                <Column>
                  <Text className="text-sm text-gray-600">Montant total</Text>
                  <Text className="font-bold text-lg text-gray-900">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Items */}
            <Section className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <Heading className="text-lg font-semibold text-gray-900 mb-4">
                Articles annulés
              </Heading>
              {order.items.map((item, index) => (
                <Row
                  key={index}
                  className="mb-4 pb-4 border-b border-gray-200 last:border-b-0"
                >
                  <Column className="w-16">
                    {item.image && (
                      <Img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </Column>
                  <Column className="pl-4">
                    <Text className="font-medium text-gray-900">
                      {item.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Quantité: {item.quantity}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Prix: {formatCurrency(item.price)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Refund Information */}
            <Section className="bg-blue-50 rounded-lg p-6 mb-6">
              <Heading className="text-lg font-semibold text-blue-900 mb-2">
                Remboursement
              </Heading>
              <Text className="text-blue-800 mb-2">
                Si vous aviez déjà effectué un paiement, le remboursement sera
                traité dans les 3-5 jours ouvrables.
              </Text>
              <Text className="text-blue-800">
                Pour toute question concernant votre remboursement,
                n&apos;hésitez pas à nous contacter.
              </Text>
            </Section>

            {/* Contact Information */}
            <Section className="text-center">
              <Text className="text-gray-600 mb-2">
                Avez-vous des questions ? Nous sommes là pour vous aider.
              </Text>
              <Text className="text-gray-600">
                Contactez notre service client à{' '}
                <a
                  href="mailto:support@mendelcorp.com"
                  className="text-blue-600 hover:underline"
                >
                  support@mendelcorp.com
                </a>
              </Text>
            </Section>

            {/* Footer */}
            <Section className="text-center mt-8 pt-6 border-t border-gray-200">
              <Text className="text-sm text-gray-500">
                Merci d&apos;avoir choisi {siteName}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
