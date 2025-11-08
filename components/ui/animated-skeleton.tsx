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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        variants={fadeIn as any}
        initial='hidden'
        animate='visible'
        className={className}
      >
        <Skeleton className={className} {...props} />
      </motion.div>
    )
  }

  if (stagger) {
    return (
      <motion.div
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        variants={staggerContainer as any}
        initial='hidden'
        animate='visible'
        className={className}
      >
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            variants={staggerItem as any}
          >
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          variants={fadeIn as any}
          initial='hidden'
          animate='visible'
          transition={{ delay: i * 0.1 }}
        >
          <Skeleton className={className} {...props} />
        </motion.div>
      ))}
    </>
  )
}
