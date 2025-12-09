// src/components/customs/kanban/kanban.component.tsx
'use client';

import { useId, useRef, useEffect, useMemo } from 'react';
import {
  CircleAlertIcon,
  CircleXIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
  Loader2Icon,
  RefreshCwIcon,
  GripVerticalIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useKanban, useIntersectionObserver } from './useKanban';
import { KanbanProps, KanbanColumn } from './kanban.interface';
import { useKanbanSelectionStore } from './data-store';

export function Kanban<T extends Record<string, any>>({
  columns,
  statusField,
  fetchData,
  onStatusChange,
  initialData = [],
  enableServerSide = false,
  enableDragDrop = true,
  enableSearch = true,
  enableFilters = false,
  enableRowSelection = true,
  enableRefreshButton = true,
  searchPlaceholder = 'Search...',
  title,
  description,
  children,
  emptyStateMessage = 'No items found.',
  className,
  filterOptions = [],
  checkboxActions = [],
  initialLoadDelay = 500,
  fetchLoadDelay = 100,
  onRefresh,
  cardComponent,
  readOnly = false,
  enableUrlSync = true,
  storageKey = 'default',
  idField = 'id' as keyof T,
  onAddNew,
  addButtonText = 'Add New',
  refreshButtonText = 'Refresh',
  pageSize = 50,
  enableColumnFiltering = true, // NEW: Enable/disable column filtering
  columnFilterKey = 'status', // NEW: Which filter key controls columns (default: 'status')
}: KanbanProps<T>) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const columnScrollRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const columnSentinelRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const {
    data,
    loading,
    isInitialLoad,
    error,
    searchValue,
    setSearchValue,
    filters,
    setFilters,
    refreshData,
    getColumnItems,
    handleStatusChange,
    getAllSelectedItemIds,
    selectionStore,
    loadMore,
    hasMore,
    loadingMore,
    totalItems,
  } = useKanban({
    columns,
    statusField,
    fetchData,
    onStatusChange,
    initialData,
    enableServerSide,
    enableDragDrop,
    initialLoadDelay,
    fetchLoadDelay,
    enableUrlSync,
    storageKey,
    idField,
    pageSize,
  });

  // NEW: Compute visible columns based on filters
  const visibleColumns = useMemo(() => {
    if (!enableColumnFiltering) {
      return columns;
    }

    // Check if the column filter key has any selected values
    const selectedStatuses = filters[columnFilterKey];

    if (
      !selectedStatuses ||
      !Array.isArray(selectedStatuses) ||
      selectedStatuses.length === 0
    ) {
      // No filter applied, show all columns
      return columns;
    }

    // Filter columns to only show those matching selected statuses
    return columns.filter((column) => selectedStatuses.includes(column.value));
  }, [columns, filters, columnFilterKey, enableColumnFiltering]);

  // NEW: Show empty state when no columns match the filter
  const hasNoVisibleColumns =
    enableColumnFiltering && visibleColumns.length === 0;

  useEffect(() => {
    if (onRefresh) {
      onRefresh(refreshData);
    }
  }, []);

  const getSelectionCount = useKanbanSelectionStore((s) => s.getSelectionCount);
  const clearSelection = useKanbanSelectionStore((s) => s.clear);
  const isSelected = useKanbanSelectionStore((s) => s.isSelected);
  const toggleSelected = useKanbanSelectionStore((s) => s.toggleSelected);

  const effectiveEnableRowSelection = !readOnly && enableRowSelection;
  const hasSelectedItems = getSelectionCount() > 0;
  const selectedItemsCount = getSelectionCount();

  const createSkeletonCards = (count: number) => {
    return Array.from({ length: count }, (_, index) => (
      <Card key={`skeleton-card-${index}`} className="mb-2.5">
        <CardContent className="p-3 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </CardContent>
      </Card>
    ));
  };

  const renderColumn = (column: KanbanColumn) => {
    const columnItems = getColumnItems(column.value);
    const itemCount = columnItems.length;

    return (
      <div
        key={column.id}
        className="flex flex-col min-w-[340px] w-[340px] bg-muted/30 rounded-lg flex-shrink-0"
      >
        {/* Column Header */}
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              {column.icon}
              <h3 className="font-semibold text-base">{column.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {itemCount}
              </Badge>
            </div>
            {onAddNew && !readOnly && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddNew(column)}
                className="h-7 w-7 p-0"
              >
                <PlusIcon size={14} />
              </Button>
            )}
          </div>
          {column.maxItems && itemCount >= column.maxItems && (
            <p className="text-xs text-muted-foreground">
              Max items reached ({column.maxItems})
            </p>
          )}
        </div>

        {/* Column Content with Infinite Scroll */}
        <div
          ref={(el) => {
            if (el) columnScrollRefs.current.set(column.id, el);
          }}
          className="flex-1 p-3 overflow-y-auto max-h-[calc(100vh-280px)]"
        >
          {loading && isInitialLoad ? (
            createSkeletonCards(3)
          ) : columnItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No items
            </div>
          ) : (
            <>
              <div className="space-y-2.5">
                {columnItems.map((item, index) => {
                  const itemId = (item[idField] ||
                    item._id ||
                    item.id) as string;
                  const isItemSelected = isSelected(itemId);

                  return (
                    <Card
                      key={itemId}
                      className={cn(
                        'cursor-pointer transition-all hover:shadow-md',
                        isItemSelected && 'ring-2 ring-primary',
                        enableDragDrop && 'hover:scale-[1.01]',
                      )}
                    >
                      <CardContent className="p-3">
                        <div className="flex gap-2">
                          {effectiveEnableRowSelection && (
                            <div className="flex items-start pt-0.5">
                              <Checkbox
                                checked={isItemSelected}
                                onCheckedChange={() => toggleSelected(itemId)}
                                aria-label={`Select item ${index + 1}`}
                                className="h-4 w-4"
                              />
                            </div>
                          )}
                          {enableDragDrop && !readOnly && (
                            <div className="flex items-start pt-0.5 cursor-grab active:cursor-grabbing">
                              <GripVerticalIcon
                                size={14}
                                className="text-muted-foreground"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            {cardComponent({
                              item,
                              index,
                              isSelected: isItemSelected,
                              onSelect: () => toggleSelected(itemId),
                              onStatusChange: (newStatus) =>
                                handleStatusChange(item, newStatus),
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Intersection Observer Sentinel for Infinite Scroll */}
              {columnItems.length > 0 && hasMore && (
                <div
                  ref={(el) => {
                    if (el) columnSentinelRefs.current.set(column.id, el);
                  }}
                  className="h-10 flex items-center justify-center"
                >
                  {loadingMore && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2Icon className="animate-spin" size={16} />
                      <span>Loading more...</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!enableServerSide || loading || isInitialLoad || !hasMore) return;

    const observers: IntersectionObserver[] = [];

    visibleColumns.forEach((column) => {
      const sentinel = columnSentinelRefs.current.get(column.id);
      const scrollContainer = columnScrollRefs.current.get(column.id);

      if (sentinel && scrollContainer) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !loadingMore) {
              loadMore();
            }
          },
          {
            root: scrollContainer,
            rootMargin: '100px',
            threshold: 0.1,
          },
        );

        observer.observe(sentinel);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [
    visibleColumns,
    enableServerSide,
    loading,
    isInitialLoad,
    hasMore,
    loadingMore,
    loadMore,
  ]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-destructive">
        <div className="text-center">
          <CircleAlertIcon className="mx-auto mb-2" size={24} />
          <p>Error: {error}</p>
          <Button variant="outline" onClick={refreshData} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Additional header content */}
      {children && <div className="space-y-4">{children}</div>}

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left side - Search and filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          {enableSearch && (
            <div className="relative">
              <Input
                id={`${id}-search`}
                ref={inputRef}
                className={cn('peer w-full ps-9', searchValue && 'pe-9')}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchPlaceholder}
                type="text"
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                <ListFilterIcon size={16} />
              </div>
              {searchValue && (
                <button
                  className="text-muted-foreground/80 hover:text-foreground absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md"
                  onClick={() => {
                    setSearchValue('');
                    inputRef.current?.focus();
                  }}
                >
                  <CircleXIcon size={16} />
                </button>
              )}
            </div>
          )}

          {/* Filter Dropdown */}
          {enableFilters && filterOptions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0">
                  <ListFilterIcon className="-ms-1 opacity-60" size={16} />
                  <span className="hidden sm:inline">Filters</span>
                  {Object.keys(filters).length > 0 && (
                    <span className="bg-primary text-primary-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.625rem] font-medium ml-1">
                      {Object.keys(filters).length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <DropdownMenuLabel className="p-0">Filters</DropdownMenuLabel>
                  {Object.keys(filters).length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilters({})}
                      className="h-7 px-2 text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto px-1">
                  {filterOptions.map((filterOption) => (
                    <div
                      key={filterOption.key}
                      className="px-2 py-2 border-t first:border-t-0"
                    >
                      <Label className="text-xs font-medium mb-1.5 block text-muted-foreground">
                        {filterOption.label}
                        {/* NEW: Show column filtering indicator */}
                        {enableColumnFiltering &&
                          filterOption.key === columnFilterKey && (
                            <span className="ml-1 text-[10px] text-primary">
                              (filters columns)
                            </span>
                          )}
                      </Label>
                      {filterOption.multiple ? (
                        <div className="space-y-2">
                          {filterOption.options.map((option) => {
                            const currentValues = Array.isArray(
                              filters[filterOption.key],
                            )
                              ? filters[filterOption.key]
                              : [];
                            const isChecked = currentValues.includes(
                              option.value,
                            );

                            return (
                              <div
                                key={option.value}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${filterOption.key}-${option.value}`}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    const newFilters = { ...filters };
                                    let currentArray = Array.isArray(
                                      newFilters[filterOption.key],
                                    )
                                      ? [...newFilters[filterOption.key]]
                                      : [];

                                    if (checked) {
                                      if (
                                        !currentArray.includes(option.value)
                                      ) {
                                        currentArray.push(option.value);
                                      }
                                    } else {
                                      currentArray = currentArray.filter(
                                        (v) => v !== option.value,
                                      );
                                    }

                                    if (currentArray.length > 0) {
                                      newFilters[filterOption.key] =
                                        currentArray;
                                    } else {
                                      delete newFilters[filterOption.key];
                                    }

                                    setFilters(newFilters);
                                  }}
                                />
                                <label
                                  htmlFor={`${filterOption.key}-${option.value}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {option.label}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <Select
                          value={filters[filterOption.key] || '__all__'}
                          onValueChange={(value) => {
                            if (value === '__all__') {
                              const newFilters = { ...filters };
                              delete newFilters[filterOption.key];
                              setFilters(newFilters);
                            } else {
                              setFilters({
                                ...filters,
                                [filterOption.key]: value,
                              });
                            }
                          }}
                        >
                          <SelectTrigger className="w-full h-9 text-sm">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__all__" className="text-sm">
                              All
                            </SelectItem>
                            {filterOption.options.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="text-sm"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Right side - Actions and selection info */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Column visibility indicator */}
          {enableColumnFiltering && visibleColumns.length < columns.length && (
            <div className="text-sm text-muted-foreground">
              Showing {visibleColumns.length} of {columns.length} columns
            </div>
          )}

          {/* Total Items Counter */}
          {enableServerSide && totalItems > 0 && (
            <div className="text-sm text-muted-foreground">
              {data.length} of {totalItems} items
            </div>
          )}

          {/* Selection Info */}
          {effectiveEnableRowSelection && hasSelectedItems && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {selectedItemsCount} item{selectedItemsCount !== 1 ? 's' : ''}{' '}
                selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="h-8 px-2"
              >
                Clear
              </Button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {effectiveEnableRowSelection &&
              hasSelectedItems &&
              checkboxActions.map((action, idx) => (
                <AlertDialog key={idx}>
                  <AlertDialogTrigger asChild>
                    <Button variant={action.variant || 'outline'} size="sm">
                      {action.icon || <TrashIcon size={16} />}
                      <span className="hidden sm:inline">{action.label}</span>
                      <span className="bg-background text-muted-foreground/70 inline-flex h-5 items-center rounded border px-1 text-[0.625rem] font-medium">
                        {selectedItemsCount}
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                      <CircleAlertIcon size={16} className="opacity-80" />
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will{' '}
                          {action.label.toLowerCase()} {selectedItemsCount} item
                          {selectedItemsCount !== 1 ? 's' : ''}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          const selectedIds = getAllSelectedItemIds();
                          const allSelectedItems = data.filter((item) => {
                            const itemId = (item[idField] ||
                              item._id ||
                              item.id) as string;
                            return selectedIds.includes(itemId);
                          });
                          action.action(allSelectedItems);
                          clearSelection();
                        }}
                      >
                        {action.label}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ))}

            {enableRefreshButton && enableServerSide && (
              <Button
                onClick={refreshData}
                variant="outline"
                disabled={loading}
                size="sm"
              >
                <RefreshCwIcon
                  className={cn('-ms-1 opacity-60', loading && 'animate-spin')}
                  size={16}
                />
                <span className="hidden sm:inline">{refreshButtonText}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {loading && isInitialLoad ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2Icon className="animate-spin" size={20} />
            Loading...
          </div>
        </div>
      ) : hasNoVisibleColumns ? (
        <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <div className="text-center text-muted-foreground">
            <ListFilterIcon className="mx-auto mb-2" size={32} />
            <p className="text-lg font-medium">No columns match your filter</p>
            <p className="text-sm mt-1">
              Select different statuses to view columns
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {visibleColumns.map((column) => renderColumn(column))}
          </div>
        </div>
      )}
    </div>
  );
}
