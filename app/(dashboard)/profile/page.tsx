'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageWrapper } from '@/components/shared/PageWrapper'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils'
import { getInitials } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'
import { ArrowRight } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)

  if (!user) {
    return null
  }

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

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 8) {
      addToast('New password must be at least 8 characters', 'error')
      return
    }
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error')
      return
    }
    setSaving(true)
    try {
      addToast(
        'Password changes are not available yet. This requires a dedicated API endpoint.',
        'error'
      )
    } finally {
      setSaving(false)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <PageWrapper>
      <div>
        <PageHeader title="Profile" />

        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ border: '1px solid #D4D2CB', backgroundColor: '#EEEDEA', padding: '28px' }}>
            <div style={{ display: 'flex', height: '56px', width: '56px', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#0F0F0E', fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 500, color: '#F5F4F0' }}>
              {getInitials(user.name)}
            </div>
            <h2 style={{ marginTop: '20px', fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', color: '#0F0F0E' }}>
              {user.name}
            </h2>
            <p style={{ marginTop: '4px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#6B6960' }}>
              {user.email}
            </p>
            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
            </div>
            <p style={{ marginTop: '32px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#6B6960' }}>
              Member since {formatDate(user.createdAt, 'long')}
            </p>
          </div>

          <div style={{ border: '1px solid #D4D2CB', backgroundColor: '#EEEDEA', padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700, color: '#0F0F0E' }}>
              Change Password
            </h3>
            <form onSubmit={handlePasswordSave} style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={fieldLabelStyle} htmlFor="old-pw">
                  Old password
                </label>
                <input
                  id="old-pw"
                  type="password"
                  autoComplete="current-password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#0F0F0E' }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#D4D2CB' }}
                />
              </div>
              <div>
                <label style={fieldLabelStyle} htmlFor="new-pw">
                  New password
                </label>
                <input
                  id="new-pw"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#0F0F0E' }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#D4D2CB' }}
                />
              </div>
              <div>
                <label style={fieldLabelStyle} htmlFor="confirm-pw">
                  Confirm new password
                </label>
                <input
                  id="confirm-pw"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#0F0F0E' }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#D4D2CB' }}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '2px',
                  backgroundColor: saving ? '#0F0F0E' : '#0F0F0E',
                  padding: '14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#F5F4F0',
                  transition: 'background-color 150ms',
                  border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.5 : 1,
                }}
                onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#2a2a28' }}
                onMouseLeave={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#0F0F0E' }}
              >
                <span>Save</span>
                {saving ? (
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
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
