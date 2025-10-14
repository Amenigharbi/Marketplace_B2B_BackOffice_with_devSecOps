import { typesenseClient } from "../typesenseClient";

export const deleteOrdersCollection = async (): Promise<any> =>
  typesenseClient.collections("orders").delete();
