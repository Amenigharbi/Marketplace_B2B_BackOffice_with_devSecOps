import { logError } from "@/utils/logError";
import { typesenseClient } from "../../typesenseClient";

export const getNumberOfOrdersByDay = async (
  isoDate: string,
  storeId: string | null,
): Promise<number | undefined> => {
  try {
    const [year, month, day] = isoDate.split("-").map(Number);

    const startOfDay = new Date(year, month - 1, day).getTime() + (1 * 60 * 60 * 1000);
    const endOfDay = new Date(year, month - 1, day, 24, 59, 59, 999).getTime();

    const startTimestamp = Math.floor(startOfDay);
    const endTimestamp = Math.floor(endOfDay);
    let searchParams;

    if (storeId) {
      searchParams = {
        q: "",
        query_by: "*",
        page: 1,
        per_page: 1,
        filter_by: `createdAt:=[${startTimestamp}..${endTimestamp}]  && status:!=canceled && status:!=failed &&  storeId :=${storeId}`,
      };
    } else {
      searchParams = {
        q: "",
        query_by: "*",
        page: 1,
        per_page: 1,
        filter_by: `createdAt:=[${startTimestamp}..${endTimestamp}]  && status:!=canceled && status:!=failed `,
      };
    }

    const { found } = await typesenseClient
      .collections("orders")
      .documents()
      .search(searchParams);

    return found;
  } catch (error) {
    logError(error);
  }
};
