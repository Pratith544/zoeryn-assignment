'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface DashboardNavContextType {
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  openMobile: () => void
  closeMobile: () => void
}

const DashboardNavContext = createContext<DashboardNavContextType | undefined>(undefined)

export function DashboardNavProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <DashboardNavContext.Provider
      value={{ mobileOpen, setMobileOpen, openMobile, closeMobile }}
    >
      {children}
    </DashboardNavContext.Provider>
  )
}

export function useDashboardNav() {
  const ctx = useContext(DashboardNavContext)
  if (!ctx) {
    throw new Error('useDashboardNav must be used within DashboardNavProvider')
  }
  return ctx
}
