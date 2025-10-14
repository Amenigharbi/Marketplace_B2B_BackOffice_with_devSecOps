import { logError } from "@/utils/logError";
import { typesenseClient } from "../../typesenseClient";

export const getGmvByQuarter = async (
  yearArg: number,
  quarter: string,
): Promise<number | undefined> => {
  try {
    const year = Number(yearArg);

    const quarterMonths: { [key: string]: [number, number] } = {
      Q1: [0, 2],
      Q2: [3, 5],
      Q3: [6, 8],
      Q4: [9, 11],
    };

    const selectedQuarter = quarterMonths[quarter];
    if (!selectedQuarter) {
      throw new Error("Invalid quarter parameter");
    }

    const [startMonth, endMonth] = selectedQuarter;

    const startDate = Math.floor(new Date(year, startMonth, 1).getTime());
    const endDate = Math.floor(
      new Date(year, endMonth + 1, 0, 23, 59, 59).getTime(),
    );

    const pageSize = 250;
    let currentPage = 1;
    let allOrders: any = [];
    let totalOrders = 0;
    while (true) {
      const searchParameters = {
        filter_by: `createdAt:=[${startDate}..${endDate}] && status :!= canceled `,

        //  filter_by: `createdAt:=[${startDate}..${endDate}] && state :!= canceled `,
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
