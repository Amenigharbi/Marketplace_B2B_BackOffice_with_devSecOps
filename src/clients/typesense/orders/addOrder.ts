import { typesenseClient } from "../typesenseClient";

export const addOrder = async (order: any): Promise<any> =>
  typesenseClient.collections("orders").documents().create(order);
