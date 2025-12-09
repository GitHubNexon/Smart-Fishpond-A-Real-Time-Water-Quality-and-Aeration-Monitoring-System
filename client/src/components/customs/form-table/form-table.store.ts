// ============================================
// FILE: form-table.store.ts
// ============================================

import { create } from 'zustand';

interface TableSelectionState {
  selectedRowIds: Set<string>;
  toggleRowSelection: (id: string) => void;
  toggleAllRows: (ids: string[]) => void;
  clearSelections: () => void;
  isSelected: (id: string) => boolean;
}

export const useTableSelectionStore = create<TableSelectionState>(
  (set, get) => ({
    selectedRowIds: new Set(),

    toggleRowSelection: (id: string) => {
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

    toggleAllRows: (ids: string[]) => {
      const currentSelected = get().selectedRowIds;
      const allSelected = ids.every((id) => currentSelected.has(id));

      set((state) => {
        const newSet = new Set(state.selectedRowIds);
        if (allSelected) {
          ids.forEach((id) => newSet.delete(id));
        } else {
          ids.forEach((id) => newSet.add(id));
        }
        return { selectedRowIds: newSet };
      });
    },

    clearSelections: () => set({ selectedRowIds: new Set() }),

    isSelected: (id: string) => get().selectedRowIds.has(id),
  }),
);
