// src/components/customs/data-table/data-store.ts
import { create } from "zustand";

interface DataTableStoreState {
  selectedRowIds: Set<string>;
  get: () => string[];
  store: (ids: string[] | string) => void;
  clear: () => void;
  clearSelected: (ids: string[] | string) => void;
  isSelected: (id: string) => boolean;
  toggleSelected: (id: string) => void;
  getSelectionCount: () => number;
}

export const useDataTableSelectionStore = create<DataTableStoreState>(
  (set, get) => ({
    selectedRowIds: new Set(),

    get: () => Array.from(get().selectedRowIds),

    store: (ids) => {
      set((state) => {
        const newSet = new Set(state.selectedRowIds);
        if (Array.isArray(ids)) {
          ids.forEach((id) => newSet.add(id));
        } else {
          newSet.add(ids);
        }
        return { selectedRowIds: newSet };
      });
    },

    clear: () => set({ selectedRowIds: new Set() }),

    clearSelected: (ids) => {
      set((state) => {
        const newSet = new Set(state.selectedRowIds);
        if (Array.isArray(ids)) {
          ids.forEach((id) => newSet.delete(id));
        } else {
          newSet.delete(ids);
        }
        return { selectedRowIds: newSet };
      });
    },

    isSelected: (id: string) => {
      return get().selectedRowIds.has(id);
    },

    toggleSelected: (id: string) => {
      set((state) => {
        const newSet = new Set(state.selectedRowIds);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return { selectedRowIds: newSet };
      });
    },

    getSelectionCount: () => {
      return get().selectedRowIds.size;
    },
  })
);
