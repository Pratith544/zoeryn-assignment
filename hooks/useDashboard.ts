'use client'

import { useState, useEffect } from 'react'
import { DashboardSummary, TrendData, CategoryData } from '@/types'
import { api } from '@/lib/api'

interface UseDashboardState {
  summary: DashboardSummary | null
  trends: TrendData[] | null
  categories: CategoryData[] | null
  loading: boolean
  error: string | null
}

export function useDashboard() {
  const [state, setState] = useState<UseDashboardState>({
    summary: null,
    trends: null,
    categories: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        // Fetch all data in parallel
        const [summaryRes, trendsRes, categoriesRes] = await Promise.all([
          api.get<DashboardSummary>('/dashboard/summary'),
          api.get<TrendData[]>('/dashboard/trends?period=monthly'),
          api.get<CategoryData[]>('/dashboard/categories'),
        ])

        const summary = summaryRes.success ? (summaryRes.data ?? null) : null
        const trends = trendsRes.success ? (trendsRes.data ?? null) : null
        const categories = categoriesRes.success ? (categoriesRes.data ?? null) : null

        setState((prev) => ({
          ...prev,
          summary,
          trends,
          categories,
          error: null,
        }))
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
        }))
      } finally {
        setState((prev) => ({ ...prev, loading: false }))
      }
    }

    fetchDashboardData()
  }, [])

  return state
}
