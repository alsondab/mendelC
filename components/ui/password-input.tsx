'use client'

import * as React from 'react'
import { Input } from './input'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

type PasswordInputProps = React.ComponentProps<'input'> & {
  containerClassName?: string
}

export default function PasswordInput({
  className,
  containerClassName,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const t = useTranslations('Auth')

  return (
    <div className={cn('relative', containerClassName)}>
      <Input
        {...props}
        type={isVisible ? 'text' : 'password'}
        className={cn('pr-10', className)}
      />
      <button
        type="button"
        aria-pressed={isVisible}
        aria-label={isVisible ? t('Hide password') : t('Show password')}
        title={isVisible ? t('Hide password') : t('Show password')}
        onClick={() => setIsVisible((v) => !v)}
        className="absolute inset-y-0 right-0 px-2 flex items-center text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
      >
        {isVisible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}
