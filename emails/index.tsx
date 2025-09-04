import { Resend } from 'resend'
import PurchaseReceiptEmail from './purchase-receipt'
import { IOrder } from '@/lib/db/models/order.model'
import AskReviewOrderItemsEmail from './ask-review-order-items'
import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  try {
    console.log("📧 Tentative d'envoi de l'email de reçu...")
    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: (order.user as { email: string }).email,
      subject: 'Reçu de Paiement - Paiement Confirmé', // ✅ Sujet pour paiement
      react: <PurchaseReceiptEmail order={order} />,
    })
    console.log('✅ Email de reçu envoyé avec succès:', result)
    return result
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email de reçu:", error)
    throw error
  }
}

export const sendOrderConfirmation = async ({ order }: { order: IOrder }) => {
  try {
    console.log("📧 Tentative d'envoi de l'email de confirmation...")
    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: (order.user as { email: string }).email,
      subject: 'Confirmation de commande - Paiement à la livraison', // ✅ Sujet pour COD
      react: <PurchaseReceiptEmail order={order} />,
    })
    console.log('✅ Email de confirmation envoyé avec succès:', result)
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
  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: 'Évaluez Vos Articles de Commande', // ✅ Sujet pour demande d'avis
    react: <AskReviewOrderItemsEmail order={order} />,
  })
}
