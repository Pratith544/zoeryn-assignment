'use client'

import { UserRole } from '@/types'
import { cn } from '@/lib/utils'

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

const roleStyles: Record<
  UserRole,
  { label: string; className: string }
> = {
  admin: {
    label: 'Admin',
    className:
      'border-[#C49A1A] text-[#C49A1A] bg-transparent',
  },
  analyst: {
    label: 'Analyst',
    className:
      'border-[#185FA5] text-[#185FA5] bg-transparent dark:border-[#185FA5] dark:text-[#5BA3E0]',
  },
  viewer: {
    label: 'Viewer',
    className:
      'border-[#6B6960] text-[#6B6960] bg-transparent dark:border-[#8A8880] dark:text-[#8A8880]',
  },
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const cfg = roleStyles[role]

  return (
    <span
      className={cn(
        'inline-block rounded-[2px] border px-2 py-0.5 font-body text-[11px] font-medium',
        cfg.className,
        className
      )}
    >
      {cfg.label}
    </span>
  )
}
