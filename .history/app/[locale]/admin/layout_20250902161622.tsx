import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Menu from '@/components/shared/header/menu'
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
    <>
      <div className='flex flex-col'>
        <div className='bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 shadow-sm'>
          <div className='flex h-16 items-center px-2'>
            <Link href='/'>
              <Image
                src='/icons/logo.png'
                width={48}
                height={48}
                alt={`${site.name} logo`}
              />
            </Link>
            <AdminNav className='mx-6 hidden md:flex' />
            <div className='ml-auto flex items-center space-x-2'>
              <AdminMobileMenu />
              <Menu forAdmin />
            </div>
          </div>
        </div>
        <div className='flex-1 p-4'>{children}</div>
      </div>
    </>
  )
}
