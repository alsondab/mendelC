'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface PromotionTimerProps {
  expiryDate: Date
  compact?: boolean
}

const PromotionTimer = ({ expiryDate, compact = false }: PromotionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const expiry = new Date(expiryDate).getTime()
      const difference = expiry - now

      if (difference <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true
        })
        clearInterval(timer)
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({
          hours,
          minutes,
          seconds,
          isExpired: false
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expiryDate])

  if (timeLeft.isExpired) {
    return (
      <div className='flex items-center gap-1 text-red-600 text-xs font-semibold'>
        <Clock className='h-3 w-3' />
        <span>Expiré</span>
      </div>
    )
  }

  if (compact) {
    return (
      <div className='flex items-center gap-1 text-orange-600 text-xs font-semibold'>
        <Clock className='h-3 w-3' />
        <span>
          {timeLeft.hours > 0 && `${timeLeft.hours}h`}
          {timeLeft.minutes > 0 && `${timeLeft.minutes}m`}
          {timeLeft.seconds}s
        </span>
      </div>
    )
  }

  return (
    <div className='flex items-center gap-2 text-orange-600 text-sm font-semibold'>
      <Clock className='h-4 w-4' />
      <span>Expire dans :</span>
      <div className='flex gap-1'>
        {timeLeft.hours > 0 && (
          <span className='bg-orange-100 px-1 rounded text-xs'>
            {timeLeft.hours}h
          </span>
        )}
        <span className='bg-orange-100 px-1 rounded text-xs'>
          {timeLeft.minutes.toString().padStart(2, '0')}m
        </span>
        <span className='bg-orange-100 px-1 rounded text-xs'>
          {timeLeft.seconds.toString().padStart(2, '0')}s
        </span>
      </div>
    </div>
  )
}

export default PromotionTimer
