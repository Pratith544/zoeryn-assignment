'use client'

import { UserStatus } from '@/types'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: UserStatus
  className?: string
}

const statusLabels: Record<UserStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const active = status === 'active'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-0.5 font-body text-[11px] font-medium',
        active
          ? 'border-[#1A6B4A] text-[#1A6B4A]'
          : 'border-[#6B6960] text-[#6B6960] dark:border-[#8A8880] dark:text-[#8A8880]',
        className
      )}
    >
      <span
        className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-[#1A6B4A]' : 'bg-[#6B6960]')}
      />
      {statusLabels[status]}
    </span>
  )
}
