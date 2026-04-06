'use client'

import { useState, useEffect } from 'react'
import { User, UserRole, UserStatus } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowRight } from 'lucide-react'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { role: UserRole; status: UserStatus }) => Promise<{
    success: boolean
    message?: string
  }>
  user?: User
  loading?: boolean
}

export function UserModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  loading = false,
}: UserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer' as UserRole,
    status: 'active' as UserStatus,
  })
  const [error, setError] = useState('')

  const fieldLabelStyle = {
    marginBottom: '8px',
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: 600,
    color: '#6B6960',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  }

  const inputReadonlyStyle = {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #D4D2CB',
    backgroundColor: '#EEEDEA',
    paddingBottom: '10px',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: '#6B6960',
    outline: 'none',
  } as const

  const selectStyle = {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #D4D2CB',
    backgroundColor: 'transparent',
    paddingBottom: '10px',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: '#0F0F0E',
    outline: 'none',
    transition: 'border-color 150ms',
  } as const

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      })
    }
    setError('')
  }, [user, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = await onSubmit({
      role: formData.role,
      status: formData.status,
    })
    if (!result.success) {
      setError(result.message || 'Update failed')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent style={{ maxWidth: '480px', gap: '0', border: '1px solid #D4D2CB', backgroundColor: '#F5F4F0', padding: '32px', borderRadius: '8px', maxHeight: '90vh', overflowY: 'auto' }}>
        <DialogHeader style={{ border: 'none', padding: '0' }}>
          <DialogTitle style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 700, color: '#0F0F0E' }}>
            Edit User
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={fieldLabelStyle}>Name</label>
            <input readOnly value={formData.name} style={inputReadonlyStyle} />
          </div>
          <div>
            <label style={fieldLabelStyle}>Email</label>
            <input readOnly value={formData.email} style={inputReadonlyStyle} />
          </div>
          <div>
            <label style={fieldLabelStyle} htmlFor="um-role">
              Role
            </label>
            <select
              id="um-role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              disabled={loading}
              style={selectStyle}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#0F0F0E' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#D4D2CB' }}
            >
              <option value="viewer">Viewer</option>
              <option value="analyst">Analyst</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label style={fieldLabelStyle} htmlFor="um-status">
              Status
            </label>
            <select
              id="um-status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as UserStatus })
              }
              disabled={loading}
              style={selectStyle}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#0F0F0E' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#D4D2CB' }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {error ? <p style={{ fontSize: '13px', color: '#C84B31' }}>{error}</p> : null}

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              width: '100%',
              border: '1px solid #D4D2CB',
              backgroundColor: 'transparent',
              padding: '10px 0',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 500,
              color: '#0F0F0E',
              transition: 'background-color 150ms',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#EEEDEA' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '2px',
              backgroundColor: '#0F0F0E',
              padding: '14px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#F5F4F0',
              transition: 'background-color 150ms',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#2a2a28' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0F0F0E' }}
          >
            <span>Save</span>
            {loading ? (
              <span style={{
                display: 'inline-block',
                height: '16px',
                width: '16px',
                borderRadius: '50%',
                border: '2px solid #F5F4F0',
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite',
              }} />
            ) : (
              <ArrowRight style={{ height: '16px', width: '16px', strokeWidth: 2 }} strokeWidth={2} />
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
