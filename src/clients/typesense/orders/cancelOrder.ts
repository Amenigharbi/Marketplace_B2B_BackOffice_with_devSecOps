import { typesenseClient } from "../typesenseClient";

export const cancelOrder = async (orderId: any): Promise<any> =>
  typesenseClient
    .collections("orders")
    .documents(orderId)
    .update({ status: "failed", state: "canceled" });
