'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'

const ROLES = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'admin', label: 'Admin' },
] as const

export default function RegisterPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'viewer' as (typeof ROLES)[number]['value'],
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => {
      router.push('/login')
    }, 2000)
    return () => clearTimeout(t)
  }, [success, router])

  if (authLoading) {
    return <div style={{ minHeight: '100vh', background: '#F5F4F0' }} aria-hidden />
  }

  if (user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      if (response.success) {
        setSuccess(true)
      } else {
        setError(response.message || 'Registration failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .register-right-panel {
            display: none !important;
          }
          .register-left-panel {
            grid-column: 1 / -1 !important;
          }
        }
      `}</style>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* LEFT PANEL - FORM */}
        <div
          className="register-left-panel"
          style={{
            background: '#F5F4F0',
            color: '#0F0F0E',
            padding: '60px 48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {/* LEDGER Logo */}
          <span
            style={{
              fontFamily: 'Syne',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.3em',
              color: '#1A6B4A',
              position: 'absolute',
              top: '32px',
              left: '48px',
            }}
          >
            LEDGER
          </span>

          <div style={{ maxWidth: '400px', width: '100%' }}>
            {/* Heading */}
            <h1
              style={{
                fontFamily: 'Syne',
                fontSize: '48px',
                fontWeight: 800,
                color: '#0F0F0E',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                marginBottom: '8px',
              }}
            >
              Join us.
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontFamily: 'Manrope',
                fontSize: '14px',
                color: '#6B6960',
                marginBottom: '40px',
              }}
            >
              Create your account
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Full Name Field */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="name"
                  style={{
                    display: 'block',
                    fontFamily: 'Manrope',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#6B6960',
                    marginBottom: '6px',
                  }}
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading || success}
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #D4D2CB',
                    padding: '8px 0',
                    fontSize: '14px',
                    fontFamily: 'Manrope',
                    color: '#0F0F0E',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Email Field */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    fontFamily: 'Manrope',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#6B6960',
                    marginBottom: '6px',
                  }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading || success}
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #D4D2CB',
                    padding: '8px 0',
                    fontSize: '14px',
                    fontFamily: 'Manrope',
                    color: '#0F0F0E',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Role Field */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="role"
                  style={{
                    display: 'block',
                    fontFamily: 'Manrope',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#6B6960',
                    marginBottom: '6px',
                  }}
                >
                  Role
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as (typeof ROLES)[number]['value'],
                      })
                    }
                    disabled={loading || success}
                    style={{
                      display: 'block',
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid #D4D2CB',
                      padding: '8px 0',
                      fontSize: '14px',
                      fontFamily: 'Manrope',
                      color: '#0F0F0E',
                      outline: 'none',
                      appearance: 'none',
                      paddingRight: '24px',
                    }}
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    style={{
                      pointerEvents: 'none',
                      position: 'absolute',
                      right: '0',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6B6960',
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="password"
                  style={{
                    display: 'block',
                    fontFamily: 'Manrope',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#6B6960',
                    marginBottom: '6px',
                  }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading || success}
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #D4D2CB',
                    padding: '8px 0',
                    fontSize: '14px',
                    fontFamily: 'Manrope',
                    color: '#0F0F0E',
                    outline: 'none',
                  }}
                />
                <p
                  style={{
                    marginTop: '6px',
                    fontSize: '11px',
                    color: '#6B6960',
                    fontFamily: 'Manrope',
                  }}
                >
                  At least 8 characters
                </p>
              </div>

              {/* Confirm Password Field */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="confirm"
                  style={{
                    display: 'block',
                    fontFamily: 'Manrope',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#6B6960',
                    marginBottom: '6px',
                  }}
                >
                  Confirm Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  disabled={loading || success}
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #D4D2CB',
                    padding: '8px 0',
                    fontSize: '14px',
                    fontFamily: 'Manrope',
                    color: '#0F0F0E',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Success Message */}
              {success && (
                <p
                  style={{
                    fontSize: '13px',
                    color: '#1A6B4A',
                    marginBottom: '24px',
                  }}
                >
                  Account created! Redirecting to login...
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                style={{
                  width: '100%',
                  background: '#0F0F0E',
                  color: '#F5F4F0',
                  border: 'none',
                  padding: '14px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: loading || success ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px',
                  borderRadius: '2px',
                  opacity: loading || success ? 0.5 : 1,
                  fontFamily: 'Manrope',
                }}
              >
                <span>Create Account</span>
                {loading ? (
                  <span
                    style={{
                      display: 'inline-block',
                      height: '16px',
                      width: '16px',
                      animation: 'spin 0.8s linear infinite',
                      borderRadius: '50%',
                      border: '2px solid #F5F4F0',
                      borderTopColor: 'transparent',
                    }}
                    aria-hidden
                  />
                ) : (
                  <ArrowRight size={16} strokeWidth={2} />
                )}
              </button>

              {/* Error Message */}
              {error && (
                <p
                  style={{
                    fontSize: '13px',
                    color: '#C84B31',
                    marginTop: '16px',
                  }}
                >
                  {error}
                </p>
              )}

              {/* Sign In Link */}
              <p
                style={{
                  fontSize: '14px',
                  color: '#6B6960',
                  fontFamily: 'Manrope',
                  marginTop: '24px',
                }}
              >
                Already have an account?{' '}
                <Link
                  href="/login"
                  style={{
                    fontWeight: 500,
                    color: '#0F0F0E',
                    textDecoration: 'underline',
                  }}
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL - DECORATIVE */}
        <div
          className="register-right-panel"
          style={{
            background: '#0F0F0E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ghost Text Background */}
          <span
            style={{
              position: 'absolute',
              fontFamily: 'Syne',
              fontWeight: 800,
              fontSize: '160px',
              color: '#F5F4F0',
              opacity: 0.04,
              letterSpacing: '-0.04em',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
            aria-hidden
          >
            JOIN US
          </span>

          {/* Main Vertical Text */}
          <span
            style={{
              fontFamily: 'Syne',
              fontWeight: 800,
              fontSize: '80px',
              color: '#F5F4F0',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              letterSpacing: '-0.02em',
              opacity: 0.9,
              lineHeight: 1,
            }}
            aria-hidden
          >
            JOIN US
          </span>

          {/* Green Dot */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              width: '8px',
              height: '8px',
              background: '#1A6B4A',
              borderRadius: '50%',
            }}
            aria-hidden
          />

          {/* Version Text */}
          <span
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              fontFamily: 'DM Mono',
              fontSize: '11px',
              color: '#6B6960',
            }}
          >
            Finance Dashboard v1.0
          </span>
        </div>
      </div>
    </>
  )
}
