'use client'

import { FinancialRecord } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface RecentActivityProps {
  records: FinancialRecord[] | null
}

export function RecentActivity({ records }: RecentActivityProps) {
  const containerStyle = {
    background: '#EEEDEA',
    border: '1px solid #D4D2CB',
    padding: '20px',
    borderRadius: '2px'
  }
  const labelStyle = {
    fontFamily: 'Manrope, sans-serif',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#6B6960',
    marginBottom: '16px'
  }

  if (!records || records.length === 0) {
    return (
      <div style={containerStyle}>
        <p style={labelStyle}>Recent Activity</p>
        <p style={{ textAlign: 'center', fontFamily: 'Manrope, sans-serif', fontSize: '14px', color: '#6B6960' }}>No recent records</p>
      </div>
    )
  }

  const list = records.slice(0, 5)

  return (
    <div style={containerStyle}>
      <p style={labelStyle}>Recent Activity</p>
      <div>
        {list.map((record, idx) => {
          const isIncome = record.type === 'income'
          return (
            <div
              key={record._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                paddingY: '12px',
                borderBottom: idx < list.length - 1 ? '1px solid #D4D2CB' : 'none'
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#6B6960' }}>
                  {formatDate(record.date, 'short')}
                </p>
                <p style={{ marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Manrope, sans-serif', fontSize: '14px', color: '#0F0F0E' }}>
                  {record.category}
                </p>
              </div>
              <span style={{
                flexShrink: 0,
                fontFamily: 'DM Mono, monospace',
                fontSize: '14px',
                color: isIncome ? '#1A6B4A' : '#C84B31'
              }}>
                {isIncome ? '+' : '−'}
                {formatCurrency(Math.abs(record.amount))}
              </span>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <Link
          href="/records"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: '#1A6B4A',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          View all records
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
    </div>
  )
}
