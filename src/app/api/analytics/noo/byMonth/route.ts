export const revalidate = 0;

import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";

import { nooByMonth } from "@/services/analytics/numberOfOrders/nooByMonth";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const storeId = searchParams.get("storeId");

    if (!month) {
      return responses.invalidRequest("Month Parameter is Required");
    }
    if (!year) {
      return responses.invalidRequest("Year Parameter is Required");
    }
    const { data, total } = await nooByMonth(year, month, storeId);

    return NextResponse.json(
      {
        message: "success",
        total,
        data,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    logError(error);
    return responses.internalServerError();
  }
};
