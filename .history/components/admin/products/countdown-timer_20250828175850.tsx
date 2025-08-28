'use client'

import { useState, useEffect } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'

interface CountdownTimerProps {
  expiryDate: Date
}

const CountdownTimer = ({ expiryDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const expiry = new Date(expiryDate).getTime()
      const difference = expiry - now

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        })
        clearInterval(timer)
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        )
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isExpired: false,
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expiryDate])

  if (timeLeft.isExpired) {
    return (
      <div className='flex items-center gap-2 text-red-600 font-semibold'>
        <AlertTriangle className='h-5 w-5' />
        <span>Promotion expirée !</span>
      </div>
    )
  }

  return (
    <div className='flex items-center gap-4'>
      <Clock className='h-5 w-5 text-green-600' />
      <div className='flex gap-3'>
        {timeLeft.days > 0 && (
          <div className='text-center'>
            <div className='text-2xl font-bold text-green-600'>
              {timeLeft.days}
            </div>
            <div className='text-xs text-green-700'>Jours</div>
          </div>
        )}
        <div className='text-center'>
          <div className='text-2xl font-bold text-green-600'>
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className='text-xs text-green-700'>Heures</div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold text-green-600'>
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className='text-xs text-green-700'>Minutes</div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold text-green-600'>
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className='text-xs text-green-700'>Secondes</div>
        </div>
      </div>
    </div>
  )
}

export default CountdownTimer
