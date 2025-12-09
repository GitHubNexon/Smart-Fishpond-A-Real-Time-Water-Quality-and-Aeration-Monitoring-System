// src/components/customs/kanban/data-store.ts
import { create } from 'zustand';

interface KanbanStoreState {
  selectedItemIds: Set<string>;
  get: () => string[];
  store: (ids: string[] | string) => void;
  clear: () => void;
  clearSelected: (ids: string[] | string) => void;
  isSelected: (id: string) => boolean;
  toggleSelected: (id: string) => void;
  getSelectionCount: () => number;
}

export const useKanbanSelectionStore = create<KanbanStoreState>((set, get) => ({
  selectedItemIds: new Set(),

  get: () => Array.from(get().selectedItemIds),

  store: (ids) => {
    set((state) => {
      const newSet = new Set(state.selectedItemIds);
      if (Array.isArray(ids)) {
        ids.forEach((id) => newSet.add(id));
      } else {
        newSet.add(ids);
      }
      return { selectedItemIds: newSet };
    });
  },

  clear: () => set({ selectedItemIds: new Set() }),

  clearSelected: (ids) => {
    set((state) => {
      const newSet = new Set(state.selectedItemIds);
      if (Array.isArray(ids)) {
        ids.forEach((id) => newSet.delete(id));
      } else {
        newSet.delete(ids);
      }
      return { selectedItemIds: newSet };
    });
  },

  isSelected: (id: string) => {
    return get().selectedItemIds.has(id);
  },

  toggleSelected: (id: string) => {
    set((state) => {
      const newSet = new Set(state.selectedItemIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { selectedItemIds: newSet };
    });
  },

  getSelectionCount: () => {
    return get().selectedItemIds.size;
  },
}));
