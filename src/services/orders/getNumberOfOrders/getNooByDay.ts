import { typesense } from "@/clients/typesense";

export const getNooByDay = (
  isoDate: string,
  storeId: string | null,
): Promise<number | undefined> =>
  typesense.orders.numberOfOrders.byDay(isoDate, storeId);
