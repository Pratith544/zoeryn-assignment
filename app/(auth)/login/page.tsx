'use client'

import { Suspense, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, user, loading: authLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [banner, setBanner] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setBanner(true)
      const t = setTimeout(() => setBanner(false), 5000)
      return () => clearTimeout(t)
    }
  }, [searchParams])

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard')
    }
  }, [authLoading, user, router])

  if (authLoading) {
    return <div style={{ minHeight: '100vh', background: '#F5F4F0' }} aria-hidden />
  }

  if (user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.message || 'Login failed')
    }
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .login-right-panel {
            display: none !important;
          }
          .login-left-panel {
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
          className="login-left-panel"
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
              Welcome back.
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
              Sign in to your dashboard
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Success Banner */}
              {banner && (
                <p
                  style={{
                    fontSize: '14px',
                    color: '#1A6B4A',
                    marginBottom: '24px',
                    fontFamily: 'Manrope',
                  }}
                >
                  Account created! Please sign in.
                </p>
              )}

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                style={{
                  width: '100%',
                  background: '#0F0F0E',
                  color: '#F5F4F0',
                  border: 'none',
                  padding: '14px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px',
                  borderRadius: '2px',
                  opacity: loading || !email || !password ? 0.5 : 1,
                  fontFamily: 'Manrope',
                }}
              >
                <span>Sign in</span>
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

              {/* Register Link */}
              <p
                style={{
                  fontSize: '14px',
                  color: '#6B6960',
                  fontFamily: 'Manrope',
                  marginTop: '24px',
                }}
              >
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  style={{
                    fontWeight: 500,
                    color: '#0F0F0E',
                    textDecoration: 'underline',
                    textDecorationOffset: '4px',
                  }}
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL - DECORATIVE */}
        <div
          className="login-right-panel"
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
            LEDGER
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
            LEDGER
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div style={{ minHeight: '100vh', background: '#F5F4F0' }} />}
    >
      <LoginForm />
    </Suspense>
  )
}
