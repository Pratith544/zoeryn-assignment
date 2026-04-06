'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'w-full px-3 py-2 text-sm bg-background border-b border-input transition-base',
        'focus:outline-none focus:border-primary focus:border-b-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'placeholder:text-muted-foreground',
        error && 'border-expense focus:border-expense',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)

Input.displayName = 'Input'

export { Input }
