'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default:
        'bg-[#0F0F0E] text-[#F5F4F0] hover:bg-[#2a2a28] dark:bg-[#F0EFE9] dark:text-[#0C0C0B] dark:hover:bg-[#e5e4de]',
      outline:
        'border border-[#D4D2CB] bg-transparent text-[#0F0F0E] hover:bg-[#EEEDEA] dark:border-[#242422] dark:text-[#F0EFE9] dark:hover:bg-[#141413]',
      ghost:
        'text-[#0F0F0E] hover:bg-[#EEEDEA] dark:text-[#F0EFE9] dark:hover:bg-[#141413]',
      destructive: 'bg-[#C84B31] text-white hover:opacity-90',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-[13px] font-semibold',
      lg: 'px-6 py-3 text-base',
    }

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-[2px] font-body transition-base disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
