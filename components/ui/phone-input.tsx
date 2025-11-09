'use client'

import { forwardRef } from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  countryCode?: string
  placeholder?: string
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      countryCode = '+225',
      placeholder = '07 12 34 56 78',
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
          {countryCode}
        </span>
        <Input
          className={cn('pl-12', className)}
          placeholder={placeholder}
          type="tel"
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }
