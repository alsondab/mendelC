'use client'

import { motion } from 'framer-motion'
import { Skeleton } from './skeleton'
import { fadeIn, staggerContainer, staggerItem } from '@/lib/utils/animations'

interface AnimatedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number
  stagger?: boolean
  className?: string
}

export function AnimatedSkeleton({
  count = 1,
  stagger = false,
  className,
  ...props
}: AnimatedSkeletonProps) {
  if (count === 1 && !stagger) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className={className}
      >
        <Skeleton className={className} {...props} />
      </motion.div>
    )
  }

  if (stagger) {
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className={className}
      >
        {Array.from({ length: count }).map((_, i) => (
          <motion.div key={i} variants={staggerItem}>
            <Skeleton {...props} />
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: i * 0.1 }}
        >
          <Skeleton className={className} {...props} />
        </motion.div>
      ))}
    </>
  )
}

