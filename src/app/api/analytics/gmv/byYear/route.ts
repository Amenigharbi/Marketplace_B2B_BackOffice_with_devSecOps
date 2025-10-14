export const revalidate = 0;

import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { gmvByYear } from "@/services/analytics/grossMerchandiseValue/gmvByYear";
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const yearString = searchParams.get("year");

    if (!yearString) {
      return responses.invalidRequest("Date Parameter is Required");
    }

    const year = parseInt(yearString, 10);

    const res = await gmvByYear(year);
    return NextResponse.json(
      {
        message: "success",
        //@ts-ignore
        total: res?.total,
        //@ts-ignore
        data: res?.gmvData,
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
