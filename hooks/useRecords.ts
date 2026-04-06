'use client'

import { useState, useCallback, useEffect } from 'react'
import { FinancialRecord, RecordFilters, PaginatedResponse } from '@/types'
import { api } from '@/lib/api'
import { buildQueryString } from '@/lib/utils'

interface UseRecordsState {
  records: FinancialRecord[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  loading: boolean
  error: string | null
}

export function useRecords(initialFilters?: Partial<RecordFilters>) {
  const [state, setState] = useState<UseRecordsState>({
    records: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    loading: false,
    error: null,
  })

  const [filters, setFilters] = useState<RecordFilters>({
    page: 1,
    limit: 10,
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    sortOrder: 'desc',
    ...initialFilters,
  })

  const fetchRecords = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const query = buildQueryString({
        page: filters.page,
        limit: filters.limit,
        type: filters.type || undefined,
        category: filters.category || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      })

      const response = await api.get<PaginatedResponse<FinancialRecord>>(
        `/records${query}`
      )

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          records: response.data!.items,
          pagination: response.data!.meta,
        }))
      } else {
        setState((prev) => ({
          ...prev,
          error: response.message || 'Failed to fetch records',
        }))
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch records',
      }))
    } finally {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [filters])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const createRecord = useCallback(
    async (data: Omit<FinancialRecord, '_id' | 'createdAt' | 'createdBy'>) => {
      try {
        const response = await api.post<FinancialRecord>('/records', data)
        if (response.success) {
          await fetchRecords()
          return { success: true }
        }
        return { success: false, message: response.message || 'Failed to create record' }
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to create record',
        }
      }
    },
    [fetchRecords]
  )

  const updateRecord = useCallback(
    async (id: string, data: Partial<FinancialRecord>) => {
      try {
        const response = await api.patch<FinancialRecord>(`/records/${id}`, data)
        if (response.success) {
          await fetchRecords()
          return { success: true }
        }
        return { success: false, message: response.message || 'Failed to update record' }
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to update record',
        }
      }
    },
    [fetchRecords]
  )

  const deleteRecord = useCallback(
    async (id: string) => {
      try {
        const response = await api.delete(`/records/${id}`)
        if (response.success) {
          await fetchRecords()
          return { success: true }
        }
        return { success: false, message: response.message || 'Failed to delete record' }
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to delete record',
        }
      }
    },
    [fetchRecords]
  )

  const updateFilters = useCallback((newFilters: Partial<RecordFilters>) => {
    setFilters((prev) => {
      const merged = { ...prev, ...newFilters }
      const keys = Object.keys(newFilters)
      const onlyPage =
        keys.length === 1 && keys[0] === 'page' && newFilters.page !== undefined
      if (!onlyPage) {
        merged.page = newFilters.page ?? 1
      }
      return merged
    })
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      type: '',
      category: '',
      startDate: '',
      endDate: '',
      sortBy: 'date',
      sortOrder: 'desc',
    })
  }, [])

  return {
    ...state,
    filters,
    updateFilters,
    clearFilters,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
  }
}
