'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className
      )}
    >
      <Icon className="mb-4 h-8 w-8 text-[#6B6960] opacity-80" strokeWidth={1.5} />
      <h3 className="font-syne text-base font-semibold text-[#0F0F0E] dark:text-[#F0EFE9]">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 max-w-sm font-body text-[13px] text-[#6B6960] dark:text-[#8A8880]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
