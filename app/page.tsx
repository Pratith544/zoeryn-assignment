'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard')
      } else {
        router.replace('/login')
      }
    }
  }, [user, loading, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F4F0] dark:bg-[#0C0C0B]">
      <p
        className="font-syne text-[13px] font-extrabold uppercase tracking-[0.3em] text-[#1A6B4A]"
        style={{ letterSpacing: '0.3em' }}
      >
        LEDGER
      </p>
    </div>
  )
}
