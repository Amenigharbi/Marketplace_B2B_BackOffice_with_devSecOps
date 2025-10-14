export const revalidate = 0;

import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { nooByDay } from "@/services/analytics/numberOfOrders/nooByDay";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const currentDay = searchParams.get("day");
    const storeId = searchParams.get("storeId");

    if (!currentDay) {
      return responses.invalidRequest("day Parameter is Required");
    }
    const { data, total } = await nooByDay({ currentDay, storeId });
    return NextResponse.json(
      {
        message: "success",
        total: total,
        data: data,
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
