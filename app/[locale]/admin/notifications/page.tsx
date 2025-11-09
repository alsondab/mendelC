import { NotificationSettings } from '@/components/shared/notifications/notification-settings'
import { getTranslations } from 'next-intl/server'

export default async function NotificationsPage() {
  const t = await getTranslations('Admin.NotificationsSettings')

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          {t('Title')}
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mt-1 sm:mt-2">
          {t('Description')}
        </p>
      </div>

      <NotificationSettings />
    </div>
  )
}
