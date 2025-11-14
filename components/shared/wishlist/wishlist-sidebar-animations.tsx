'use client'

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

// ⚡ Optimization: Lazy load framer-motion pour réduire le First Load JS de ~37 KiB
// Les animations ne sont nécessaires que quand le sidebar est ouvert
const MotionDiv = dynamic(
  () =>
    import('framer-motion').then((mod) => ({
      default: mod.motion.div,
    })),
  {
    ssr: false,
  }
)

const MotionButton = dynamic(
  () =>
    import('framer-motion').then((mod) => ({
      default: mod.motion.button,
    })),
  {
    ssr: false,
  }
)

const AnimatePresence = dynamic(
  () =>
    import('framer-motion').then((mod) => ({
      default: mod.AnimatePresence,
    })),
  {
    ssr: false,
  }
)

// Wrapper pour motion.div avec variants
export function AnimatedOverlay({
  variants,
  onClick,
  className,
}: {
  variants: unknown
  onClick: () => void
  className: string
}) {
  return (
    <MotionDiv
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      variants={variants as any}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClick}
      className={className}
    />
  )
}

// Wrapper pour motion.div avec variants (slider)
export function AnimatedSlider({
  variants,
  className,
  children,
  role,
  'aria-modal': ariaModal,
  'aria-labelledby': ariaLabelledBy,
}: {
  variants: unknown
  className: string
  children: ReactNode
  role?: string
  'aria-modal'?: boolean
  'aria-labelledby'?: string
}) {
  return (
    <MotionDiv
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      variants={variants as any}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      role={role}
      aria-modal={ariaModal}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </MotionDiv>
  )
}

// Wrapper pour motion.button avec variants
export function AnimatedButton({
  variants,
  onClick,
  className,
  children,
  'aria-label': ariaLabel,
  type,
}: {
  variants: unknown
  onClick: () => void
  className: string
  children: ReactNode
  'aria-label'?: string
  type?: 'button' | 'submit' | 'reset'
}) {
  return (
    <MotionButton
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      variants={variants as any}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
      type={type}
    >
      {children}
    </MotionButton>
  )
}

// Wrapper pour AnimatePresence
export function AnimatedPresenceWrapper({ children }: { children: ReactNode }) {
  return <AnimatePresence>{children}</AnimatePresence>
}
