import { getAllOrdersLogs } from "@/services/orders/getOrdersLogs/getAllOrdersLogs";
import { responses } from "@/utils/responses";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const page = searchParams.get("page");

    if (!page) {
      return responses.invalidRequest("page parameter is Required");
    }
    const { ordersLogs, count } = await getAllOrdersLogs(Number(page));

    return NextResponse.json(
      {
        message: "success",
        count,
        ordersLogs,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch ordersLogs" },
      { status: 500 },
    );
  }
};
