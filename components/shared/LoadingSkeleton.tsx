'use client'

import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export function LoadingSkeleton({ rows = 6, columns = 5, className }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-3 h-12">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="flex-1 bg-muted rounded-sm animate-shimmer"
              style={{
                backgroundSize: '1000px 100%',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
