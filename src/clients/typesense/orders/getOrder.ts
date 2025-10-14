import { Order } from "@/types/order";
import { typesenseClient } from "../typesenseClient";
import { logError } from "@/utils/logError";

export const getOrder = async (
  id: string,
): Promise<{ id: string } | undefined> => {
  try {
    const searchParams = {
      filter_by: "id:=" + id,
      q: "",
      query_by: "*",
      page: 1,
      perPage: 1,
    };

    const typesenseResponse = await typesenseClient
      .collections("orders")
      .documents()
      .search(searchParams);

    const hits = typesenseResponse?.hits || [];
    const order: Order = hits[0]?.document as Order;

    return order;
  } catch (error) {
    logError(error);
  }
};
