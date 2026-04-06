'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#F5F4F0',
        color: '#0F0F0E',
        fontFamily: 'Manrope, sans-serif',
        fontSize: '14px'
      }}>
        Loading...
      </div>
    )
  }

  if (!user) return null

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      background: '#F5F4F0',
      overflow: 'hidden'
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#F5F4F0'
      }}>
        <Topbar />
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px',
          background: '#F5F4F0'
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}
