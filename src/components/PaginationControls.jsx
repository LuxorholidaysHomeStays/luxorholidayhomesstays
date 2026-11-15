import React from 'react'

export default function PaginationControls({ page, pageSize, total, hasMore, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil((Number(total) || 0) / pageSize))
  if (totalPages <= 1) return null
  return (
    <nav className="flex items-center justify-between gap-4 mt-6" aria-label="Pagination">
      <p className="text-sm text-gray-500">Page {page} of {totalPages} · {total} total</p>
      <div className="flex gap-2">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Previous</button>
        <button type="button" disabled={!hasMore} onClick={() => onPageChange(page + 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Next</button>
      </div>
    </nav>
  )
}
