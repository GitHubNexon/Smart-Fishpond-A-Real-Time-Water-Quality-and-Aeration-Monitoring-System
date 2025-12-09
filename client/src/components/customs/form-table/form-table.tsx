// ============================================
// FILE: form-table.tsx
// ============================================

'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useFormTableLogic } from './form-table.logic';
import { FormTableProps } from './form-table.interface';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function FormTable<T extends Record<string, any>>({
  data,
  columns,
  onEdit,
  onDelete,
  selectable = true,
  emptyMessage = 'No data available',
  tableTitle,
  getRowId,
  pageSize = 10,
}: FormTableProps<T>) {
  const {
    paginatedData,
    currentPage,
    totalPages,
    selectedRowIds,
    toggleRowSelection,
    handleToggleAllCurrentPage,
    allCurrentPageSelected,
    clearSelections,
    handlePageChange,
    startIndex,
    totalItems,
    getSelectedIndices,
  } = useFormTableLogic(data, getRowId, pageSize);

  const handleDeleteSelected = () => {
    const indices = getSelectedIndices();
    onDelete(indices);
    clearSelections();
  };

  const handleEdit = (index: number, row: T) => {
    onEdit(index, row);
  };

  const handleDeleteSingle = (absoluteIndex: number) => {
    onDelete([absoluteIndex]);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="w-full space-y-4">
      <div className="block md:hidden">
        <div className="p-6 text-center bg-amber-50 dark:bg-orange-900/30 border border-orange-300 dark:border-amber-800 rounded-lg">
          <p className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
            ⚠️ Desktop View Recommended
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            This form is best viewed and used on a larger screen for better
            readability and usability.
          </p>
        </div>
      </div>

      <div className="hidden md:block space-y-4">
        {selectable && selectedRowIds.size > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg">
            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {selectedRowIds.size} row(s) selected across all pages
            </span>
            <div className="flex gap-2">
              <button
                onClick={clearSelections}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Selection
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16} />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {data.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              {emptyMessage}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Add a record using the form above
            </p>
          </div>
        ) : (
          <>
            <div className=" border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {tableTitle && (
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                    {tableTitle} ({totalItems})
                  </h4>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-primary ">
                    <tr>
                      {selectable && (
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={allCurrentPageSelected}
                            onChange={handleToggleAllCurrentPage}
                            className="w-4 h-4 cursor-pointer"
                            title="Select all on this page"
                          />
                        </th>
                      )}
                      {columns.map((col) => (
                        <th
                          key={String(col.key)}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-800 dark:text-white uppercase tracking-wider"
                        >
                          {col.label}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-800 dark:text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedData.map((row, relativeIndex) => {
                      const absoluteIndex = startIndex + relativeIndex;
                      const rowId = getRowId(row, absoluteIndex);
                      const isSelected = selectedRowIds.has(rowId);

                      return (
                        <tr
                          key={rowId}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-900/20'
                              : ''
                          }`}
                        >
                          {selectable && (
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleRowSelection(rowId)}
                                className="w-4 h-4 cursor-pointer"
                              />
                            </td>
                          )}
                          {columns.map((col) => (
                            <td
                              key={String(col.key)}
                              className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                            >
                              {col.render ? (
                                col.render(row[col.key], row, absoluteIndex)
                              ) : (
                                <span>{row[col.key]?.toString() || '-'}</span>
                              )}
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(absoluteIndex, row)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                title="Edit record"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteSingle(absoluteIndex)
                                }
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Delete record"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, idx) =>
                    page === 'ellipsis' ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}
