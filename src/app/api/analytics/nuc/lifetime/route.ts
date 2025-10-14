export const revalidate = 0;

import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { nucLifetime } from "@/services/analytics/numberOfUniqueCustomers/nucLifetime";

export const GET = async (request: NextRequest) => {
  try {
    const res = await nucLifetime();
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
