'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { slideFade } from '@/lib/utils/animations'

interface PageTransitionProps {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
}

export function PageTransition({ children, direction = 'left' }: PageTransitionProps) {
  const pathname = usePathname()

  const variants = slideFade(direction)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

