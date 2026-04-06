'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useUsers } from '@/hooks/useUsers'
import { useToast } from '@/components/ui/toast'
import { User, UserRole } from '@/types'
import { api } from '@/lib/api'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageWrapper } from '@/components/shared/PageWrapper'
import { UsersTable } from '@/components/users/UsersTable'
import { UserModal } from '@/components/users/UserModal'
import { AddUserModal } from '@/components/users/AddUserModal'
import { Lock, Plus } from 'lucide-react'

export default function UsersPage() {
  const { user, isRole } = useAuth()
  const { users, loading, pagination, fetchUsers, updateUser } = useUsers()
  const { addToast } = useToast()

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const canManage = isRole('admin')

  useEffect(() => {
    if (canManage) {
      fetchUsers()
    }
  }, [canManage, fetchUsers])

  // Debug: Log API response
  useEffect(() => {
    fetch('/api/users', { credentials: 'include' })
      .then(r => r.json())
      .then(d => console.log('Users API response:', d))
      .catch(e => console.log('Users API error:', e))
  }, [])

  if (user && !canManage) {
    return (
      <PageWrapper>
        <div style={{ display: 'flex', minHeight: '50vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Lock style={{ marginBottom: '16px', height: '40px', width: '40px', color: '#6B6960', strokeWidth: '1.5' }} strokeWidth={1.5} />
          <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0F0F0E' }}>
            Access Restricted
          </h1>
          <p style={{ marginTop: '8px', maxWidth: '448px', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#6B6960' }}>
            This page is only accessible to administrators.
          </p>
          <Link
            href="/dashboard"
            style={{
              marginTop: '32px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #D4D2CB',
              backgroundColor: 'transparent',
              padding: '10px 20px',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 500,
              color: '#0F0F0E',
              transition: 'background-color 150ms',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#EEEDEA' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            Go to Dashboard
          </Link>
        </div>
      </PageWrapper>
    )
  }

  const handleEdit = (u: User) => {
    setSelectedUser(u)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleSubmit = async (data: { role: User['role']; status: User['status'] }) => {
    if (!selectedUser) {
      return { success: false, message: 'No user selected' }
    }
    setIsUpdating(true)
    try {
      const result = await updateUser(selectedUser._id, data)
      if (result.success) {
        addToast('User updated successfully', 'success')
        handleCloseModal()
        await fetchUsers()
      } else {
        addToast(result.message || 'Failed to update user', 'error')
      }
      return result
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddUser = async (body: {
    name: string
    email: string
    password: string
    role: UserRole
  }) => {
    setIsCreating(true)
    try {
      const res = await api.post<User>('/users', body)
      if (res.success) {
        addToast('User created', 'success')
        await fetchUsers()
        return { success: true }
      }
      return { success: false, message: res.message || 'Failed to create user' }
    } finally {
      setIsCreating(false)
    }
  }

  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const end = Math.min(pagination.page * pagination.limit, pagination.total)

  return (
    <PageWrapper>
      <div>
        <PageHeader
          title="Users"
          action={
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '2px',
                backgroundColor: '#0F0F0E',
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#F5F4F0',
                transition: 'background-color 150ms',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a2a28' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0F0F0E' }}
            >
              <Plus style={{ height: '16px', width: '16px', strokeWidth: 2 }} strokeWidth={2} />
              Add User
            </button>
          }
        />

        <div style={{ marginTop: '32px' }}>
          <UsersTable users={users} loading={loading} onEdit={handleEdit} />
        </div>

        <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#6B6960' }}>
            Showing {start}–{end} of {pagination.total} users
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => fetchUsers(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
              style={{
                border: '1px solid #D4D2CB',
                backgroundColor: 'transparent',
                padding: '6px 16px',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: '#0F0F0E',
                transition: 'background-color 150ms',
                cursor: pagination.page <= 1 || loading ? 'not-allowed' : 'pointer',
                opacity: pagination.page <= 1 || loading ? 0.4 : 1,
              }}
              onMouseEnter={(e) => {
                if (!(pagination.page <= 1 || loading)) {
                  e.currentTarget.style.backgroundColor = '#EEEDEA'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => fetchUsers(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
              style={{
                border: '1px solid #D4D2CB',
                backgroundColor: 'transparent',
                padding: '6px 16px',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: '#0F0F0E',
                transition: 'background-color 150ms',
                cursor: pagination.page >= pagination.totalPages || loading ? 'not-allowed' : 'pointer',
                opacity: pagination.page >= pagination.totalPages || loading ? 0.4 : 1,
              }}
              onMouseEnter={(e) => {
                if (!(pagination.page >= pagination.totalPages || loading)) {
                  e.currentTarget.style.backgroundColor = '#EEEDEA'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              Next
            </button>
          </div>
        </div>

        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          user={selectedUser || undefined}
          loading={isUpdating}
        />

        <AddUserModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleAddUser}
          loading={isCreating}
        />
      </div>
    </PageWrapper>
  )
}
