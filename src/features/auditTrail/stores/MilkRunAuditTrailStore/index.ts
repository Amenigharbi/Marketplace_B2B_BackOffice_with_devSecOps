import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMilkRunAuditTrailTableStore = create<any>(
  persist(
    (set, get) => ({
      currentPage: 1,
      itemsPerPage: 250,

      reset: () => set({ currentPage: 1, itemsPerPage: 250 }),

      setCurrentPage: (currentPage: number) => set({ currentPage }),
      setItemsPerPage: (itemsPerPage: number) => set({ itemsPerPage }),
    }),
    {
      name: "MilkRunAuditTrailTableStore",
      getStorage: () => localStorage,
    },
  ),
);
