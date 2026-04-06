'use client'

import { RecordFilters, RecordType } from '@/types'
import { cn } from '@/lib/utils'

interface RecordFiltersProps {
  filters: RecordFilters
  onFiltersChange: (filters: Partial<RecordFilters>) => void
  onClear: () => void
  isFiltered: boolean
}

export function RecordFiltersComponent({
  filters,
  onFiltersChange,
  onClear,
  isFiltered,
}: RecordFiltersProps) {
  const selectStyle = {
    height: '36px',
    minWidth: '120px',
    border: '1px solid #D4D2CB',
    backgroundColor: '#F5F4F0',
    padding: '0 8px',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: '#0F0F0E',
    outline: 'none',
    transition: 'border-color 150ms',
    cursor: 'pointer',
  } as const

  const inputStyle = {
    height: '36px',
    flex: 1,
    minWidth: '140px',
    border: '1px solid #D4D2CB',
    backgroundColor: '#F5F4F0',
    padding: '0 8px',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: '#0F0F0E',
    outline: 'none',
    transition: 'border-color 150ms',
  } as const

  const labelStyle = {
    marginBottom: '6px',
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: 600,
    color: '#6B6960',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  }

  const handleTypeChange = (type: RecordType | '') => {
    onFiltersChange({ type })
  }

  const toggleSortOrder = () => {
    onFiltersChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '12px', padding: '16px 0' }}>
      <div>
        <p style={labelStyle}>Type</p>
        <select
          style={selectStyle}
          value={filters.type || ''}
          onChange={(e) => handleTypeChange(e.target.value as RecordType | '')}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#0F0F0E' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#D4D2CB' }}
        >
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div style={{ minWidth: '180px', flex: 1 }}>
        <p style={labelStyle}>Category</p>
        <input
          type="text"
          placeholder="Filter by category..."
          style={{ ...inputStyle, width: '100%' }}
          value={filters.category || ''}
          onChange={(e) => onFiltersChange({ category: e.target.value })}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#0F0F0E' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#D4D2CB' }}
        />
      </div>

      <div>
        <p style={labelStyle}>Start</p>
        <input
          type="date"
          style={inputStyle}
          value={filters.startDate || ''}
          onChange={(e) => onFiltersChange({ startDate: e.target.value })}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#0F0F0E' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#D4D2CB' }}
        />
      </div>

      <div>
        <p style={labelStyle}>End</p>
        <input
          type="date"
          style={inputStyle}
          value={filters.endDate || ''}
          onChange={(e) => onFiltersChange({ endDate: e.target.value })}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#0F0F0E' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#D4D2CB' }}
        />
      </div>

      <div>
        <p style={labelStyle}>Sort</p>
        <select
          style={selectStyle}
          value={filters.sortBy}
          onChange={(e) => onFiltersChange({ sortBy: e.target.value })}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#0F0F0E' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#D4D2CB' }}
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="category">Category</option>
        </select>
      </div>

      <button
        type="button"
        onClick={toggleSortOrder}
        style={{
          height: '36px',
          border: '1px solid #D4D2CB',
          backgroundColor: '#F5F4F0',
          padding: '0 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          color: '#0F0F0E',
          transition: 'background-color 150ms',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EEEDEA' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F5F4F0' }}
        aria-label={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
      >
        {filters.sortOrder === 'asc' ? '↑' : '↓'}
      </button>

      {isFiltered ? (
        <button
          type="button"
          onClick={onClear}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: 500,
            color: '#C84B31',
            transition: 'text-decoration 150ms',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: 'transparent',
            padding: '0',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline' }}
          onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}
        >
          Clear filters
        </button>
      ) : null}
    </div>
  )
}
