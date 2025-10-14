import { logError } from "@/utils/logError";
import { typesenseClient } from "../../typesenseClient";

export const getGmvByDay = async (
  year: number,
  month: number,
  day: number,
): Promise<number | undefined> => {
  try {
    if (month < 1 || month > 12) {
      throw new Error("Invalid month parameter");
    }
    const startOfDay =
      new Date(year, month - 1, day).getTime() + 1 * 60 * 60 * 1000;
    const endOfDay = new Date(year, month - 1, day, 24, 59, 59, 999).getTime();
    const startTimestamp = Math.floor(startOfDay);
    const endTimestamp = Math.floor(endOfDay);
    const pageSize = 250;
    let currentPage = 1;
    let allOrders: any = [];
    let totalOrders = 0;
    while (true) {
      const searchParameters = {
        filter_by: `createdAt:=[${startTimestamp}..${endTimestamp}] && status:!=canceled  && status:!=failed`,

        q: "*",
        query_by: "",
        page: currentPage,
        per_page: pageSize,
      };
      const searchResults = await typesenseClient
        .collections("orders")
        .documents()
        .search(searchParameters);
      const hits = searchResults.hits || [];
      allOrders = [...allOrders, ...hits];
      totalOrders = searchResults.found;
      if (allOrders.length >= totalOrders) {
        break;
      }
      currentPage++;
    }
    let totalGMV = 0;
    totalGMV += allOrders.reduce((sum: number, order: any) => {
      const total = order.document.total;
      if (typeof total === "number") {
        //  if(order.document.id ==79559 )
        //// if(order.document.id >=79437 && order.document.id <=79498  )
        //

        return sum + total;
      }
      return sum;
    }, 0);
    return totalGMV;
  } catch (error) {
    logError(error);
  }
};
