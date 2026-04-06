'use client'

import { useState, useCallback } from 'react'
import { User, PaginatedResponse } from '@/types'
import { api } from '@/lib/api'
import { buildQueryString } from '@/lib/utils'

interface UseUsersState {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  loading: boolean
  error: string | null
}

export function useUsers() {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    loading: false,
    error: null,
  })

  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const fetchUsers = useCallback(async (pageNum?: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const query = buildQueryString({
        page: pageNum || page,
        limit,
      })

      const response = await api.get<PaginatedResponse<User>>(`/users${query}`)

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          users: response.data!.items,
          pagination: response.data!.meta,
        }))
        if (pageNum) {
          setPage(pageNum)
        }
      } else {
        setState((prev) => ({ ...prev, error: response.message || 'Failed to fetch users' }))
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      }))
    } finally {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [page, limit])

  const updateUser = useCallback(
    async (id: string, data: Partial<User>) => {
      try {
        const response = await api.patch<User>(`/users/${id}`, data)
        if (response.success) {
          await fetchUsers()
          return { success: true }
        }
        return { success: false, message: response.message || 'Failed to update user' }
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to update user',
        }
      }
    },
    [fetchUsers]
  )

  return {
    ...state,
    page,
    limit,
    fetchUsers,
    updateUser,
    setPage,
  }
}
