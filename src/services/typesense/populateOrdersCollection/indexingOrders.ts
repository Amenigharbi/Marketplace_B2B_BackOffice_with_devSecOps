import { getOrdersBatch } from "./getOrdersBatch";
import { typesense } from "@/clients/typesense";

export const indexingOrders = async (magentoOrders: any, callback: any) => {
  try {
    const ordersBatch = getOrdersBatch(magentoOrders);

    await typesense.orders.addMany(ordersBatch);

    callback();
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
    callback(err);
  }
};
