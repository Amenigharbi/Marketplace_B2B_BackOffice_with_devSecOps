import { NextResponse, type NextRequest } from "next/server";
import { logError } from "@/utils/logError";
import dayjs from "dayjs";
import { typesenseClient } from "@/clients/typesense/typesenseClient";
import {
  conflictResponse,
  internalServerErrorResponse,
  invalidRequestResponse,
} from "@/utils/responses/typesenseResponses/CollectionHandlingResponse";
import { unixTimestampToDateDMY } from "@/utils/date/unixTimestamp";
import { nucPrev } from "./nucPrev";

export const populateCollection = async (request: NextRequest) => {
  try {
    const allNucPerMonth = await typesenseClient
      .collections("orders")
      .documents()
      .search({ q: "*", sort_by: "createdAt:asc" });

    const hit: { document: any }[] = allNucPerMonth.hits || [];
    const { createdAt }: any = hit[0]?.document || {};
    const [currentMonth, currentYear] = dayjs()
      .format("MM YYYY")
      .split(" ")
      .map(Number);
    const [startDay, startMonth, startYear] = unixTimestampToDateDMY(createdAt)
      .split("-")
      .map(Number);

    for (let year = startYear; year <= currentYear; year++) {
      if (year === currentYear) {
        //for (let month = 1; currentMonth <= currentMonth; month++) {
          for (let month = 1; month <= currentMonth; month++) {  
        const uniqueCustomersPerMonth = await nucPrev(month, year);
          await createDocument(month, year, uniqueCustomersPerMonth);
        }
      } else if (year === startYear) {
        for (let month = startMonth; month <= 12; month++) {
          const uniqueCustomersPerMonth = await nucPrev(month, year);
          await createDocument(month, year, uniqueCustomersPerMonth);
        }
      } else {
        for (let month = 1; month <= 12; month++) {
          const uniqueCustomersPerMonth = await nucPrev(month, year);
          await createDocument(month, year, uniqueCustomersPerMonth);
        }
      }
      console.info(
        `NucPrevMonths Collection successfully populated. Processed ${hit.length} out of ${allNucPerMonth.found} documents.`,
      );
    }
  } catch (error: any) {
    logError(error);
    const message: string = error?.message ?? "";
    if (message.includes("Request failed with HTTP code 409")) {
      return conflictResponse();
    }
    if (message.includes("Request failed with HTTP code 400"))
      return invalidRequestResponse(message);
  }
  return internalServerErrorResponse();
};

const createDocument = async (
  month: number,
  year: number,
  uniqueCustomersPerMonth: string[],
) => {
  const data = {
    year: String(year),
    month: String(month),
    nuc: uniqueCustomersPerMonth.length,
    customersIds: uniqueCustomersPerMonth,
  };
  try {
    const response = await typesenseClient
      .collections("NucPreviousMonths")
      .documents()
      .create(data);
  } catch (error) {
    console.error("Error creating document:", error);
  }
};
