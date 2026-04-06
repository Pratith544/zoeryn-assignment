'use client'

import { FinancialRecord } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface AmountDisplayProps {
  amount: number
  type?: FinancialRecord['type']
  showSign?: boolean
  className?: string
}

export function AmountDisplay({
  amount,
  type,
  showSign = true,
  className = '',
}: AmountDisplayProps) {
  const isIncome = type === 'income' || amount > 0
  const prefix = showSign ? (isIncome ? '+' : '−') : ''
  const colorClass = isIncome ? 'amount-income' : 'amount-expense'

  return (
    <span className={`font-mono font-semibold tabular-nums ${colorClass} ${className}`}>
      {prefix}
      {formatCurrency(Math.abs(amount))}
    </span>
  )
}
