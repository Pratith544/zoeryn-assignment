'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { UserRole } from '@/types'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    email: string
    password: string
    role: UserRole
  }) => Promise<{ success: boolean; message?: string }>
  loading?: boolean
}

export function AddUserModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: AddUserModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('viewer')
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

  const inputStyle = {
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

  const reset = () => {
    setName('')
    setEmail('')
    setPassword('')
    setRole('viewer')
    setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password) {
      setError('All fields are required')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    const result = await onSubmit({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    })
    if (result.success) {
      handleClose()
    } else {
      setError(result.message || 'Failed to create user')
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      <DialogContent style={{ maxWidth: '480px', gap: '0', border: '1px solid #D4D2CB', backgroundColor: '#F5F4F0', padding: '32px', borderRadius: '8px', maxHeight: '90vh', overflowY: 'auto' }}>
        <DialogHeader style={{ border: 'none', padding: '0' }}>
          <DialogTitle style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 700, color: '#0F0F0E' }}>
            Add User
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={fieldLabelStyle} htmlFor="au-name">
              Name
            </label>
            <input
              id="au-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#0F0F0E' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#D4D2CB' }}
            />
          </div>
          <div>
            <label style={fieldLabelStyle} htmlFor="au-email">
              Email
            </label>
            <input
              id="au-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#0F0F0E' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#D4D2CB' }}
            />
          </div>
          <div>
            <label style={fieldLabelStyle} htmlFor="au-role">
              Role
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="au-role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                disabled={loading}
                style={{ ...inputStyle, paddingRight: '32px' }}
                onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#0F0F0E' }}
                onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#D4D2CB' }}
              >
                <option value="viewer">Viewer</option>
                <option value="analyst">Analyst</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDown style={{ pointerEvents: 'none', position: 'absolute', right: '0', top: '50%', height: '16px', width: '16px', transform: 'translateY(-50%)', color: '#6B6960' }} />
            </div>
          </div>
          <div>
            <label style={fieldLabelStyle} htmlFor="au-pass">
              Password
            </label>
            <input
              id="au-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#0F0F0E' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#D4D2CB' }}
            />
            <p style={{ marginTop: '4px', fontSize: '11px', color: '#6B6960' }}>At least 8 characters</p>
          </div>

          {error ? <p style={{ fontSize: '13px', color: '#C84B31' }}>{error}</p> : null}

          <button
            type="button"
            onClick={handleClose}
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
            <span>Create user</span>
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
