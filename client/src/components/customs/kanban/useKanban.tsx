// src/components/customs/kanban/useKanban.tsx
'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useKanbanSelectionStore } from './data-store';
import {
  UseKanbanProps,
  UseKanbanReturn,
  KanbanColumn,
} from './kanban.interface';

const STORAGE_KEY_PREFIX = 'kanban_';

// Utility function to deduplicate items by ID
function deduplicateById<T extends Record<string, any>>(
  existingItems: T[],
  newItems: T[],
  idField: keyof T,
): T[] {
  const map = new Map(
    existingItems.map((item) => {
      const itemId = (item[idField] || item._id || item.id) as string;
      return [itemId, item];
    }),
  );

  newItems.forEach((item) => {
    const itemId = (item[idField] || item._id || item.id) as string;
    if (!map.has(itemId)) {
      map.set(itemId, item);
    }
  });

  return Array.from(map.values());
}

export function useKanban<T extends Record<string, any>>({
  columns,
  statusField,
  fetchData,
  onStatusChange,
  initialData = [],
  enableServerSide = false,
  enableDragDrop = true,
  initialLoadDelay = 300,
  fetchLoadDelay = 100,
  enableUrlSync = true,
  storageKey = 'default',
  idField = 'id' as keyof T,
  pageSize = 50,
}: UseKanbanProps<T>): UseKanbanReturn<T> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(
    enableServerSide && fetchData ? true : false,
  );
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(
    enableServerSide && fetchData ? true : false,
  );
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const prevSearchValueRef = useRef(searchValue);
  const prevFiltersRef = useRef(filters);
  const selectionStore = useKanbanSelectionStore();

  useEffect(() => {
    if (!enableUrlSync) {
      setIsInitialized(true);
      return;
    }

    const urlKeyword = searchParams.get('keyword');
    const urlFilters = searchParams.get('filters');
    const urlTableKey = searchParams.get('kanbanKey');

    let keywordToUse = '';
    let filtersToUse: Record<string, any> = {};

    const shouldUseUrlParams = !urlTableKey || urlTableKey === storageKey;

    if (shouldUseUrlParams && (urlKeyword || urlFilters)) {
      keywordToUse = urlKeyword || '';
      if (urlFilters) {
        try {
          filtersToUse = JSON.parse(urlFilters);
        } catch (e) {
          console.error('Failed to parse filters from URL:', e);
        }
      }
    } else {
      try {
        const stored = localStorage.getItem(
          `${STORAGE_KEY_PREFIX}${storageKey}`,
        );
        if (stored) {
          const parsed = JSON.parse(stored);
          keywordToUse = parsed.keyword || '';
          filtersToUse = parsed.filters || {};
        }
      } catch (e) {
        console.error('Failed to load from localStorage:', e);
      }
    }

    setSearchValue(keywordToUse);
    setFilters(filtersToUse);
    prevSearchValueRef.current = keywordToUse;
    prevFiltersRef.current = filtersToUse;
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!enableUrlSync || !isInitialized) return;

    const currentParams = new URLSearchParams(searchParams.toString());

    currentParams.set('kanbanKey', storageKey);

    if (searchValue) {
      currentParams.set('keyword', searchValue);
    } else {
      currentParams.delete('keyword');
    }

    if (Object.keys(filters).length > 0) {
      currentParams.set('filters', JSON.stringify(filters));
    } else {
      currentParams.delete('filters');
    }

    const newUrl = `${pathname}?${currentParams.toString()}`;
    router.replace(newUrl, { scroll: false });

    try {
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}${storageKey}`,
        JSON.stringify({
          keyword: searchValue,
          filters,
        }),
      );
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [
    searchValue,
    filters,
    enableUrlSync,
    isInitialized,
    pathname,
    storageKey,
  ]);

  useEffect(() => {
    if (!enableServerSide || !isInitialized) return;

    const searchChanged = searchValue !== prevSearchValueRef.current;
    const filtersChanged =
      JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current);

    if (searchChanged || filtersChanged) {
      prevSearchValueRef.current = searchValue;
      prevFiltersRef.current = filters;

      setCurrentPage(1);
      setHasMore(true);
      setData([]);

      const timeoutId = setTimeout(() => {
        if (fetchData) {
          loadData(1, true);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [searchValue, filters, isInitialized]);

  useEffect(() => {
    if (enableServerSide && fetchData && isInitialized) {
      loadData(1, false);
    }
  }, [isInitialized]);

  const loadData = async (
    page: number,
    isReset: boolean = false,
    isManualRefresh = false,
  ) => {
    if (!fetchData) return;

    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

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
      const result = await fetchData({
        keyword: searchValue || undefined,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        page,
        limit: pageSize,
      });

      if (isReset || page === 1) {
        setData(result.data);
      } else {
        // THIS IS THE CHANGE - deduplicate when loading more pages
        setData((prev) => deduplicateById(prev, result.data, idField));
      }

      setTotalItems(result.totalItems);
      setCurrentPage(page);

      const totalLoaded =
        page === 1 ? result.data.length : data.length + result.data.length;
      setHasMore(totalLoaded < result.totalItems);

      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      loadData(currentPage + 1, false);
    }
  }, [loadingMore, hasMore, loading, currentPage]);

  const refreshData = () => {
    setSearchValue('');
    setFilters({});
    setCurrentPage(1);
    setHasMore(true);
    setData([]);
    if (enableServerSide && fetchData) {
      loadData(1, true, true);
    }
  };

  const getColumnItems = (columnValue: string | boolean) => {
    return data.filter((item) => item[statusField] === columnValue);
  };

  const handleStatusChange = async (item: T, newStatus: string | boolean) => {
    if (onStatusChange) {
      try {
        await onStatusChange(item, newStatus);

        if (enableServerSide && fetchData) {
          setCurrentPage(1);
          setHasMore(true);
          await loadData(1, true);
        } else {
          setData((prevData) =>
            prevData.map((dataItem) => {
              const itemId = item[idField] || item._id || item.id;
              const dataItemId =
                dataItem[idField] || dataItem._id || dataItem.id;

              if (itemId === dataItemId) {
                return { ...dataItem, [statusField]: newStatus };
              }
              return dataItem;
            }),
          );
        }
      } catch (err) {
        console.error('Failed to update status:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to update status',
        );
      }
    }
  };

  const getSelectedItems = () => {
    const selectedIds = selectionStore.get();
    return data.filter((item) => {
      const itemId = (item[idField] || item._id || item.id) as string;
      return selectedIds.includes(itemId);
    });
  };

  const getAllSelectedItemIds = () => {
    return selectionStore.get();
  };

  return {
    data,
    loading,
    isInitialLoad,
    error,
    totalItems,
    searchValue,
    setSearchValue,
    filters,
    setFilters,
    refreshData,
    getColumnItems,
    handleStatusChange,
    getSelectedItems,
    getAllSelectedItemIds,
    selectionStore,
    loadMore,
    hasMore,
    loadingMore,
    currentPage,
  };
}

export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  options: IntersectionObserverInit = {},
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback, options]);
}
