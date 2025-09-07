import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import WishlistContent from './wishlist-content'

export default async function WishlistPage() {
  const session = await auth()
  const t = await getTranslations()

  if (!session?.user) {
    redirect('/sign-in')
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-foreground mb-2'>
          {t('Wishlist.Title')}
        </h1>
        <p className='text-muted-foreground'>{t('Wishlist.Description')}</p>
      </div>

      <WishlistContent />
    </div>
  )
}
