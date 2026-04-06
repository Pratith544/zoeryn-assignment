'use client'

import { useState } from 'react'
import { useRecords } from '@/hooks/useRecords'
import { useAuth } from '@/context/AuthContext'
import { FinancialRecord } from '@/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { RecordFiltersComponent } from '@/components/records/RecordFilters'
import { RecordsTable } from '@/components/records/RecordsTable'
import { RecordModal } from '@/components/records/RecordModal'
import { DeleteConfirmDialog } from '@/components/records/DeleteConfirmDialog'
import { PageWrapper } from '@/components/shared/PageWrapper'
import { Plus } from 'lucide-react'

export default function RecordsPage() {
  const { isRole } = useAuth()
  const {
    records,
    loading,
    filters,
    pagination,
    updateFilters,
    clearFilters,
    createRecord,
    updateRecord,
    deleteRecord,
  } = useRecords()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | null>(null)
  const [deleteRecord_, setDeleteRecord] = useState<FinancialRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canEdit = isRole('analyst', 'admin')
  const canDelete = isRole('admin')

  const handleOpenModal = (record?: FinancialRecord) => {
    setSelectedRecord(record || null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRecord(null)
  }

  const handleSubmitModal = async (data: Record<string, unknown>) => {
    setIsSubmitting(true)
    try {
      let result
      if (selectedRecord) {
        result = await updateRecord(selectedRecord._id, data as Partial<FinancialRecord>)
      } else {
        result = await createRecord(data as Parameters<typeof createRecord>[0])
      }
      return result
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (record: FinancialRecord) => {
    setDeleteRecord(record)
  }

  const handleConfirmDelete = async () => {
    if (!deleteRecord_) return
    setIsDeleting(true)
    try {
      const result = await deleteRecord(deleteRecord_._id)
      if (result.success) {
        setDeleteRecord(null)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const isFiltered = !!(
    filters.type ||
    filters.category ||
    filters.startDate ||
    filters.endDate ||
    filters.sortBy !== 'date' ||
    filters.sortOrder !== 'desc'
  )

  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const end = Math.min(pagination.page * pagination.limit, pagination.total)

  return (
    <PageWrapper>
      <div>
        <PageHeader
          title="Records"
          action={
            canEdit ? (
              <button
                type="button"
                onClick={() => handleOpenModal()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '2px',
                  backgroundColor: '#0F0F0E',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#F5F4F0',
                  transition: 'background-color 150ms',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a2a28' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0F0F0E' }}
              >
                <Plus style={{ height: '16px', width: '16px', strokeWidth: 2 }} strokeWidth={2} />
                New Record
              </button>
            ) : null
          }
        />

        <RecordFiltersComponent
          filters={filters}
          onFiltersChange={updateFilters}
          onClear={clearFilters}
          isFiltered={isFiltered}
        />

        <RecordsTable
          records={records}
          loading={loading}
          onEdit={handleOpenModal}
          onDelete={handleDeleteClick}
          canEdit={canEdit}
          canDelete={canDelete}
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[12px] text-[#6B6960] dark:text-[#8A8880]">
            Showing {start}–{end} of {pagination.total} records
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateFilters({ page: pagination.page - 1 })}
              disabled={pagination.page <= 1}
              className="border border-[#D4D2CB] bg-transparent px-4 py-1.5 font-body text-[12px] text-[#0F0F0E] transition-base hover:bg-[#EEEDEA] disabled:opacity-40 dark:border-[#242422] dark:text-[#F0EFE9] dark:hover:bg-[#141413]"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => updateFilters({ page: pagination.page + 1 })}
              disabled={pagination.page >= pagination.totalPages}
              className="border border-[#D4D2CB] bg-transparent px-4 py-1.5 font-body text-[12px] text-[#0F0F0E] transition-base hover:bg-[#EEEDEA] disabled:opacity-40 dark:border-[#242422] dark:text-[#F0EFE9] dark:hover:bg-[#141413]"
            >
              Next
            </button>
          </div>
        </div>

        <RecordModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
          record={selectedRecord || undefined}
          loading={isSubmitting}
        />

        <DeleteConfirmDialog
          isOpen={!!deleteRecord_}
          onClose={() => setDeleteRecord(null)}
          onConfirm={handleConfirmDelete}
          record={deleteRecord_}
          loading={isDeleting}
        />
      </div>
    </PageWrapper>
  )
}
