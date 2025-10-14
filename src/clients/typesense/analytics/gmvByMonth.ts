import { NextResponse } from "next/server";
import { logError } from "@/utils/logError";
import { typesenseClient } from "@/clients/typesense/typesenseClient";

type DataType = {
  Days: string[];
  gmv: number[];
};

type GmvDayDocument = {
  gmv: number;
  id: string;
  day: string;
  month: string;
  year: string;
};

type SearchResult = {
  hits: Array<{ document: GmvDayDocument }>;
};

export const getgmvByMonthAnalytics = async (year: string, month: string) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    let Days = Array.from({ length: daysInMonth }, (_, i) =>
      (i + 1).toString(),
    );

    if (parseInt(year) === currentYear && parseInt(month) === currentMonth) {
      Days = Days.slice(0, currentDate.getDate());
    }

    let gmv: number[] = [];

    try {
      const searchParams = {
        filter_by: `year:=${year} && month:=${month}`,
        q: "*",
        query_by: "year,month,day",
        page: 1,
        per_page: 31,
      };

      const searchResults = (await typesenseClient
        .collections("gmvPreviousDays")
        .documents()
        .search(searchParams)) as SearchResult;

      const hits = searchResults.hits || [];

      const gmvMap = new Map(
        hits.map((hit) => [hit.document.day, hit.document.gmv]),
      );

      gmv = Days.map((day) => gmvMap.get(day) || 0);
    } catch (error: any) {
      logError(error);
    }

    const data: DataType = {
      Days,
      gmv,
    };

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logError(`Error fetching gmv per month data: ${error.message}`);
    } else {
      logError("Unknown error fetching gmv per month data");
    }
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
};
