'use client'

import { motion } from 'framer-motion'
import { AnimatedSkeleton } from '@/components/ui/animated-skeleton'
import { staggerContainer, staggerItem, fadeIn } from '@/lib/utils/animations'

export default function LoadingPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Progress Bar - Discret et élégant */}
      <div className='fixed top-0 left-0 right-0 h-[2px] z-[100] bg-border/20'>
        <motion.div
          initial={{ width: '0%', opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.43, 0.13, 0.23, 0.96],
            repeat: Infinity,
            repeatType: 'loop',
            repeatDelay: 0.3,
          }}
          className='h-full bg-gradient-to-r from-transparent via-primary to-transparent'
          style={{
            background:
              'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
            filter: 'blur(0.5px)',
          }}
        />
      </div>

      {/* Header Skeleton */}
      <motion.div
        variants={fadeIn}
        initial='hidden'
        animate='visible'
        className='border-b bg-card'
      >
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <AnimatedSkeleton className='h-8 w-32' />
            <div className='hidden md:flex flex-1 max-w-2xl mx-8'>
              <AnimatedSkeleton className='h-10 w-full rounded-full' />
            </div>
            <div className='flex items-center gap-4'>
              <AnimatedSkeleton className='h-6 w-20' />
              <AnimatedSkeleton className='h-6 w-16' />
              <AnimatedSkeleton className='h-8 w-8 rounded-full' />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Skeleton */}
      <motion.div
        variants={fadeIn}
        initial='hidden'
        animate='visible'
        transition={{ delay: 0.1 }}
        className='border-b bg-card/50'
      >
        <div className='container mx-auto px-4 py-2'>
          <motion.div
            variants={staggerContainer}
            initial='hidden'
            animate='visible'
            className='flex items-center gap-6'
          >
            {[...Array(6)].map((_, i) => (
              <motion.div key={i} variants={staggerItem}>
                <AnimatedSkeleton className='h-6 w-20' />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Skeleton */}
      <div className='container mx-auto px-4 py-8 space-y-8'>
        {/* Hero Section */}
        <motion.div
          variants={fadeIn}
          initial='hidden'
          animate='visible'
          transition={{ delay: 0.2 }}
          className='space-y-4'
        >
          <AnimatedSkeleton className='h-64 w-full rounded-lg' />
          <div className='flex justify-center gap-2'>
            {[...Array(4)].map((_, i) => (
              <AnimatedSkeleton key={i} className='h-2 w-8 rounded-full' />
            ))}
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={staggerContainer}
          initial='hidden'
          animate='visible'
          transition={{ delay: 0.3 }}
          className='space-y-4'
        >
          <AnimatedSkeleton className='h-8 w-48' />
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[...Array(8)].map((_, i) => (
              <motion.div key={i} variants={staggerItem} className='space-y-3'>
                <AnimatedSkeleton className='h-32 w-full rounded-lg' />
                <AnimatedSkeleton className='h-4 w-3/4' />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Product Sliders */}
        {[...Array(3)].map((_, sectionIndex) => (
          <motion.div
            key={sectionIndex}
            variants={staggerContainer}
            initial='hidden'
            animate='visible'
            transition={{ delay: 0.4 + sectionIndex * 0.1 }}
            className='space-y-4'
          >
            <div className='flex items-center justify-between'>
              <AnimatedSkeleton className='h-6 w-40' />
              <AnimatedSkeleton className='h-6 w-20' />
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  className='space-y-3'
                >
                  <AnimatedSkeleton className='h-40 w-full rounded-lg' />
                  <AnimatedSkeleton className='h-4 w-3/4' />
                  <AnimatedSkeleton className='h-4 w-1/2' />
                  <AnimatedSkeleton className='h-6 w-20' />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Skeleton */}
      <motion.div
        variants={fadeIn}
        initial='hidden'
        animate='visible'
        transition={{ delay: 0.7 }}
        className='border-t bg-card mt-16'
      >
        <div className='container mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                variants={staggerContainer}
                initial='hidden'
                animate='visible'
                className='space-y-3'
              >
                <AnimatedSkeleton className='h-5 w-24' />
                {[...Array(4)].map((_, j) => (
                  <motion.div key={j} variants={staggerItem}>
                    <AnimatedSkeleton className='h-4 w-32' />
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </div>
          <div className='border-t pt-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-4'>
            <AnimatedSkeleton className='h-6 w-32' />
            <div className='flex gap-4'>
              <AnimatedSkeleton className='h-6 w-20' />
              <AnimatedSkeleton className='h-6 w-20' />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
