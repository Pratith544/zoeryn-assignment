'use client'

import { CategoryData, RecordType } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface CategoryBreakdownProps {
  categories: CategoryData[] | { categories: CategoryData[] } | undefined | null
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  // Extract array from API response object if needed
  const categoryArray = Array.isArray(categories) ? categories : categories?.categories ?? []

  // Empty/loading state check
  if (!categoryArray || categoryArray.length === 0) {
    return (
      <div style={{ border: '1px solid #D4D2CB', backgroundColor: '#EEEDEA', padding: '32px' }}>
        <p style={{ display: 'block', marginBottom: '16px', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: '#6B6960', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category Breakdown</p>
        <p style={{ paddingTop: '48px', paddingBottom: '48px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#6B6960' }}>
          No category data available
        </p>
      </div>
    )
  }

  // Safe data processing
  const topCategories = categoryArray
    .filter((c): c is CategoryData => c != null)
    .sort((a, b) => (b.total || 0) - (a.total || 0))
    .slice(0, 8)

  if (topCategories.length === 0) {
    return (
      <div style={{ border: '1px solid #D4D2CB', backgroundColor: '#EEEDEA', padding: '32px' }}>
        <p style={{ display: 'block', marginBottom: '16px', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: '#6B6960', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category Breakdown</p>
        <p style={{ paddingTop: '48px', paddingBottom: '48px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#6B6960' }}>
          No category data available
        </p>
      </div>
    )
  }

  const max = Math.max(...topCategories.map((c) => c.total || 0), 1)

  const barColor = (t: RecordType) =>
    t === 'income' ? '#1A6B4A' : '#C84B31'

  return (
    <div style={{ border: '1px solid #D4D2CB', backgroundColor: '#EEEDEA', padding: '20px' }}>
      <p style={{ display: 'block', marginBottom: '16px', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: '#6B6960', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category Breakdown</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {topCategories.map((row) => {
          const pct = Math.max(4, ((row.total || 0) / max) * 100)
          return (
            <div key={`${row.category}-${row.type}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '100px', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F0F0E' }}>
                {row.category || 'Unknown'}
              </span>
              <div style={{ position: 'relative', height: '24px', minWidth: '0', flex: 1, backgroundColor: '#F5F4F0' }}>
                <div
                  style={{
                    height: '100%',
                    backgroundColor: barColor(row.type),
                    transition: 'width 150ms',
                    width: `${pct}%`,
                  }}
                />
              </div>
              <span style={{ width: '96px', flexShrink: 0, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '11px', fontVariantNumeric: 'tabular-nums', color: '#6B6960' }}>
                {formatCurrency(row.total || 0)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
