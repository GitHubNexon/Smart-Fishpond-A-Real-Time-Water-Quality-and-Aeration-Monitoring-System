//src/components/customs/combobox/useComboBox.tsx
"use client";

import * as React from "react";

interface UseComboBoxProps<T> {
  options: T[];
  value?: T | T[];
  onSelect?: (item: T | T[] | null) => void;
  searchKey: (keyof T)[];
  isMulti: boolean;
  open?: boolean;
}

export function useComboBox<T>({
  options,
  value,
  onSelect,
  searchKey,
  isMulti,
  open,
}: UseComboBoxProps<T>) {
  const [isOpen, setIsOpen] = React.useState(open ?? false);
  const [search, setSearch] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    return options.filter((opt) =>
      searchKey.some((key) =>
        String((opt as any)[key])
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [search, options, searchKey]);

  const handleSelect = (opt: T) => {
    if (isMulti) {
      const arr = Array.isArray(value) ? [...value] : [];
      const exists = arr.find((v) => (v as any).id === (opt as any).id);
      let newVal;
      if (exists) {
        newVal = arr.filter((v) => (v as any).id !== (opt as any).id);
      } else {
        newVal = [...arr, opt];
      }
      onSelect?.(newVal);
    } else {
      onSelect?.(opt);
      setIsOpen(false);
    }
  };

  const isSelected = (opt: T) => {
    if (isMulti && Array.isArray(value)) {
      return value.some((v) => (v as any).id === (opt as any).id);
    }
    if (!isMulti && value) {
      return (value as any).id === (opt as any).id;
    }
    return false;
  };

  const clearSelection = () => {
    onSelect?.(isMulti ? [] : null);
  };

  return {
    isOpen,
    setIsOpen,
    search,
    setSearch,
    filteredOptions,
    handleSelect,
    isSelected,
    clearSelection,
  };
}
