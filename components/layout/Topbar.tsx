'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/records': 'Records', 
  '/users': 'Users',
  '/profile': 'Profile',
}

export default function Topbar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const title = pageTitles[pathname] || 'Dashboard'
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'

  return (
    <div style={{
      height: '52px',
      minHeight: '52px',
      background: '#F5F4F0',
      borderBottom: '1px solid #D4D2CB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px'
    }}>
      <span style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: '16px',
        fontWeight: 700,
        color: '#0F0F0E'
      }}>{title}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#0F0F0E',
          color: '#F5F4F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          fontWeight: 500
        }}>{initials}</div>
      </div>
    </div>
  )
}
