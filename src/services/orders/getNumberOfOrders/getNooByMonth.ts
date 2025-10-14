import { typesense } from "@/clients/typesense";

export const getNooByMonth = (
  isoDate: string,
  storeId: string | null,
): Promise<number | undefined> =>
  typesense.orders.numberOfOrders.byMonth(isoDate, storeId);
