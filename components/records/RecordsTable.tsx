'use client'

import { FinancialRecord } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { Edit2, Trash2, Inbox } from 'lucide-react'

interface RecordsTableProps {
  records: FinancialRecord[]
  loading: boolean
  onEdit: (record: FinancialRecord) => void
  onDelete: (record: FinancialRecord) => void
  canEdit: boolean
  canDelete: boolean
}

function truncate(s: string, n: number) {
  if (s.length <= n) return s
  return `${s.slice(0, n)}…`
}

export function RecordsTable({
  records,
  loading,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: RecordsTableProps) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 0' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: '48px',
              backgroundColor: '#EEEDEA',
              borderRadius: '4px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
        ))}
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}>
        <Inbox style={{ marginBottom: '16px', width: '32px', height: '32px', color: '#6B6960', strokeWidth: '1.5' }} strokeWidth={1.5} />
        <p style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: '600', color: '#0F0F0E' }}>
          No records found
        </p>
        <p style={{ marginTop: '8px', maxWidth: '448px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#6B6960' }}>
          Try adjusting your filters or create a new record
        </p>
      </div>
    )
  }

  const showActions = canEdit || canDelete

  const thStyle = {
    padding: '10px 16px',
    textAlign: 'left' as const,
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.1em',
    color: '#6B6960',
    textTransform: 'uppercase' as const,
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #D4D2CB' }}>
            <th style={{ ...thStyle, width: '100px' }}>Date</th>
            <th style={thStyle}>Category</th>
            <th style={{ ...thStyle, width: '100px' }}>Type</th>
            <th style={thStyle}>Notes</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
            {showActions ? <th style={{ ...thStyle, width: '88px', textAlign: 'center' }}>ACTIONS</th> : null}
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const isIncome = record.type === 'income'
            return (
              <tr
                key={record._id}
                style={{
                  borderBottom: '1px solid #D4D2CB',
                  height: '48px',
                  transition: 'all 150ms ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#EEEDEA'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <td style={{ padding: '0 16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#6B6960' }}>
                  {formatDate(record.date, 'short')}
                </td>
                <td style={{ padding: '0 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F0F0E' }}>
                  {record.category}
                </td>
                <td style={{ padding: '0 16px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      borderRadius: '2px',
                      border: isIncome ? '1px solid #1A6B4A' : '1px solid #C84B31',
                      backgroundColor: isIncome ? '#E8F5EF' : '#FBF0EE',
                      color: isIncome ? '#1A6B4A' : '#C84B31',
                      padding: '4px 8px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    {isIncome ? 'Income' : 'Expense'}
                  </span>
                </td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#6B6960' }}>
                  {truncate(record.notes || '—', 40)}
                </td>
                <td
                  style={{
                    padding: '0 16px',
                    textAlign: 'right',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    fontVariantNumeric: 'tabular-nums',
                    color: isIncome ? '#1A6B4A' : '#C84B31',
                  }}
                >
                  {isIncome ? '+' : '−'}
                  {formatCurrency(Math.abs(record.amount))}
                </td>
                {showActions ? (
                  <td style={{ padding: '0 16px' }}>
                    <div 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', opacity: 1, transition: 'opacity 150ms ease-in-out', pointerEvents: 'all' }}
                    >
                      {canEdit ? (
                        <button
                          type="button"
                          onClick={() => onEdit(record)}
                          style={{
                            padding: '4px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#6B6960',
                            cursor: 'pointer',
                            transition: 'color 150ms',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#0F0F0E' }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#6B6960' }}
                          aria-label="Edit"
                        >
                          <Edit2 style={{ width: '14px', height: '14px', strokeWidth: 2 }} strokeWidth={2} />
                        </button>
                      ) : null}
                      {canDelete ? (
                        <button
                          type="button"
                          onClick={() => onDelete(record)}
                          style={{
                            padding: '4px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#6B6960',
                            cursor: 'pointer',
                            transition: 'color 150ms',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#C84B31' }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#6B6960' }}
                          aria-label="Delete"
                        >
                          <Trash2 style={{ width: '14px', height: '14px', strokeWidth: 2 }} strokeWidth={2} />
                        </button>
                      ) : null}
                    </div>
                  </td>
                ) : null}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
