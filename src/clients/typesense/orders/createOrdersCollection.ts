import { typesenseClient } from "../typesenseClient";
import { typesenseOrdersCollectionSchema } from "../schemas/ordersCollection";

import { typesense } from "@/clients/typesense";
import { initialOrder } from "./initialOrder";

export const createOrdersCollection = async () => {
  console.info("Creating orders Collection...");

  await typesenseClient.collections().create(typesenseOrdersCollectionSchema);

  console.info("orders collection created Successfully");

  await typesense.orders.addOne(initialOrder);

  console.info("orders collection initialized Successfully");
};
