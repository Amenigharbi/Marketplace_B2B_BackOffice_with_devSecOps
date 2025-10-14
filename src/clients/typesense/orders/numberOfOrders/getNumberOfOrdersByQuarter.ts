import { logError } from "@/utils/logError";
import { typesenseClient } from "../../typesenseClient";

export const getNumberOfOrdersByQuarter = async (
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

    const searchParams = {
      q: "",
      query_by: "*",
      filter_by: `createdAt:=[${startDate}..${endDate}]  && status:!=canceled`,
    };

    const allorders = await typesenseClient
      .collections("orders")
      .documents()
      .search(searchParams);

    return allorders.found;
  } catch (error) {
    logError(error);
  }
};
