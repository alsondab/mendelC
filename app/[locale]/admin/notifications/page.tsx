import { NotificationSettings } from '@/components/shared/notifications/notification-settings'

export default function NotificationsPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Notifications de Stock</h1>
        <p className='text-muted-foreground'>
          Configurez les alertes et notifications pour la gestion des stocks
        </p>
      </div>

      <NotificationSettings />
    </div>
  )
}
