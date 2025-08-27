'use client'

import { useEffect, useState } from 'react'
import useCartSidebar from '@/hooks/use-cart-sidebar'
import CartSidebar from './cart-sidebar'

export default function CartSidebarWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const visible = useCartSidebar()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className='min-h-screen'>{children}</div>
  }

  return (
    <>
      {visible ? (
        <div className='flex min-h-screen'>
          <div className='flex-1 overflow-hidden'>{children}</div>
          <CartSidebar />
        </div>
      ) : (
        <div className='min-h-screen'>{children}</div>
      )}
    </>
  )
}
