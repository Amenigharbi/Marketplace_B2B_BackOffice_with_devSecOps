import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { logError } from "@/utils/logError";
import { NextResponse } from "next/server";

export const nucByYear = async (year: string) => {
  try {
    const nucData: any[] = [];
    let all: any[] = [];

    try {
      const searchParams = {
        filter_by: `year:=${year}`,
        q: "*",
        query_by: "year,month",
        page: 1,
        per_page: 250,
      };

      const searchResults: any = await typesenseClient
        .collections("NucPreviousMonths")
        .documents()
        .search(searchParams);

      const hits = searchResults.hits || [];
      all = hits.map((hit: any) => hit.document);

      // Sort the orders by month to maintain the correct order
      all.sort(
        (a, b) =>
          new Date(`${a.month} 1, ${a.year}`).getTime() -
          new Date(`${b.month} 1, ${b.year}`).getTime(),
      );
    } catch (error: any) {
      logError(error);
    }

    // Create an array of data with month and corresponding GMV
    all.forEach((e) => {
      nucData.push({
        month: e.month,
        nuc: e.nuc,
      });
    });

    return nucData;
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
