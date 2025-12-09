'use client';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { useDataTableSelectionStore } from './data-store';
import { UseDataTableProps, UseDataTableReturn } from './data-table.interface';

// LocalStorage keys
const STORAGE_KEY_PREFIX = 'dataTable_';

export function useDataTable<T extends Record<string, any>>({
  columns,
  fetchData,
  initialData = [],
  enableServerSide = false,
  initialLoadDelay = 300,
  fetchLoadDelay = 100,
  enableUrlSync = true,
  storageKey = 'default',
}: UseDataTableProps<T>): UseDataTableReturn<T> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(
    enableServerSide && fetchData ? true : false,
  );
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(
    enableServerSide && fetchData ? true : false,
  );
  const [filters, setFilters] = useState<Record<string, any>>({}); // NEW
  const [isInitialized, setIsInitialized] = useState(false);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const prevSearchValueRef = useRef(searchValue);
  const selectionStore = useDataTableSelectionStore();

  // Initialize from URL params or localStorage on mount
  useEffect(() => {
    if (!enableUrlSync) {
      setIsInitialized(true);
      return;
    }

    const urlPage = searchParams.get('page');
    const urlLimit = searchParams.get('limit');
    const urlKeyword = searchParams.get('keyword');
    const urlFilters = searchParams.get('filters');
    const urlTableKey = searchParams.get('tableKey'); // Check which table owns these params

    let pageToUse = 1;
    let limitToUse = 10;
    let keywordToUse = '';
    let filtersToUse: Record<string, any> = {}; // NEW

    // Only use URL params if they belong to this table OR if no tableKey exists (backward compatibility)
    const shouldUseUrlParams = !urlTableKey || urlTableKey === storageKey;

    if (
      shouldUseUrlParams &&
      (urlPage || urlLimit || urlKeyword || urlFilters)
    ) {
      pageToUse = urlPage ? parseInt(urlPage, 10) : 1;
      limitToUse = urlLimit ? parseInt(urlLimit, 10) : 10;
      keywordToUse = urlKeyword || '';
      // NEW: Parse filters from URL
      if (urlFilters) {
        try {
          filtersToUse = JSON.parse(urlFilters);
        } catch (e) {
          console.error('Failed to parse filters from URL:', e);
        }
      }
    } else {
      // Try localStorage
      try {
        const stored = localStorage.getItem(
          `${STORAGE_KEY_PREFIX}${storageKey}`,
        );
        if (stored) {
          const parsed = JSON.parse(stored);
          pageToUse = parsed.page || 1;
          limitToUse = parsed.limit || 10;
          keywordToUse = parsed.keyword || '';
          filtersToUse = parsed.filters || {}; // NEW
        }
      } catch (e) {
        console.error('Failed to load from localStorage:', e);
      }
    }

    // Set initial state
    setPagination({ pageIndex: pageToUse - 1, pageSize: limitToUse });
    setSearchValue(keywordToUse);
    setFilters(filtersToUse); // NEW
    prevSearchValueRef.current = keywordToUse;
    setIsInitialized(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync URL and localStorage whenever state changes
  useEffect(() => {
    if (!enableUrlSync || !isInitialized) return;

    const currentParams = new URLSearchParams(searchParams.toString());

    // Add tableKey to identify which table owns these params
    currentParams.set('tableKey', storageKey);
    currentParams.set('page', String(pagination.pageIndex + 1));
    currentParams.set('limit', String(pagination.pageSize));

    if (searchValue) {
      currentParams.set('keyword', searchValue);
    } else {
      currentParams.delete('keyword');
    }

    // NEW: Add filters to URL
    if (Object.keys(filters).length > 0) {
      currentParams.set('filters', JSON.stringify(filters));
    } else {
      currentParams.delete('filters');
    }

    // Update URL without causing navigation
    const newUrl = `${pathname}?${currentParams.toString()}`;
    router.replace(newUrl, { scroll: false });

    // Save to localStorage
    try {
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}${storageKey}`,
        JSON.stringify({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          keyword: searchValue,
          filters, // NEW
        }),
      );
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    searchValue,
    filters, // New
    enableUrlSync,
    isInitialized,
    pathname,
    // router,
    // searchParams,
    storageKey,
  ]);

  const rowSelection = useMemo(() => {
    const selection: Record<string, boolean> = {};
    data.forEach((item, index) => {
      const itemId = item._id || item.id || index.toString();
      if (selectionStore.isSelected(itemId)) {
        selection[index.toString()] = true;
      }
    });
    return selection;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selectionStore.selectedRowIds]);

  // Reset to page 1 when search value changes
  useEffect(() => {
    if (prevSearchValueRef.current !== searchValue) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      prevSearchValueRef.current = searchValue;
    }
  }, [searchValue]);

  // NEW: Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters]);

  // Debounced search + other server-side triggers
  useEffect(() => {
    if (!enableServerSide || !isInitialized) return;

    const timeoutId = setTimeout(() => {
      if (fetchData) {
        loadData();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchValue,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    filters,
    isInitialized,
  ]);

  // Initial load
  useEffect(() => {
    if (enableServerSide && fetchData && isInitialized) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  const loadData = async (isManualRefresh = false) => {
    if (!fetchData) return;

    setLoading(true);
    setError(null);

    const delay = isInitialLoad
      ? initialLoadDelay
      : isManualRefresh
      ? 0
      : fetchLoadDelay;

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
      const sortOrder =
        sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

      const result = await fetchData({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        keyword: searchValue || undefined,
        sortBy,
        sortOrder,
        filters: Object.keys(filters).length > 0 ? filters : undefined, // NEW
      });

      setData(result.data);
      setTotalItems(result.totalItems);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);

      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setPagination({ pageIndex: 0, pageSize: 10 });
    setSearchValue('');
    setFilters({});
    if (enableServerSide && fetchData) {
      loadData(true);
    }
  };

  const handleDeleteRows = () => {
    const selectedRowIds = selectionStore.get();

    if (!enableServerSide) {
      const updatedData = data.filter((item) => {
        const itemId = item._id || item.id;
        return !selectedRowIds.includes(itemId);
      });
      setData(updatedData);
    }

    selectionStore.clear();
    table.resetRowSelection();
  };

  const getSelectedRows = () => {
    const selectedRowIds = selectionStore.get();
    return data.filter((item) => {
      const itemId = item._id || item.id;
      return selectedRowIds.includes(itemId);
    });
  };

  const getAllSelectedRowIds = () => {
    return selectionStore.get();
  };

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<T>[],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableServerSide ? undefined : getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: enableServerSide
      ? undefined
      : getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: enableServerSide ? undefined : getFilteredRowModel(),
    pageCount: enableServerSide ? totalPages : undefined,
    manualPagination: enableServerSide,
    manualSorting: enableServerSide,
    manualFiltering: enableServerSide,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: (updaterOrValue) => {
      if (typeof updaterOrValue === 'function') {
        const newSelection = updaterOrValue(rowSelection);

        Object.keys(newSelection).forEach((rowIndex) => {
          const dataIndex = parseInt(rowIndex, 10);
          const item = data[dataIndex];
          const itemId = item?._id || item?.id || dataIndex.toString();

          if (newSelection[rowIndex]) {
            selectionStore.store(itemId);
          } else {
            selectionStore.clearSelected(itemId);
          }
        });

        Object.keys(rowSelection).forEach((rowIndex) => {
          if (!newSelection[rowIndex] && rowSelection[rowIndex]) {
            const dataIndex = parseInt(rowIndex, 10);
            const item = data[dataIndex];
            const itemId = item?._id || item?.id || dataIndex.toString();
            selectionStore.clearSelected(itemId);
          }
        });
      }
    },
  });

  const toggleAllPageRowsSelected = (value: boolean) => {
    const currentPageIds = data.map(
      (item, index) => item._id || item.id || index.toString(),
    );

    if (value) {
      selectionStore.store(currentPageIds);
    } else {
      selectionStore.clearSelected(currentPageIds);
    }
  };

  const getIsAllPageRowsSelected = () => {
    if (data.length === 0) return false;
    return data.every((item, index) => {
      const itemId = item._id || item.id || index.toString();
      return selectionStore.isSelected(itemId);
    });
  };

  const getIsSomePageRowsSelected = () => {
    return (
      data.some((item, index) => {
        const itemId = item._id || item.id || index.toString();
        return selectionStore.isSelected(itemId);
      }) && !getIsAllPageRowsSelected()
    );
  };

  useEffect(() => {
    if (enableServerSide && totalPages > 0) {
      table.setPageCount(totalPages);
    }
  }, [totalPages, enableServerSide, table]);

  return {
    table,
    data,
    loading,
    isInitialLoad,
    error,
    totalItems,
    totalPages,
    currentPage,
    searchValue,
    setSearchValue,
    filters, // NEW
    setFilters, // NEW
    handleDeleteRows,
    refreshData,
    getSelectedRows,
    getAllSelectedRowIds,
    toggleAllPageRowsSelected,
    getIsAllPageRowsSelected,
    getIsSomePageRowsSelected,
    selectionStore,
  };
}
