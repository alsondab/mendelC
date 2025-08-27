'use client'

import { useEffect } from 'react'
import useCartSidebar from '@/hooks/use-cart-sidebar'
import CartSidebar from './cart-sidebar'

export default function CartSidebarWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const visible = useCartSidebar()

  useEffect(() => {
    // Force re-render after mount to ensure hydration consistency
  }, [])

  return (
    <div className='min-h-screen'>
      <div className='flex'>
        <div className='flex-1 overflow-hidden'>{children}</div>
        <div
          className={`transition-all duration-300 ${visible ? 'w-80' : 'w-0'}`}
        >
          {visible && <CartSidebar />}
        </div>
      </div>
    </div>
  )
}
