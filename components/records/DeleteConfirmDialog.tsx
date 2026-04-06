'use client'

import { FinancialRecord } from '@/types'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { formatCurrency } from '@/lib/utils'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  record: FinancialRecord | null
  loading?: boolean
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  record,
  loading = false,
}: DeleteConfirmDialogProps) {
  if (!record) return null

  const isIncome = record.type === 'income'

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="border-[#D4D2CB] bg-[#F5F4F0] dark:border-[#242422] dark:bg-[#0C0C0B]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-syne text-lg font-bold text-[#0F0F0E] dark:text-[#F0EFE9]">
            Delete Record
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-sm text-[#6B6960]">
            Are you sure you want to delete this record? This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="border border-[#D4D2CB] bg-[#EEEDEA] p-3 dark:border-[#242422] dark:bg-[#141413]">
          <p className="font-body text-sm text-[#0F0F0E] dark:text-[#F0EFE9]">
            <span className="font-semibold">{record.category}</span>
            <span className="text-[#6B6960]"> · {record.type}</span>
          </p>
          <p
            className={`mt-1 font-mono text-sm tabular-nums ${
              isIncome ? 'text-[#1A6B4A]' : 'text-[#C84B31]'
            }`}
          >
            {isIncome ? '+' : '−'}
            {formatCurrency(Math.abs(record.amount))}
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            className="border-[#D4D2CB] bg-transparent dark:border-[#242422]"
          >
            Cancel
          </AlertDialogCancel>
          <button
            type="button"
            disabled={loading}
            onClick={() => void onConfirm()}
            className="inline-flex items-center justify-center rounded-[2px] bg-[#C84B31] px-4 py-2 text-sm font-medium text-white transition-base hover:opacity-90 disabled:opacity-40"
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
