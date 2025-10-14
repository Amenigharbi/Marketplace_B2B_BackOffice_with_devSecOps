export const revalidate = 0;

import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";

import { nooLifetime } from "@/services/analytics/numberOfOrders/nooLifetime";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");

    const { data, total } = await nooLifetime(storeId);
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
