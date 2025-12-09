import { ColumnDef, Table } from '@tanstack/react-table';
import { ReactNode } from 'react';
import { useDataTableSelectionStore } from './data-store';

export type DataTableSelectionStore = ReturnType<
  typeof useDataTableSelectionStore
>;

// NEW: Filter definition type
export interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  multiple?: boolean; // NEW: Allow multiple selections
}

export interface FetchDataParams {
  page: number;
  limit: number;
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>; // Can be string, string[], or any type
}

export interface FetchDataResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface UseDataTableProps<T> {
  columns: ColumnDef<T>[];
  fetchData?: (params: FetchDataParams) => Promise<FetchDataResult<T>>;
  initialData?: T[];
  enableServerSide?: boolean;
  initialLoadDelay?: number;
  fetchLoadDelay?: number;
  enableUrlSync?: boolean; // NEW
  storageKey?: string; // NEW - unique key for each table
  filterOptions?: FilterOption[];
}

export interface UseDataTableReturn<T> {
  table: Table<T>;
  data: T[];
  loading: boolean;
  isInitialLoad: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  searchValue: string;
  setSearchValue: (value: string) => void;
  handleDeleteRows: () => void;
  refreshData: () => void;
  getSelectedRows: () => T[];
  getAllSelectedRowIds: () => string[];
  toggleAllPageRowsSelected: (value: boolean) => void;
  getIsAllPageRowsSelected: () => boolean;
  getIsSomePageRowsSelected: () => boolean;
  selectionStore: DataTableSelectionStore;
  filters: Record<string, any>; // NEW
  setFilters: (filters: Record<string, any>) => void; // NEW
}

export interface CheckboxAction {
  label: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  icon?: ReactNode;
  action: (selectedRows: any[]) => void;
}

export interface CardField<T = any> {
  key: keyof T | string;
  label?: string;
  render?: (value: any, row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  fetchData?: (params: FetchDataParams) => Promise<FetchDataResult<T>>;
  initialData?: T[];
  enableServerSide?: boolean;
  enableSearch?: boolean;
  enableColumnVisibility?: boolean;
  enableRowSelection?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  enableRefreshButton?: boolean;
  searchPlaceholder?: string;
  onAddNew?: () => void;
  onRowAction?: (action: string, row: T) => void;
  addButtonText?: string;
  refreshButtonText?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  emptyStateMessage?: string;
  pageSizeOptions?: number[];
  className?: string;
  checkboxActions?: CheckboxAction[];
  initialLoadDelay?: number;
  fetchLoadDelay?: number;
  onRefresh?: (refresh: () => void) => void;

  enableCard?: boolean;
  cardFields?: CardField<T>[];
  cardComponent?: (props: { row: T; index: number }) => ReactNode;
  enableViewToggle?: boolean; // NEW: Enable view type toggle on desktop
  defaultViewType?: 'row' | 'card'; // NEW: Default view type

  readOnly?: boolean;
  enableUrlSync?: boolean;
  storageKey?: string;
  filterOptions?: FilterOption[]; // NEW: Filter options
  enableFilters?: boolean; // NEW: Enable/disable filter
}
