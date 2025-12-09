'use client';

import { useId, useRef, useEffect, useState } from 'react';
import { ColumnDef, flexRender } from '@tanstack/react-table';
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  EllipsisIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
  Loader2Icon,
  RefreshCwIcon,
  LayoutGrid,
  LayoutList,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useDataTable } from './useDataTable';
import { DataTableProps, CheckboxAction } from './data-table.interface';
import { useDataTableSelectionStore } from './data-store';
import PermissionWrapper from '../permission-wrapper';

export function DataTable<T extends Record<string, any>>({
  columns,
  fetchData,
  initialData = [],
  enableServerSide = false,
  enableSearch = true,
  enableColumnVisibility = true,
  enableRowSelection = true,
  enablePagination = true,
  enableSorting = true,
  enableRefreshButton = true,
  searchPlaceholder = 'Search...',
  onAddNew,
  onRowAction,
  addButtonText = 'Add New',
  refreshButtonText = 'Refresh',
  title,
  description,
  children,
  emptyStateMessage = 'No results found.',
  pageSizeOptions = [5, 10, 25, 50],
  className,
  checkboxActions = [],
  initialLoadDelay = 500,
  fetchLoadDelay = 100,
  onRefresh,
  enableCard = true,
  cardFields,
  cardComponent,
  readOnly = false,
  enableUrlSync = true,
  storageKey = 'default',
  filterOptions,
  enableFilters,
  enableViewToggle = false,
  defaultViewType = 'row',
}: DataTableProps<T>) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  // View type state (only used on desktop when enableViewToggle is true)
  const [viewType, setViewType] = useState<'row' | 'card'>(defaultViewType);

  const {
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
    handleDeleteRows,
    refreshData,
    getSelectedRows,
    getAllSelectedRowIds,
    toggleAllPageRowsSelected,
    getIsAllPageRowsSelected,
    getIsSomePageRowsSelected,
    filters,
    setFilters,
  } = useDataTable({
    columns,
    fetchData,
    initialData,
    enableServerSide,
    initialLoadDelay,
    fetchLoadDelay,
    enableUrlSync,
    storageKey,
  });

  useEffect(() => {
    if (onRefresh) {
      onRefresh(refreshData);
    }
  }, []);

  const getSelectionCount = useDataTableSelectionStore(
    (s) => s.getSelectionCount,
  );
  const clearSelection = useDataTableSelectionStore((s) => s.clear);
  const isSelected = useDataTableSelectionStore((s) => s.isSelected);
  const toggleSelected = useDataTableSelectionStore((s) => s.toggleSelected);
  const getSelectedIds = useDataTableSelectionStore((s) => s.get);
  const clearSelectedIds = useDataTableSelectionStore((s) => s.clearSelected);

  const effectiveEnableRowSelection = !readOnly && enableRowSelection;
  const hasSelectedRows = getSelectionCount() > 0;
  const selectedRowsCount = getSelectionCount();

  const createSkeletonRows = (count: number) => {
    return Array.from({ length: count }, (_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {columns.map((_, colIndex) => (
          <TableCell key={`skeleton-cell-${index}-${colIndex}`}>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const createSkeletonCards = (count: number) => {
    return Array.from({ length: count }, (_, index) => (
      <Card key={`skeleton-card-${index}`}>
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    ));
  };

  const renderCardView = () => {
    if (loading && isInitialLoad) {
      return (
        <div className="grid grid-cols-1 gap-4">
          {createSkeletonCards(table.getState().pagination.pageSize)}
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="flex items-center gap-2">
            <Loader2Icon className="animate-spin" size={20} />
            Loading...
          </div>
        </div>
      );
    }

    if (!data.length) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          {emptyStateMessage}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-full">
        {data.map((row, index) => {
          const itemId = row._id || row.id || index.toString();
          const isRowSelected = isSelected(itemId);

          if (cardComponent) {
            return (
              <Card
                key={itemId}
                className={cn(
                  'w-full card-grid-item ',
                  isRowSelected && 'ring-2 ring-primary',
                )}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    {effectiveEnableRowSelection && (
                      <div className="hidden md:flex items-start pt-1">
                        <Checkbox
                          checked={isRowSelected}
                          onCheckedChange={() => toggleSelected(itemId)}
                          aria-label={`Select row ${index + 1}`}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      {cardComponent({ row, index })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card
              key={itemId}
              className={cn(isRowSelected && 'ring-2 ring-primary')}
            >
              <CardContent className="p-4">
                {effectiveEnableRowSelection ? (
                  <div className="flex gap-3">
                    <div className="flex items-start pt-1">
                      <Checkbox
                        checked={isRowSelected}
                        onCheckedChange={() => toggleSelected(itemId)}
                        aria-label={`Select row ${index + 1}`}
                      />
                    </div>
                    <div className="flex-1">
                      {cardComponent({ row, index })}
                    </div>
                  </div>
                ) : (
                  cardComponent({ row, index })
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

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

      {children && <div className="space-y-4">{children}</div>}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                aria-label={searchPlaceholder}
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <ListFilterIcon size={16} aria-hidden="true" />
              </div>
              {searchValue && (
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchValue('');
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                >
                  <CircleXIcon size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0 cursor-pointer">
                  <Columns3Icon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">View</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    const headerLabel =
                      typeof column.columnDef.header === 'string'
                        ? column.columnDef.header
                        : column.id; // fallback

                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize cursor-pointer"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                        onSelect={(event) => event.preventDefault()}
                      >
                        {/* {column.id} */}
                        {headerLabel}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {enableFilters && filterOptions && filterOptions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="shrink-0 cursor-pointer relative"
                >
                  <ListFilterIcon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">Filters</span>
                  {Object.keys(filters).length > 0 && (
                    <span className="bg-primary text-primary-foreground -me-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.625rem] font-medium ml-1">
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
                      className="h-7 px-2 text-xs cursor-pointer hover:bg-accent"
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
                          <SelectTrigger className="w-full h-9 text-sm cursor-pointer">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="__all__"
                              className="text-sm cursor-pointer"
                            >
                              All
                            </SelectItem>
                            {filterOption.options.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="text-sm cursor-pointer"
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

          {/* View Toggle Switch - Desktop Only */}
          {enableViewToggle && enableCard && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="hidden md:flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer">
                    <LayoutList
                      size={16}
                      className={cn(
                        'opacity-60 transition-opacity',
                        viewType === 'row' && 'opacity-100',
                      )}
                    />

                    <Switch
                      checked={viewType === 'card'}
                      onCheckedChange={(checked) =>
                        setViewType(checked ? 'card' : 'row')
                      }
                      aria-label="Toggle view type"
                    />

                    <LayoutGrid
                      size={16}
                      className={cn(
                        'opacity-60 transition-opacity',
                        viewType === 'card' && 'opacity-100',
                      )}
                    />
                  </div>
                </TooltipTrigger>

                <TooltipContent>
                  <p>
                    {viewType === 'card' ? 'Switch to table' : 'Switch to card'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {effectiveEnableRowSelection && hasSelectedRows && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground order-last sm:order-first">
              <span>
                {selectedRowsCount} row{selectedRowsCount !== 1 ? 's' : ''}{' '}
                selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="h-8 px-2 cursor-pointer"
              >
                Clear
              </Button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {effectiveEnableRowSelection &&
              hasSelectedRows &&
              checkboxActions.map((action, idx) => (
                <AlertDialog key={idx}>
                  <AlertDialogTrigger asChild>
                    <Button variant={action.variant || 'outline'} size="sm">
                      {action.icon || <TrashIcon size={16} />}
                      <span className="hidden sm:inline">{action.label}</span>
                      <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 items-center rounded border px-1 text-[0.625rem] font-medium">
                        {selectedRowsCount}
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
                          {action.label.toLowerCase()} {selectedRowsCount} row
                          {selectedRowsCount !== 1 ? 's' : ''}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          const selectedIds = getAllSelectedRowIds();
                          const allSelectedRows = data.filter((item) =>
                            selectedIds.includes(item._id || item.id),
                          );
                          action.action(allSelectedRows);
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
                className="cursor-pointer"
              >
                <RefreshCwIcon
                  className={cn('-ms-1 opacity-60', loading && 'animate-spin')}
                  size={16}
                />
                <span className="hidden sm:inline">{refreshButtonText}</span>
              </Button>
            )}

            {onAddNew && (
              <PermissionWrapper permission="Create">
                <Button
                  onClick={onAddNew}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                >
                  <PlusIcon size={16} />
                  <span className="hidden sm:inline">{addButtonText}</span>
                </Button>
              </PermissionWrapper>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: Always show card view */}
      {enableCard && <div className="md:hidden w-full">{renderCardView()}</div>}

      {/* Desktop: Conditional rendering based on view type */}
      {enableCard && enableViewToggle && viewType === 'card' ? (
        <div className="hidden md:block w-full">{renderCardView()}</div>
      ) : (
        <div
          className={cn(
            'overflow-x-auto rounded-xl border border-accent-foreground',
            enableCard && 'hidden md:block', // Hide on mobile when cards are enabled
            !enableCard && 'block', // Always show if cards are disabled
          )}
        >
          <Table className="min-w-full table-auto lg:table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: `${header.getSize()}px` }}
                        className="h-11"
                      >
                        {header.isPlaceholder ? null : header.column.getCanSort() &&
                          enableSorting ? (
                          <div
                            className="flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                            onClick={header.column.getToggleSortingHandler()}
                            onKeyDown={(e) => {
                              if (
                                header.column.getCanSort() &&
                                (e.key === 'Enter' || e.key === ' ')
                              ) {
                                e.preventDefault();
                                header.column.getToggleSortingHandler()?.(e);
                              }
                            }}
                            tabIndex={0}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: (
                                <ChevronUpIcon
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              ),
                              desc: (
                                <ChevronDownIcon
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading && isInitialLoad ? (
                createSkeletonRows(table.getState().pagination.pageSize)
              ) : loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2Icon className="animate-spin" size={20} />
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {emptyStateMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {enablePagination && (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end lg:gap-8">
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <Label
              htmlFor={`${id}-page-size`}
              className="text-sm whitespace-nowrap"
            >
              Rows per page
            </Label>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger
                id={`${id}-page-size`}
                className="w-fit whitespace-nowrap"
              >
                <SelectValue placeholder="Select number of results" />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
            <div className="text-muted-foreground text-sm whitespace-nowrap text-center lg:text-left">
              <p aria-live="polite">
                <span className="text-foreground">
                  {enableServerSide
                    ? (currentPage - 1) * table.getState().pagination.pageSize +
                      1
                    : table.getState().pagination.pageIndex *
                        table.getState().pagination.pageSize +
                      1}
                  -
                  {enableServerSide
                    ? Math.min(
                        currentPage * table.getState().pagination.pageSize,
                        totalItems,
                      )
                    : Math.min(
                        (table.getState().pagination.pageIndex + 1) *
                          table.getState().pagination.pageSize,
                        table.getRowCount(),
                      )}
                </span>{' '}
                of{' '}
                <span className="text-foreground">
                  {enableServerSide ? totalItems : table.getRowCount()}
                </span>
              </p>
            </div>

            <Pagination>
              <PaginationContent className="cursor-pointer">
                <PaginationItem>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to first page"
                    className="h-8 w-8 p-0 lg:h-10 lg:w-10"
                  >
                    <ChevronFirstIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to previous page"
                    className="h-8 w-8 p-0 lg:h-10 lg:w-10"
                  >
                    <ChevronLeftIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to next page"
                    className="h-8 w-8 p-0 lg:h-10 lg:w-10"
                  >
                    <ChevronRightIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to last page"
                    className="h-8 w-8 p-0 lg:h-10 lg:w-10"
                  >
                    <ChevronLastIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}
