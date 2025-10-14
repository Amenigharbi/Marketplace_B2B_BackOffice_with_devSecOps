import { typesenseClient } from "@/clients/typesense/typesenseClient";

export async function getNooForEachHourOfTheDay({ date, storeId }: any) {
  const [day, month, year] = date.split("-").map(Number);
  const resultTable = [];

  for (let index = 0; index < 24; index++) {
    const startHour = new Date(year, month - 1, day, index, 0, 0).getTime();
    const endHour = new Date(year, month - 1, day, index, 59, 59).getTime();
    const startTimestamp = Math.floor(startHour);
    const endTimestamp = Math.floor(endHour);
    resultTable.push([startTimestamp, endTimestamp]);
  }

  const allOrdersTable = await Promise.all(
    resultTable.map(async (item) => {
      const startTimestamp = item[0];
      const endTimestamp = item[1];

      let searchParamsObj;
      if (storeId) {
        searchParamsObj = {
          filter_by: `createdAt:=[${startTimestamp}..${endTimestamp}] && state:!=canceled && storeId :=${storeId}`,
          q: "*",
          query_by: "",
        };
      } else {
        searchParamsObj = {
          filter_by: `createdAt:=[${startTimestamp}..${endTimestamp}] && state:!=canceled`,
          q: "*",
          query_by: "",
        };
      }

      const response = await typesenseClient
        .collections("orders")
        .documents()
        .search(searchParamsObj);

      return response.found;
    }),
  );

  return allOrdersTable;
}
