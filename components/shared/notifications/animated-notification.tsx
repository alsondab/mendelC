'use client'

import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedNotificationProps {
  children: ReactNode
  direction?: 'top' | 'bottom'
  duration?: number
  delay?: number
  className?: string
}

const getVariants = (
  direction: 'top' | 'bottom',
  duration: number
): Variants => {
  const yOffset = direction === 'top' ? -20 : 20
  const exitY = direction === 'top' ? 20 : -20

  return {
    initial: {
      opacity: 0,
      y: yOffset,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration,
      },
    },
    exit: {
      opacity: 0,
      y: exitY,
      scale: 0.95,
      transition: {
        duration: duration * 0.6,
        ease: 'easeInOut',
      },
    },
  }
}

export function AnimatedNotification({
  children,
  direction = 'bottom',
  duration = 0.3,
  delay = 0,
  className = '',
}: AnimatedNotificationProps) {
  const variants = getVariants(direction, duration)

  return (
    <motion.div
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

