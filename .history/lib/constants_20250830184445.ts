export const SENDER_NAME = process.env.SENDER_NAME || 'MendelCorpTEST'
export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev'

export const USER_ROLES = ['Admin', 'User']
export const COLORS = ['Gold', 'Green', 'Red']
export const THEMES = ['Light', 'Dark', 'System']

export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'Cash On Delivery'

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://mendel-corp-eco.vercel.app/'
    : 'http://localhost:3000')
