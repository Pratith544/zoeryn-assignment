'use client'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
      <div>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '22px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#0F0F0E',
          marginBottom: '4px',
          margin: 0
        }}>
          {title}
        </h1>
        {subtitle ? (
          <p style={{ marginTop: '4px', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#6B6960', margin: 0 }}>{subtitle}</p>
        ) : null}
      </div>
      {action ? <div style={{ flexShrink: 0 }}>{action}</div> : null}
    </div>
  )
}
