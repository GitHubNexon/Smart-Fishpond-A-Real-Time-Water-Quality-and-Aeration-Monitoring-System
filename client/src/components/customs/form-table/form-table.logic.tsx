// ============================================
// FILE: form-table.logic.tsx
// ============================================

import { useState, useMemo } from 'react';
import { useTableSelectionStore } from './form-table.store';

export function useFormTableLogic<T>(
  data: T[],
  getRowId: (row: T, index: number) => string,
  pageSize: number = 10,
) {
  const [currentPage, setCurrentPage] = useState(1);

  const { selectedRowIds, toggleRowSelection, toggleAllRows, clearSelections } =
    useTableSelectionStore();

  // Calculate pagination
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  // Get IDs for current page
  const currentPageIds = useMemo(
    () => paginatedData.map((row, idx) => getRowId(row, startIndex + idx)),
    [paginatedData, startIndex, getRowId],
  );

  // Check if all current page rows are selected
  const allCurrentPageSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedRowIds.has(id));

  const handleToggleAllCurrentPage = () => {
    toggleAllRows(currentPageIds);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Convert selected IDs back to indices for compatibility
  const getSelectedIndices = (): number[] => {
    const indices: number[] = [];
    data.forEach((row, index) => {
      const id = getRowId(row, index);
      if (selectedRowIds.has(id)) {
        indices.push(index);
      }
    });
    return indices.sort((a, b) => b - a); // Sort descending for safe deletion
  };

  return {
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
    totalItems: data.length,
    getSelectedIndices,
  };
}
