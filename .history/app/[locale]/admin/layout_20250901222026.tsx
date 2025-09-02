import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Menu from '@/components/shared/header/menu'
import { AdminNav, AdminMobileMenu } from './admin-nav'
import { getSetting } from '@/lib/actions/setting.actions'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { site } = await getSetting()
  return (
    <>
      <div className='flex flex-col'>
        <div className='bg-black text-white'>
          <div className='flex h-16 items-center px-4 sm:px-6'>
            <Link href='/' className='flex items-center space-x-2'>
              <Image
                src='/icons/logo.png'
                width={40}
                height={40}
                alt={`${site.name} logo`}
                className='w-8 h-8 sm:w-10 sm:h-10'
              />
              <span className='hidden sm:block text-white font-bold text-lg'>
                {site.name}
              </span>
            </Link>
            <AdminNav className='mx-4 sm:mx-6 hidden md:flex' />
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
