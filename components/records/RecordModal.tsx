'use client'

import { useState, useEffect } from 'react'
import { FinancialRecord, RecordType } from '@/types'
import { useToast } from '@/components/ui/toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowRight } from 'lucide-react'

const SUGGESTIONS = [
  'Salary',
  'Rent',
  'Food',
  'Utilities',
  'Transport',
  'Healthcare',
  'Entertainment',
  'Freelance',
  'Investment',
  'Other',
]

interface RecordModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Record<string, unknown>) => Promise<{ success: boolean; message?: string }>
  record?: FinancialRecord
  loading?: boolean
}

const fieldLabel = 'ds-label mb-2 block'
const inputClass = 'w-full border-0 border-b border-[#D4D2CB] bg-transparent pb-2.5 font-body text-sm text-[#0F0F0E] outline-none transition-base focus:border-[#0F0F0E]'

export function RecordModal({
  isOpen,
  onClose,
  onSubmit,
  record,
  loading = false,
}: RecordModalProps) {
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense' as RecordType,
    category: '',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (record) {
      setFormData({
        amount: String(Math.abs(record.amount)),
        type: record.type,
        category: record.category,
        date: record.date.slice(0, 10),
        notes: record.notes || '',
      })
    } else {
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().slice(0, 10),
        notes: '',
      })
    }
    setError('')
  }, [record, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.amount || !formData.category.trim()) {
      setError('Please fill in all required fields')
      return
    }

    const raw = parseFloat(formData.amount)
    if (Number.isNaN(raw) || raw <= 0) {
      setError('Please enter a valid positive amount')
      return
    }

    const amount = Math.abs(raw)
    const isoDate = new Date(`${formData.date}T12:00:00.000Z`).toISOString()

    const data = {
      amount,
      type: formData.type,
      category: formData.category.trim(),
      date: isoDate,
      notes: formData.notes.trim() || undefined,
    }

    const result = await onSubmit(data)

    if (result.success) {
      addToast(record ? 'Record updated' : 'Record created', 'success')
      onClose()
    } else {
      setError(result.message || 'Something went wrong')
      addToast(result.message || 'Something went wrong', 'error')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[480px] gap-0 border border-[#D4D2CB] bg-[#F5F4F0] p-8 dark:border-[#242422] dark:bg-[#0C0C0B]" style={{ background: '#F5F4F0', borderColor: '#D4D2CB', maxHeight: '90vh', overflowY: 'auto' }}>
        <DialogHeader className="border-0 p-0" style={{ border: 'none', padding: 0 }}>
          <DialogTitle className="font-syne text-xl font-bold text-[#0F0F0E] dark:text-[#F0EFE9]" style={{ color: '#0F0F0E', fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700 }}>
            {record ? 'Edit Record' : 'Create Record'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B6960', marginBottom: '12px', display: 'block' }}>Type</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                disabled={loading}
                style={{
                  flex: 1,
                  borderRadius: '2px 0 0 2px',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: formData.type === 'income' ? '2px solid #1A6B4A' : '1px solid #D4D2CB',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  background: formData.type === 'income' ? '#E8F5EF' : '#EEEDEA',
                  color: formData.type === 'income' ? '#1A6B4A' : '#6B6960',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                disabled={loading}
                style={{
                  flex: 1,
                  borderRadius: '0 2px 2px 0',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: formData.type === 'expense' ? '2px solid #C84B31' : '1px solid #D4D2CB',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  background: formData.type === 'expense' ? '#FBF0EE' : '#EEEDEA',
                  color: formData.type === 'expense' ? '#C84B31' : '#6B6960',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                Expense
              </button>
            </div>
          </div>

          <div>
            <label style={{fontFamily: 'Manrope, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B6960', marginBottom: '12px', display: 'block' }} htmlFor="rec-cat">
              Category
            </label>
            <input
              id="rec-cat"
              list="category-suggestions"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              disabled={loading}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid #D4D2CB',
                color: '#0F0F0E',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '14px',
                outline: 'none',
                marginBottom: '20px'
              }}
            />
            <datalist id="category-suggestions">
              {SUGGESTIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label style={{fontFamily: 'Manrope, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B6960', marginBottom: '12px', display: 'block' }} htmlFor="rec-amt">
              Amount
            </label>
            <input
              id="rec-amt"
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              disabled={loading}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid #D4D2CB',
                color: '#0F0F0E',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontFamily: 'DM Mono, monospace',
                fontSize: '14px',
                outline: 'none',
                marginBottom: '20px'
              }}
            />
          </div>

          <div>
            <label style={{fontFamily: 'Manrope, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B6960', marginBottom: '12px', display: 'block' }} htmlFor="rec-date">
              Date
            </label>
            <input
              id="rec-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              disabled={loading}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid #D4D2CB',
                color: '#0F0F0E',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontFamily: 'DM Mono, monospace',
                fontSize: '14px',
                outline: 'none',
                marginBottom: '20px'
              }}
            />
          </div>

          <div>
            <label style={{fontFamily: 'Manrope, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B6960', marginBottom: '12px', display: 'block' }} htmlFor="rec-notes">
              Notes
            </label>
            <textarea
              id="rec-notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={loading}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid #D4D2CB',
                color: '#0F0F0E',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '14px',
                outline: 'none',
                marginBottom: '20px',
                resize: 'none'
              }}
            />
          </div>

          {error ? <p style={{fontSize: '13px', color: '#C84B31'}}>{error}</p> : null}

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px solid #D4D2CB',
              color: '#0F0F0E',
              paddingTop: '12px',
              paddingBottom: '12px',
              paddingLeft: '16px',
              paddingRight: '16px',
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: '2px',
              marginBottom: '8px'
            }}
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
              background: '#0F0F0E',
              border: 'none',
              paddingTop: '14px',
              paddingBottom: '14px',
              paddingLeft: '20px',
              paddingRight: '20px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#F5F4F0',
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif',
              transition: 'opacity 150ms ease'
            }}
          >
            <span>{record ? 'Save changes' : 'Create record'}</span>
            {loading ? (
              <span style={{display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #F5F4F0', borderTopColor: 'transparent', animation: 'spin 1s linear infinite'}} />
            ) : (
              <ArrowRight size={16} strokeWidth={2} />
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
