import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { AdminNav, AdminMobileMenu } from './admin-nav'
import { getSetting } from '@/lib/actions/setting.actions'
import { AdminGuard } from '@/components/shared/admin/admin-guard'
import { StockNotificationToast } from '@/components/shared/notifications/stock-notification-toast'
import { StockPersistentAlert } from '@/components/shared/notifications/stock-persistent-alert'
import { StockAlertIndicator } from '@/components/shared/notifications/stock-alert-indicator'
import AdminLogoutButton from '@/components/shared/admin/admin-logout-button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { site } = await getSetting()
  return (
    <AdminGuard>
      <div className='flex flex-col'>
        {/* Notifications de Stock */}
        <StockNotificationToast />
        <StockPersistentAlert />

        <div className='bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 shadow-sm'>
          <div className='flex h-16 items-center gap-2 sm:gap-3 px-2 sm:px-4 lg:px-6 overflow-hidden'>
            {/* Logo and Company Name */}
            <div className='flex items-center space-x-2 sm:space-x-3 flex-shrink-0'>
              <Link
                href='/'
                className='flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity'
              >
                <Image
                  src='/icons/logo.png'
                  width={40}
                  height={40}
                  alt={`${site.name} logo`}
                  priority
                  className='flex-shrink-0 sm:w-12 sm:h-12'
                />
                <span className='font-bold text-lg sm:text-xl text-foreground hidden lg:block'>
                  MendelCorp
                </span>
              </Link>
            </div>

            {/* Navigation Links - Desktop */}
            <div className='hidden md:flex items-center justify-center flex-1 min-w-0 overflow-x-auto scrollbar-hide'>
              <AdminNav />
            </div>

            {/* Mobile Menu - Right Side */}
            <div className='flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-auto'>
              <StockAlertIndicator />
              <AdminLogoutButton />
              <AdminMobileMenu />
            </div>
          </div>
        </div>
        <div className='flex-1 p-4'>{children}</div>
      </div>
    </AdminGuard>
  )
}
