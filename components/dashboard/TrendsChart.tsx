'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TrendDataPoint {
  label: string
  income: number
  expenses: number
  net: number
}

interface Props {
  trends: any
  userRole: string | undefined
}

export function TrendsChart({ trends, userRole }: Props) {
  if (userRole === 'viewer') {
    return (
      <div style={{ background: '#EEEDEA', border: '1px solid #D4D2CB', padding: '20px', borderRadius: '2px' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B6960', marginBottom: '12px' }}>
          Monthly Trends
        </div>
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B6960' }}>
          🔒 Trend data is available for Analyst and Admin roles only
        </div>
      </div>
    )
  }

  // Extract the array from the API response shape
  const chartData: TrendDataPoint[] = Array.isArray(trends) 
    ? trends 
    : trends?.data ?? trends?.trends ?? []

  if (!chartData || chartData.length === 0) {
    return (
      <div style={{ background: '#EEEDEA', border: '1px solid #D4D2CB', padding: '20px', borderRadius: '2px' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B6960', marginBottom: '12px' }}>
          Monthly Trends
        </div>
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B6960', fontSize: '13px' }}>
          No trend data available
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#EEEDEA', border: '1px solid #D4D2CB', padding: '20px', borderRadius: '2px', marginBottom: '16px' }}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B6960', marginBottom: '16px' }}>
        Monthly Trends
      </div>
      <div style={{ width: '100%', height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D4D2CB" />
            <XAxis 
              dataKey="label" 
              tick={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fill: '#6B6960' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fill: '#6B6960' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{ 
                background: '#0F0F0E', border: 'none',
                borderRadius: '2px', padding: '10px 14px',
                fontFamily: 'DM Mono, monospace', fontSize: '12px',
                color: '#F5F4F0'
              }}
              formatter={(value: number) => 
                [`₹${value.toLocaleString('en-IN')}`, '']}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#1A6B4A" 
              strokeWidth={2}
              fill="#1A6B4A" 
              fillOpacity={0.08}
              name="Income"
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stroke="#C84B31" 
              strokeWidth={2}
              fill="#C84B31" 
              fillOpacity={0.08}
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
