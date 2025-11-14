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
      console.warn('⚠️ RESEND_API_KEY non configuré. Email non envoyé.')
      return { id: 'mock-id', error: 'RESEND_API_KEY not configured' }
    }

    const recipientEmail = (order.user as { email: string }).email
    console.log("📧 Tentative d'envoi de l'email de reçu...")
    console.log('📧 Destinataire:', recipientEmail)

    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: recipientEmail,
      subject: 'Reçu de Paiement - Paiement Confirmé', // ✅ Sujet pour paiement
      react: <PurchaseReceiptEmail order={order} />,
    })

    // Vérifier les erreurs Resend
    if (result.error) {
      console.error('❌ Erreur Resend:', JSON.stringify(result.error, null, 2))
      throw new Error(`Resend Error: ${JSON.stringify(result.error)}`)
    }

    console.log('✅ Email de reçu envoyé avec succès. ID:', result.data?.id)
    return result
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email de reçu:", error)
    throw error
  }
}

export const sendOrderConfirmation = async ({ order }: { order: IOrder }) => {
  try {
    if (!process.env.RESEND_API_KEY || !resend) {
      console.warn('⚠️ RESEND_API_KEY non configuré. Email non envoyé.')
      return { id: 'mock-id', error: 'RESEND_API_KEY not configured' }
    }

    const recipientEmail = (order.user as { email: string }).email
    console.log("📧 Tentative d'envoi de l'email de confirmation...")
    console.log('📧 Destinataire:', recipientEmail)

    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: recipientEmail,
      subject: 'Confirmation de commande - Paiement à la livraison', // ✅ Sujet pour COD
      react: <PurchaseReceiptEmail order={order} />,
    })

    if (result.error) {
      console.error('❌ Erreur Resend:', JSON.stringify(result.error, null, 2))
      throw new Error(`Resend Error: ${JSON.stringify(result.error)}`)
    }

    console.log(
      '✅ Email de confirmation envoyé avec succès. ID:',
      result.data?.id
    )
    return result
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'envoi de l'email de confirmation:",
      error
    )
    throw error
  }
}

export const sendAskReviewOrderItems = async ({ order }: { order: IOrder }) => {
  try {
    if (!process.env.RESEND_API_KEY || !resend) {
      console.warn('⚠️ RESEND_API_KEY non configuré. Email non envoyé.')
      return { id: 'mock-id', error: 'RESEND_API_KEY not configured' }
    }

    const recipientEmail = (order.user as { email: string }).email
    console.log("📧 Tentative d'envoi de l'email de demande d'avis...")
    console.log('📧 Destinataire:', recipientEmail)

    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: recipientEmail,
      subject: 'Évaluez Vos Articles de Commande', // ✅ Sujet pour demande d'avis
      react: <AskReviewOrderItemsEmail order={order} />,
    })

    if (result.error) {
      console.error('❌ Erreur Resend:', JSON.stringify(result.error, null, 2))
      throw new Error(`Resend Error: ${JSON.stringify(result.error)}`)
    }

    console.log(
      "✅ Email de demande d'avis envoyé avec succès. ID:",
      result.data?.id
    )
    return result
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'envoi de l'email de demande d'avis:",
      error
    )
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
      console.warn('⚠️ RESEND_API_KEY non configuré. Email non envoyé.')
      return { id: 'mock-id', error: 'RESEND_API_KEY not configured' }
    }

    const recipientEmail = (order.user as { email: string }).email
    console.log("📧 Tentative d'envoi de l'email d'annulation...")
    console.log('📧 Destinataire:', recipientEmail)

    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: recipientEmail,
      subject: "Commande Annulée - Confirmation d'annulation",
      react: <OrderCancellationEmail order={order} />,
    })

    if (result.error) {
      console.error('❌ Erreur Resend:', JSON.stringify(result.error, null, 2))
      throw new Error(`Resend Error: ${JSON.stringify(result.error)}`)
    }

    console.log(
      "✅ Email d'annulation envoyé avec succès. ID:",
      result.data?.id
    )
    return result
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email d'annulation:", error)
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
      console.warn('⚠️ RESEND_API_KEY non configuré. Email non envoyé.')
      console.warn('📧 Email qui aurait été envoyé à:', email)
      return { id: 'mock-id', error: 'RESEND_API_KEY not configured' }
    }

    console.log("📧 Tentative d'envoi de l'email de vérification...")
    console.log('📧 Destinataire:', email)
    console.log('📧 Expéditeur:', `${SENDER_NAME} <${SENDER_EMAIL}>`)

    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: email,
      subject: 'Vérifiez votre adresse email - MendelCorp',
      react: <VerificationEmail name={name} token={token} />,
    })

    if (result.error) {
      console.error('❌ Erreur Resend:', JSON.stringify(result.error, null, 2))
      throw new Error(`Resend Error: ${JSON.stringify(result.error)}`)
    }

    console.log(
      '✅ Email de vérification envoyé avec succès. ID:',
      result.data?.id
    )
    return result
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'envoi de l'email de vérification:",
      error
    )
    throw error
  }
}
