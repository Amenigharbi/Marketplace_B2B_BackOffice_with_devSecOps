export const revalidate = 0;

import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { gmvLifetime } from "@/services/analytics/grossMerchandiseValue/gmvLifetime";

export const GET = async (request: NextRequest) => {
  try {
    const res = await gmvLifetime();
    return NextResponse.json(
      {
        message: "success",
        total: res?.total,
        data: res?.data,
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
