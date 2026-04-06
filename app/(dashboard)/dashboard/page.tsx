'use client'

import { format } from 'date-fns'
import { useDashboard } from '@/hooks/useDashboard'
import { useRecords } from '@/hooks/useRecords'
import { useAuth } from '@/context/AuthContext'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { TrendsChart } from '@/components/dashboard/TrendsChart'
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { PageWrapper } from '@/components/shared/PageWrapper'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

export default function DashboardPage() {
  const { loading, summary, trends, categories } = useDashboard()
  const { records, loading: recordsLoading } = useRecords({
    limit: 5,
    sortBy: 'date',
    sortOrder: 'desc',
  })
  const { user } = useAuth()

  const today = format(new Date(), 'EEEE, d MMM yyyy')

  if (loading) {
    return (
      <PageWrapper>
        <div className="space-y-8">
          <LoadingSkeleton rows={4} columns={4} className="h-24" />
          <LoadingSkeleton rows={2} columns={1} />
          <LoadingSkeleton rows={3} columns={1} />
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <header>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '28px',
            fontWeight: 800,
            color: '#0F0F0E',
            letterSpacing: '-0.02em',
            marginBottom: '4px'
          }}>
            Dashboard
          </h1>
          <p style={{ marginTop: '4px', fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#6B6960' }}>{today}</p>
        </header>

        <ErrorBoundary>{summary ? <SummaryCards summary={summary} /> : null}</ErrorBoundary>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ErrorBoundary>
            <TrendsChart trends={trends} userRole={user?.role} />
          </ErrorBoundary>
          <ErrorBoundary>
            <CategoryBreakdown categories={categories} />
          </ErrorBoundary>
        </div>

        <ErrorBoundary>
          {recordsLoading ? (
            <LoadingSkeleton rows={5} columns={4} />
          ) : (
            <RecentActivity records={records} />
          )}
        </ErrorBoundary>
      </div>
    </PageWrapper>
  )
}
