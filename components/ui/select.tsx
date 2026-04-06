'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, ...props }, ref) => (
    <div className="relative">
      <select
        className={cn(
          'w-full px-3 py-2 text-sm bg-background border border-input rounded-sm transition-base',
          'focus:outline-none focus:border-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'appearance-none',
          error && 'border-expense focus:border-expense',
          className
        )}
        ref={ref}
        {...props}
      />
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  )
)

Select.displayName = 'Select'

export { Select }
