// src/components/customs/kanban/kanban.interface.ts

export interface KanbanColumn {
  id: string;
  title: string;
  value: string | boolean;
  color?: string;
  icon?: React.ReactNode;
  maxItems?: number;
}

export interface FilterOption {
  key: string;
  label: string;
  multiple?: boolean;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export interface CheckboxAction<T> {
  label: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  icon?: React.ReactNode;
  action: (selectedItems: T[]) => void | Promise<void>;
}

export interface FetchDataParams {
  keyword?: string;
  filters?: Record<string, any>;
  page?: number; // NEW: page parameter for pagination
  limit?: number; // NEW: limit parameter for pagination
}

export interface FetchDataResult<T> {
  data: T[];
  totalItems: number;
}

export interface UseKanbanProps<T> {
  columns: KanbanColumn[];
  statusField: keyof T;
  fetchData?: (params: FetchDataParams) => Promise<FetchDataResult<T>>;
  onStatusChange?: (item: T, newStatus: string | boolean) => Promise<void>;
  initialData?: T[];
  enableServerSide?: boolean;
  enableDragDrop?: boolean;
  initialLoadDelay?: number;
  fetchLoadDelay?: number;
  enableUrlSync?: boolean;
  storageKey?: string;
  idField?: keyof T;
  pageSize?: number; // NEW: configurable page size
}

export interface UseKanbanReturn<T> {
  data: T[];
  loading: boolean;
  isInitialLoad: boolean;
  error: string | null;
  totalItems: number;
  searchValue: string;
  setSearchValue: (value: string) => void;
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  refreshData: () => void;
  getColumnItems: (columnValue: string | boolean) => T[];
  handleStatusChange: (item: T, newStatus: string | boolean) => Promise<void>;
  getSelectedItems: () => T[];
  getAllSelectedItemIds: () => string[];
  selectionStore: any;
  // NEW: Infinite scroll returns
  loadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  currentPage: number;
}

export interface KanbanProps<T>
  extends Omit<UseKanbanProps<T>, 'enableUrlSync' | 'storageKey'> {
  enableSearch?: boolean;
  enableFilters?: boolean;
  enableRowSelection?: boolean;
  enableRefreshButton?: boolean;
  searchPlaceholder?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  emptyStateMessage?: string;
  className?: string;
  filterOptions?: FilterOption[];
  checkboxActions?: CheckboxAction<T>[];
  onRefresh?: (refreshFn: () => void) => void;
  cardComponent: (props: {
    item: T;
    index: number;
    isSelected: boolean;
    onSelect: () => void;
    onStatusChange: (newStatus: string | boolean) => void;
  }) => React.ReactNode;
  readOnly?: boolean;
  enableUrlSync?: boolean;
  storageKey?: string;
  onAddNew?: (column: KanbanColumn) => void;
  addButtonText?: string;
  refreshButtonText?: string;
  pageSize?: number;
  enableColumnFiltering?: boolean; // NEW: Enable dynamic column visibility based on filters
  columnFilterKey?: string; // NEW: Which filter key controls column visibility (default: 'status')
}
