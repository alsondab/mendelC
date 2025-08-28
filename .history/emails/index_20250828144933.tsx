import { Resend } from 'resend'
import PurchaseReceiptEmail from './purchase-receipt'
import { IOrder } from '@/lib/db/models/order.model'
import AskReviewOrderItemsEmail from './ask-review-order-items'
import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: 'Purchase Receipt - Payment Confirmed', // ✅ Sujet pour paiement
    react: <PurchaseReceiptEmail order={order} />,
  })
}

export const sendOrderConfirmation = async ({ order }: { order: IOrder }) => {
  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: 'Order Confirmation - Cash On Delivery', // ✅ Sujet pour COD
    react: <PurchaseReceiptEmail order={order} />,
  })
}

export const sendAskReviewOrderItems = async ({ order }: { order: IOrder }) => {
  const oneDayFromNow = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()

  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: 'Review Your Order Items', // ✅ Sujet pour demande d'avis
    react: <AskReviewOrderItemsEmail order={order} />,
  })
}
