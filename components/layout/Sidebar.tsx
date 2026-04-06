'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { LayoutDashboard, Receipt, Users, User, LogOut } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/records', label: 'Records', icon: Receipt },
    ...(user?.role === 'admin' ? [{ href: '/users', label: 'Users', icon: Users }] : []),
    { href: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <div style={{
      width: '200px',
      minWidth: '200px',
      height: '100vh',
      background: '#F5F4F0',
      borderRight: '1px solid #D4D2CB',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 20px', borderBottom: '1px solid #D4D2CB' }}>
        <span style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '13px',
          fontWeight: 800,
          letterSpacing: '0.3em',
          color: '#1A6B4A'
        }}>LEDGER</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: '8px' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '11px 20px',
                borderLeft: isActive ? '2px solid #1A6B4A' : '2px solid transparent',
                background: isActive ? '#EEEDEA' : 'transparent',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}>
                <Icon size={14} color={isActive ? '#0F0F0E' : '#6B6960'} />
                <span style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#0F0F0E' : '#6B6960'
                }}>{label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User info at bottom */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #D4D2CB' }}>
        <div style={{ 
          fontFamily: 'Manrope, sans-serif', 
          fontSize: '12px', 
          fontWeight: 600, 
          color: '#0F0F0E',
          marginBottom: '4px'
        }}>{user?.name}</div>
        <div style={{ 
          fontFamily: 'Manrope, sans-serif',
          fontSize: '11px', 
          color: '#6B6960',
          textTransform: 'capitalize',
          marginBottom: '10px'
        }}>{user?.role}</div>
        <button onClick={logout} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Manrope, sans-serif',
          fontSize: '12px',
          color: '#6B6960',
          padding: 0
        }}>
          <LogOut size={12} />
          Sign out
        </button>
      </div>
    </div>
  )
}
