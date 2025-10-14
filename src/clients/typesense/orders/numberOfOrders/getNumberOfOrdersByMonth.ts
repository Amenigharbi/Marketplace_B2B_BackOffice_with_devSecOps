import { logError } from "@/utils/logError";
import { typesenseClient } from "../../typesenseClient";

export const getNumberOfOrdersByMonth = async (
  isoDate: string,
  storeId: string | null,
): Promise<number | undefined> => {
  try {
    const [year, month] = isoDate.split("-").map(Number);
    const startTime = new Date(year, month - 1, 1).getTime();
    const endTime = new Date(year, month, 0, 23, 59, 59).getTime();

    const startTimestamp = Math.floor(startTime);
    const endTimestamp = Math.floor(endTime);

    let searchParams;

    if (storeId) {
      searchParams = {
        q: "",
        query_by: "*",
        filter_by: `createdAt:=[${startTimestamp}..${endTimestamp}]  && status:!=canceled && storeId:=${storeId}`,
      };
    } else {
      searchParams = {
        q: "",
        query_by: "*",
        filter_by: `createdAt:=[${startTimestamp}..${endTimestamp}]  && status:!=canceled`,
      };
    }

    const allorders = await typesenseClient
      .collections("orders")
      .documents()
      .search(searchParams);

    return allorders.found;
  } catch (error) {
    logError(error);
  }
};
