import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrdersAuditTrailTableStore = create<any>(
  persist(
    (set, get) => ({
      currentPage: 1,

      reset: () => set({ currentPage: 1 }),

      setCurrentPage: (currentPage: number) => set({ currentPage }),
    }),
    {
      name: "ordersAuditTrailTableStore",
      getStorage: () => localStorage,
    },
  ),
);
