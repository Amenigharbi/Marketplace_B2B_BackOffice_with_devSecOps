import { NextResponse, type NextRequest } from "next/server";
import { logError } from "@/utils/logError";
import { typesenseClient } from "@/clients/typesense/typesenseClient";

type GmvDocument = {
  gmv: number;
  id: string;
  month: string;
  year: string;
};

type SearchResult = {
  hits?: Array<{ document: GmvDocument }>;
};

type DataType = {
  month: string;
  gmv: number;
};

export const gmvByYear = async (year: number) => {
  try {
    const gmvData: DataType[] = [];
    let allOrders: GmvDocument[] = [];

    try {
      const searchParams = {
        filter_by: `year:=${year}`,
        q: "*",
        query_by: "year,month",
        page: 1,
        per_page: 250,
      };

      const searchResults: any = await typesenseClient
        .collections("gmvPreviousMonths")
        .documents()
        .search(searchParams);

      const hits = searchResults.hits || [];
      allOrders = hits.map((hit: any) => hit.document);

      // Sort the orders by month to maintain the correct order
      allOrders.sort(
        (a, b) =>
          new Date(`${a.month} 1, ${a.year}`).getTime() -
          new Date(`${b.month} 1, ${b.year}`).getTime(),
      );
    } catch (error: any) {
      logError(error);
    }

    // Create an array of data with month and corresponding GMV
    allOrders.forEach((order) => {
      gmvData.push({
        month: order.month,
        gmv: order.gmv,
      });
    });
    const total = gmvData.reduce((total, current) => total + current.gmv, 0);

    return { gmvData, total };
  } catch (error: unknown) {
    if (error instanceof Error) {
      logError(`Error fetching GMV per year data: ${error.message}`);
    } else {
      logError("Unknown error fetching GMV per year data");
    }
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
};
