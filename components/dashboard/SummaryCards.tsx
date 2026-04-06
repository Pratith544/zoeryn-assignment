'use client'

import { DashboardSummary } from '@/types'
import { TrendingUp, TrendingDown, DollarSign, Receipt } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'
import { formatCurrency } from '@/lib/utils'

interface SummaryCardsProps {
  summary: DashboardSummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const incomeAnim = useCountUp(summary.totalIncome, 800)
  const expenseAnim = useCountUp(summary.totalExpenses, 800)
  const netAnim = useCountUp(summary.netBalance, 800)
  const recordsAnim = useCountUp(summary.totalRecords, 800)

  const cards = [
    {
      label: 'Total Income',
      display: formatCurrency(incomeAnim),
      icon: TrendingUp,
      amountClass: 'text-[#1A6B4A]',
    },
    {
      label: 'Total Expenses',
      display: formatCurrency(expenseAnim),
      icon: TrendingDown,
      amountClass: 'text-[#C84B31]',
    },
    {
      label: 'Net Balance',
      display: formatCurrency(netAnim),
      icon: DollarSign,
      amountClass:
        summary.netBalance >= 0 ? 'text-[#1A6B4A]' : 'text-[#C84B31]',
    },
    {
      label: 'Total Records',
      display: String(Math.round(recordsAnim)),
      icon: Receipt,
      amountClass: 'text-[#0F0F0E] dark:text-[#F0EFE9]',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
      {cards.map((card, idx) => {
        const Icon = card.icon
        const amountColor = 
          card.label === 'Total Income' ? '#1A6B4A' :
          card.label === 'Total Expenses' ? '#C84B31' :
          card.label === 'Net Balance' ? (summary.netBalance >= 0 ? '#1A6B4A' : '#C84B31') :
          '#0F0F0E'
        
        return (
          <div
            key={idx}
            style={{
              background: '#EEEDEA',
              border: '1px solid #D4D2CB',
              padding: '20px',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#6B6960',
                marginBottom: '12px'
              }}>
                {card.label}
              </p>
              <p style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '26px',
                fontWeight: 500,
                color: amountColor,
                marginTop: '8px'
              }}>
                {card.display}
              </p>
            </div>
            <Icon size={16} color="#6B6960" style={{ flexShrink: 0, marginTop: '2px' }} strokeWidth={2} />
          </div>
        )
      })}
    </div>
  )
}
