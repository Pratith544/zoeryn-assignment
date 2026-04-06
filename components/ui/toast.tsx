'use client'

import * as React from 'react'
import { createContext, useContext, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, variant: ToastVariant, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 4000) => {
      const id = Date.now().toString()
      setToasts((prev) => [...prev, { id, message, variant }])

      setTimeout(() => {
        removeToast(id)
      }, duration)
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const variants = {
    success: {
      bg: 'bg-income/10',
      border: 'border-l-4 border-income',
      text: 'text-income',
    },
    error: {
      bg: 'bg-expense/10',
      border: 'border-l-4 border-expense',
      text: 'text-expense',
    },
    info: {
      bg: 'bg-amber/10',
      border: 'border-l-4 border-amber',
      text: 'text-amber',
    },
  }

  const variant = variants[toast.variant]

  return (
    <div
      className={cn(
        'animate-in slide-in-from-right-full duration-200 px-4 py-3 rounded-sm border',
        variant.bg,
        variant.border,
        'shadow-sm backdrop-blur-sm'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className={cn('text-sm font-medium', variant.text)}>
          {toast.message}
        </p>
        <button
          onClick={() => onRemove(toast.id)}
          className="mt-0.5 hover:opacity-75 transition-base"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
