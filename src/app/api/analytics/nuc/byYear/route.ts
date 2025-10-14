export const revalidate = 0;

import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { nucByYear } from "@/services/analytics/numberOfUniqueCustomers/nucByYear";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const year = searchParams.get("year");

    if (!year) {
      return responses.invalidRequest("year Parameter is Required");
    }
    const res = await nucByYear(year);

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
