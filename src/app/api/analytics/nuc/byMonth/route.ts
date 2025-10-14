export const revalidate = 0;

import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { nucByMonth } from "@/services/analytics/numberOfUniqueCustomers/nucByMonth";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const date = searchParams.get("date");

    if (!date) {
      return responses.invalidRequest("Date Parameter is Required");
    }
    const res = await nucByMonth(date);
    return NextResponse.json(
      {
        message: "success",
        data: res,
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
