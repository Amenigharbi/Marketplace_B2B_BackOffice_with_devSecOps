import { typesenseClient } from "../typesenseClient";

export const updateOrder = async (order: any): Promise<any> =>
  typesenseClient
    .collections("orders")
    .documents(order?.id)
    .update(order);
