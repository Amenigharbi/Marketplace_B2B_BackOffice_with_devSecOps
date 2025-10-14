import { typesenseClient } from "../typesenseClient";

export const addOrdersBatch = async (ordersBatch: any): Promise<any> =>
  typesenseClient
    .collections("orders")
    .documents()
    .import(ordersBatch, { action: "upsert" });
