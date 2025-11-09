import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { AdminNav, AdminMobileMenu } from './admin-nav'
import { getSetting } from '@/lib/actions/setting.actions'
import { AdminGuard } from '@/components/shared/admin/admin-guard'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { site } = await getSetting()
  return (
    <AdminGuard>
      <div className="flex flex-col">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 shadow-sm">
          <div className="flex h-16 items-center px-4 lg:px-6">
            {/* Logo and Company Name */}
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/icons/logo.png"
                  width={48}
                  height={48}
                  alt={`${site.name} logo`}
                  className="flex-shrink-0"
                />
                <span className="font-bold text-xl text-foreground hidden sm:block">
                  MendelCorp
                </span>
              </Link>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center ml-8 lg:ml-12">
              <AdminNav />
            </div>

            {/* Mobile Menu - Right Side */}
            <div className="ml-auto flex items-center space-x-2">
              <AdminMobileMenu />
            </div>
          </div>
        </div>
        <div className="flex-1 p-4">{children}</div>
      </div>
    </AdminGuard>
  )
}
