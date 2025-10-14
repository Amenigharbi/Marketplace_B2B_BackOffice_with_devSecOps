import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTomorrowIsoDate } from "@/utils/date/getTomorrowIsoDate";

export const useMilkRunStore: any = create(
  persist(
    (set) => ({
      deliverySlot: "",
      deliveryAgentId: "",
      selectedOrdersIds: [],
      deliveryAgentName: "",
      deliveryDate: getTomorrowIsoDate(),

      reset: () =>
        set({
          deliverySlot: "",
          deliveryAgentId: "",
          selectedOrdersIds: [],
          deliveryAgentName: "",
        }),

      setDeliveryAgentName: (deliveryAgentName: string) =>
        set({ deliveryAgentName }),

      setSelectedOrdersIds: (selectedOrdersIds: string[]) =>
        set({ selectedOrdersIds }),

      setDeliverySlot: (deliverySlot: string) => set({ deliverySlot }),
      setDeliveryDate: (deliveryDate: number) => set({ deliveryDate }),
      setDeliveryAgentId: (deliveryAgentId: string) => set({ deliveryAgentId }),
    }),
    {
      name: "milkRunStore",
      getStorage: () => localStorage,
    },
  ),
);
