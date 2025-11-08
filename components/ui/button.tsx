'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  disableRipple?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      disableRipple = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Ripple effect avec CSS (sans framer-motion)
      if (!disableRipple && !props.disabled && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const ripple = document.createElement('span')
        ripple.className = 'ripple-effect'
        ripple.style.left = `${x}px`
        ripple.style.top = `${y}px`

        buttonRef.current.appendChild(ripple)

        // Remove ripple after animation
        setTimeout(() => {
          ripple.remove()
        }, 600)
      }

      onClick?.(e)
    }

    // ⚡ Optimization: CSS transitions au lieu de framer-motion pour réduire le bundle (~53 kB)
    const buttonClassName = cn(
      buttonVariants({ variant, size, className }),
      // Animations CSS pour hover et tap (remplace framer-motion)
      'transform transition-transform hover:scale-105 active:scale-95'
    )

    if (asChild) {
      return (
        <Slot
          className={buttonClassName}
          ref={ref}
          onClick={handleClick}
          {...props}
        >
          {props.children}
        </Slot>
      )
    }

    return (
      <button
        ref={(node) => {
          buttonRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={buttonClassName}
        onClick={handleClick}
        {...props}
      >
        {props.children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
