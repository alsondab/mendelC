'use client'

import { useEffect, useRef, useState } from 'react'

interface SidebarScrollIndicatorProps {
  children: React.ReactNode
}

export function SidebarScrollIndicator({ children }: SidebarScrollIndicatorProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollbar, setShowScrollbar] = useState(false)
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [thumbHeight, setThumbHeight] = useState(20)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const checkScrollable = () => {
      const { scrollHeight, clientHeight, scrollTop } = element
      const isScrollable = scrollHeight > clientHeight
      setShowScrollbar(isScrollable)
      
      if (isScrollable) {
        const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100
        setScrollPercentage(Math.min(100, Math.max(0, percentage)))
        const calculatedThumbHeight = Math.max(20, (clientHeight / scrollHeight) * 100)
        setThumbHeight(calculatedThumbHeight)
      } else {
        setThumbHeight(20)
        setScrollPercentage(0)
      }
    }

    checkScrollable()
    
    const handleScroll = () => {
      checkScrollable()
    }

    const resizeObserver = new ResizeObserver(checkScrollable)
    
    element.addEventListener('scroll', handleScroll, { passive: true })
    resizeObserver.observe(element)

    return () => {
      element.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className='relative h-full flex-1 min-h-0'>
      <div
        ref={scrollRef}
        className='h-full overflow-y-scroll overscroll-contain pr-3 drawer-scroll'
        style={{ 
          scrollbarWidth: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
      
      {/* Scrollbar personnalisée visible toujours - s'affiche même si native est cachée */}
      {showScrollbar && (
        <div className='absolute right-1 top-2 bottom-2 w-3.5 flex flex-col items-center pointer-events-none z-10'>
          <div className='flex-1 w-3 bg-muted/50 rounded-full relative overflow-hidden border border-primary/30 shadow-sm'>
            <div
              className='absolute left-0 right-0 bg-primary/80 rounded-full transition-all duration-150 shadow-md'
              style={{
                height: `${Math.min(100, thumbHeight)}%`,
                top: `${scrollPercentage * ((100 - Math.min(100, thumbHeight)) / 100)}%`,
                opacity: 1,
                minHeight: '30px',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

