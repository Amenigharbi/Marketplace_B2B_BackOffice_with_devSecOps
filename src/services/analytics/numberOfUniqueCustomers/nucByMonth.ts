import { responses } from "@/utils/responses";
import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { logError } from "@/utils/logError";
import dayjs from "dayjs";

export const nucByMonth = async (date: string) => {
  try {
    const [year, month] = date.split("-").map(Number);
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
    return {
      NumberOfUniqueCustomer: uniqueCustomerIds.size,
      month: month,
      year: year,
    };
  } catch (error) {
    logError(error);
    return responses.internalServerError();
  }
};
