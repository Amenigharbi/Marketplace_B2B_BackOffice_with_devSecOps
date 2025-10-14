import { logError } from "@/utils/logError";
import { typesenseClient } from "../../typesenseClient";

export const getGmvByMonth = async (
  yearArg: number,
  monthArg: number,
): Promise<number | undefined> => {
  try {
    const year = Number(yearArg);
    const month = Number(monthArg);

    if (month < 1 || month > 12) {
      throw new Error("Invalid month parameter");
    }

    const startDate = Math.floor(new Date(year, month - 1, 1).getTime());
    const endDate = Math.floor(new Date(year, month, 0, 23, 59, 59).getTime());

    const pageSize = 250;
    let currentPage = 1;
    let allOrders: any = [];
    let totalOrders = 0;
    while (true) {
      const searchParameters = {
        filter_by: `createdAt:=[${startDate}..${endDate}] && status:!=canceled`,
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
        return sum + total;
      }
      return sum;
    }, 0);

    return totalGMV;
  } catch (error) {
    logError(error);
  }
};
