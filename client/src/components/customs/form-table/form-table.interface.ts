// ============================================
// FILE: form-table.interface.ts
// ============================================

import React from 'react';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface FormTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit: (index: number, row: T) => void;
  onDelete: (indices: number[]) => void; 
  selectable?: boolean;
  emptyMessage?: string;
  tableTitle?: string;
  getRowId: (row: T, index: number) => string; 
  pageSize?: number;
}
