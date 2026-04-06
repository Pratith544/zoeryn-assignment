'use client'

import { User } from '@/types'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatDate } from '@/lib/utils'
import { Edit2, Users } from 'lucide-react'

interface UsersTableProps {
  users: User[]
  loading: boolean
  onEdit: (user: User) => void
}

export function UsersTable({ users, loading, onEdit }: UsersTableProps) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 0' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: '48px',
              backgroundColor: '#EEEDEA',
              borderRadius: '4px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No users found"
        description="Add a user to get started"
      />
    )
  }

  const thStyle = {
    padding: '10px 16px',
    textAlign: 'left' as const,
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.1em',
    color: '#6B6960',
    textTransform: 'uppercase' as const,
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #D4D2CB' }}>
            <th style={thStyle}>Name</th>
            <th style={{ ...thStyle, width: '120px' }}>Role</th>
            <th style={{ ...thStyle, width: '100px' }}>Status</th>
            <th style={{ ...thStyle, width: '120px' }}>Joined</th>
            <th style={{ ...thStyle, width: '72px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u._id}
              style={{
                borderBottom: '1px solid #D4D2CB',
                height: '48px',
                transition: 'background-color 150ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EEEDEA'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <td style={{ padding: '0 16px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: '#0F0F0E', margin: '0' }}>
                  {u.name}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#6B6960', margin: '0' }}>{u.email}</p>
              </td>
              <td style={{ padding: '0 16px' }}>
                <RoleBadge role={u.role} />
              </td>
              <td style={{ padding: '0 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#0F0F0E' }}>
                  <span
                    style={{
                      height: '8px',
                      width: '8px',
                      borderRadius: '50%',
                      backgroundColor: u.status === 'active' ? '#1A6B4A' : '#6B6960',
                    }}
                  />
                  {u.status === 'active' ? 'Active' : 'Inactive'}
                </div>
              </td>
              <td style={{ padding: '0 16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#6B6960' }}>
                {formatDate(u.createdAt, 'short')}
              </td>
              <td style={{ padding: '0 16px' }}>
                <div 
                  style={{ display: 'flex', justifyContent: 'flex-end', opacity: 1, transition: 'opacity 150ms ease-in-out' }}
                >
                  <button
                    type="button"
                    onClick={() => onEdit(u)}
                    style={{
                      padding: '4px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#6B6960',
                      cursor: 'pointer',
                      transition: 'color 150ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#0F0F0E' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#6B6960' }}
                    aria-label="Edit user"
                  >
                    <Edit2 style={{ height: '14px', width: '14px', strokeWidth: 2 }} strokeWidth={2} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
