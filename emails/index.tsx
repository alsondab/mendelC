import { Resend } from 'resend'
import PurchaseReceiptEmail from './purchase-receipt'
import { IOrder } from '@/lib/db/models/order.model'
import AskReviewOrderItemsEmail from './ask-review-order-items'
import OrderCancellationEmail from './order-cancellation'
import VerificationEmail from './verification-email'
import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'

// Initialiser Resend seulement si la clé API est disponible
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  try {
    if (!process.env.RESEND_API_KEY || !resend) {
      return { id: 'mock-id', error: 'RESEND_API_KEY not configured' }
    }

    // Utiliser l'email de l'adresse de livraison s'il est fourni, sinon utiliser l'email de l'utilisateur
    const shippingEmail =
      order.shippingAddress && 'email' in order.shippingAddress
        ? (order.shippingAddress as { email?: string }).email
        : undefined
    const userEmail = (order.user as { email: string }).email
    const recipientEmail =
      shippingEmail && shippingEmail.trim() !== '' ? shippingEmail : userEmail

    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: recipientEmail,
      subject: 'Reçu de Paiement - Paiement Confirmé',
      react: <PurchaseReceiptEmail order={order} />,
    })

    if (result.error) {
      throw new Error(`Resend Error: ${JSON.stringify(result.error)}`)
    }

    return result
  } catch (error) {
    throw error
  }
}

export const sendOrderConfirmation = async ({ order }: { order: IOrder }) => {
  if (!process.env.RESEND_API_KEY || !resend) {
    throw new Error('RESEND_API_KEY not configured')
  }

  // Utiliser l'email de l'adresse de livraison s'il est fourni, sinon utiliser l'email de l'utilisateur
  const shippingEmail =
    order.shippingAddress && 'email' in order.shippingAddress
      ? (order.shippingAddress as { email?: string }).email
      : undefined
  const userEmail = (order.user as { email: string })?.email

  if (!userEmail && (!shippingEmail || shippingEmail.trim() === '')) {
    throw new Error(
      'No email address found. Please provide an email in the shipping address or ensure your account has an email.'
    )
  }

  const recipientEmail =
    shippingEmail && shippingEmail.trim() !== '' ? shippingEmail : userEmail

  if (!recipientEmail) {
    throw new Error('No valid email address found')
  }

  const result = await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: recipientEmail,
    subject: 'Confirmation de commande - Paiement à la livraison',
    react: <PurchaseReceiptEmail order={order} />,
  })

  if (result.error) {
    throw new Error(`Resend Error: ${JSON.stringify(result.error)}`)
  }

  return result
}

export const sendAskReviewOrderItems = async ({ order }: { order: IOrder }) => {
  try {
    if (!process.env.RESEND_API_KEY || !resend) {
      return { id: 'mock-id', error: 'RESEND_API_KEY not configured' }
    }

    const recipientEmail = (order.user as { email: string }).email

    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: recipientEmail,
      subject: 'Évaluez Vos Articles de Commande',
      react: <AskReviewOrderItemsEmail order={order} />,
    })

    if (result.error) {
      // Si c'est une erreur de validation Resend (403), ne pas lancer d'erreur
      // Cela se produit en mode test quand on essaie d'envoyer à une adresse non autorisée
      if (
        typeof result.error === 'object' &&
        result.error !== null &&
        'statusCode' in result.error &&
        (result.error as { statusCode?: number }).statusCode === 403
      ) {
        return { id: 'mock-id', error: 'Resend test mode restriction' }
      }

      throw new Error(`Resend Error: ${JSON.stringify(result.error)}`)
    }

    return result
  } catch (error) {
    throw error
  }
}

export const sendOrderCancellationNotification = async ({
  order,
}: {
  order: IOrder
}) => {
  try {
    if (!process.env.RESEND_API_KEY || !resend) {
      return { id: 'mock-id', error: 'RESEND_API_KEY not configured' }
    }

    const recipientEmail = (order.user as { email: string }).email

    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: recipientEmail,
      subject: "Commande Annulée - Confirmation d'annulation",
      react: <OrderCancellationEmail order={order} />,
    })

    if (result.error) {
      throw new Error(`Resend Error: ${JSON.stringify(result.error)}`)
    }

    return result
  } catch (error) {
    throw error
  }
}

export const sendVerificationEmail = async ({
  email,
  name,
  token,
}: {
  email: string
  name: string
  token: string
}) => {
  try {
    if (!process.env.RESEND_API_KEY || !resend) {
      return { id: 'mock-id', error: 'RESEND_API_KEY not configured' }
    }

    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: email,
      subject: 'Vérifiez votre adresse email - MendelCorp',
      react: <VerificationEmail name={name} token={token} />,
    })

    if (result.error) {
      throw new Error(`Resend Error: ${JSON.stringify(result.error)}`)
    }

    return result
  } catch (error) {
    throw error
  }
}
