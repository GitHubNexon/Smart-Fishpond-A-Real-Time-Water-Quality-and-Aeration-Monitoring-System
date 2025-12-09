//src/components/customs/combobox/combo-box.component.tsx
'use client';

import * as React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useComboBox } from './useComboBox';

export interface ComboBoxProps<T> {
  loading?: boolean;
  open?: boolean;
  value?: T | T[];
  label?: string;
  onSelect?: (item: T | T[] | null) => void;
  isClearable?: boolean;
  isMulti?: boolean;
  searchKey?: (keyof T)[];
  icon?: React.ReactNode;
  placeholder?: string;
  popoverPosition?: 'top' | 'bottom' | 'left' | 'right';
  width?: string;
  options: T[];
  getOptionLabel?: (item: T) => string;
}

export function ComboBox<T extends { id: string | number }>({
  loading,
  open,
  value,
  label,
  onSelect,
  isClearable = false,
  isMulti = false,
  searchKey = [],
  icon,
  placeholder = 'Select...',
  popoverPosition = 'bottom',
  width = 'min-w-full',
  options,
  getOptionLabel,
}: ComboBoxProps<T>) {
  const {
    isOpen,
    setIsOpen,
    search,
    setSearch,
    filteredOptions,
    handleSelect,
    isSelected,
    clearSelection,
  } = useComboBox<T>({
    options,
    value,
    onSelect,
    searchKey,
    isMulti,
    open,
  });

  const displayLabel = React.useCallback(
    (item: T) => {
      if (getOptionLabel) return getOptionLabel(item);
      if (searchKey.length > 0) return (item as any)[searchKey[0]];
      return (item as any).id;
    },
    [getOptionLabel, searchKey],
  );

  return (
    <div className={cn('flex flex-col gap-2', width)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'flex items-center justify-between rounded-md border px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              width,
            )}
          >
            <div className="flex items-center gap-2 truncate">
              {icon && <span className="shrink-0">{icon}</span>}
              {/* <span className="truncate">
                {Array.isArray(value) && value.length > 0
                  ? value.map((v) => (v as any)[searchKey[0]]).join(', ')
                  : value
                  ? (value as any)[searchKey[0]]
                  : placeholder}
              </span> */}
              <span className="truncate">
                {Array.isArray(value) && value.length > 0
                  ? value.map((v) => displayLabel(v as T)).join(', ')
                  : value
                  ? displayLabel(value as T)
                  : placeholder}
              </span>
            </div>
            {isClearable &&
              value &&
              ((Array.isArray(value) && value.length > 0) ||
                !Array.isArray(value)) && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  className="ml-2 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  ✕
                </span>
              )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          side={popoverPosition}
          align="start"
          className={cn('p-0 w-[var(--radix-popover-trigger-width)]', width)}
        >
          {loading ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/4" />
            </div>
          ) : (
            <Command>
              <CommandInput
                value={search}
                onValueChange={setSearch}
                placeholder="Search..."
              />
              <CommandList className="max-h-60 overflow-y-auto">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map((opt) => (
                    // <CommandItem
                    //   key={opt.id}
                    //   value={(opt as any)[searchKey[0]]}
                    //   onSelect={() => handleSelect(opt)}
                    // >
                    //   <span className={cn(isSelected(opt) && "font-bold")}>
                    //     {searchKey.map((k) => (opt as any)[k]).join(" - ")}
                    //   </span>
                    // </CommandItem>
                    <CommandItem
                      key={opt.id}
                      value={searchKey.map((k) => (opt as any)[k]).join(' ')} // Include all search keys
                      onSelect={() => handleSelect(opt)}
                    >
                      {/* <span className={cn(isSelected(opt) && 'font-bold')}>
                        {searchKey.map((k) => (opt as any)[k]).join(' - ')}
                      </span> */}
                      <span
                        className={cn(
                          isSelected(opt) ? 'font-bold' : 'text-red-500',
                        )}
                      >
                        {displayLabel(opt)}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
