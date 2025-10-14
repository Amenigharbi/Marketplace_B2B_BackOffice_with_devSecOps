import { Order } from "@/types/order";
import { typesenseClient } from "../typesenseClient";
import { logError } from "@/utils/logError";

// Utility function to convert a date string (YYYY-MM-DD) to Unix timestamp (milliseconds)
const convertDateToTimestamp = (dateStr: string): number => {
  const date = new Date(dateStr);
  return date.getTime();
};

export const getManyOrders = async ({
  sortBy,
  page,
  perPage,
  search,
  filterBy,
}: any): Promise<any> => {
  try {
    let searchQuery = search || "";
    let filterQuery = filterBy || "";

    let deliveryDateTimestamp: number | null = null;

    if (searchQuery != "") {
      searchQuery = `"${searchQuery}"`;
    }
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (datePattern.test(search)) {
      deliveryDateTimestamp = convertDateToTimestamp(search) / 1000;
      searchQuery = "";
    }

    let finalFilterQuery = filterQuery;

    if (deliveryDateTimestamp !== null) {
      finalFilterQuery +=
        (finalFilterQuery ? " && " : "") +
        `deliveryDate:=${deliveryDateTimestamp}`;
    }
    finalFilterQuery = filterBy.replace(/, /g, " && ");
    const searchParams = {
      q: searchQuery,
      query_by:
        "customerFirstname,customerLastname,kamiounId,orderId,incrementId,productsNames,items.sku,deliveryAgentName",
      page: page || 1,
      per_page: perPage || 250,
      sort_by: sortBy || "",
      filter_by: finalFilterQuery || "",
    };

    //
    const typesenseResponse = await typesenseClient
      .collections("orders")
      .documents()
      .search(searchParams);

    const orders: Order[] = createOrdersList(typesenseResponse?.hits);

    return {
      orders,
      count: typesenseResponse.found,
    };
  } catch (error) {
    logError(error);
  }
};

const createOrdersList = (typesenseHits: any): Order[] =>
  typesenseHits.map(({ document }: any): Order => document);
