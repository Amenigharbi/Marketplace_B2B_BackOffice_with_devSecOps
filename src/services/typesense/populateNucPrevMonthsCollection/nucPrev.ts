import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { logError } from "@/utils/logError";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday);
export const nucPrev = async (month: number, year: number) => {
  try {
    const specificMonth = dayjs(`${year}-${month}`);
    let startDate = specificMonth.startOf("month").unix() * 1000;
    let endDate = specificMonth.endOf("month").unix() * 1000;

    const pageSize = 250;
    let currentPage = 1;
    let allOrders: string[] = [];
    let totalOrders = 0;

    while (true) {
      const searchParameters = {
        filter_by: `createdAt:=[${startDate}..${endDate}]`,
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

      allOrders = allOrders.concat(
        hits.map((hit: any) => hit.document.customerId),
      );
      totalOrders = searchResults.found;

      if (allOrders.length >= totalOrders) {
        break;
      }
      currentPage++;
    }

    const uniqueCustomerIds = new Set(
      allOrders.map((customer: string) => customer),
    );

    return Array.from(uniqueCustomerIds);
  } catch (error: unknown) {
    logError("Error fetching nuc per year data:");
    return [];
  }
};
