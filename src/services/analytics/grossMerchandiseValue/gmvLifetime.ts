import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { logError } from "@/utils/logError";

type QuarterDataType = {
  quarter: string;
  gmv: number;
};

const gmvByQuarterAnalytics = async (year: number) => {
  const quarterMonths: { [key: string]: [number, number] } = {
    Q1: [0, 2],
    Q2: [3, 5],
    Q3: [6, 8],
    Q4: [9, 11],
  };

  const list: QuarterDataType[] = [];

  for (const quarter in quarterMonths) {
    const [startMonth, endMonth] = quarterMonths[quarter];
    let totalGmvForQuarter = 0;

    for (let monthIndex = startMonth; monthIndex <= endMonth; monthIndex++) {
      try {
        const searchParams = {
          filter_by: `month:=[${monthIndex + 1}] && year:=[${year}]`,
          q: "*",
          query_by: "year,month",
          page: 1,
          per_page: 250,
        };

        const searchResults = await typesenseClient
          .collections("gmvPreviousMonths")
          .documents()
          .search(searchParams);

        const hits = searchResults.hits || [];
        const gmvForMonth = hits.reduce(
          (sum: number, hit: any) => sum + hit.document.gmv,
          0,
        );
        totalGmvForQuarter += gmvForMonth;
      } catch (error: any) {
        logError(error);
      }
    }

    list.push({ quarter: quarter + "-" + year, gmv: totalGmvForQuarter });
  }

  return list;
};

export const gmvLifetime = async () => {
  const startYear = 2020;
  const endYear = new Date().getFullYear();

  const lifetimeList: any[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const yearlyAnalytics = await gmvByQuarterAnalytics(year);

    lifetimeList.push(...yearlyAnalytics);
  }

  const total = lifetimeList.reduce((total, current) => total + current.gmv, 0);

  return { data: lifetimeList, total };
};
