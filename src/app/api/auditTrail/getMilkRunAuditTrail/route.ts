import { getAllMilkRunAuditLogs } from "@/services/delivery/getMilkRunAuditLogs/getAllMilkRunAuditLogs";
import { responses } from "@/utils/responses";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const page = searchParams.get("page");

    if (!page) {
      return responses.invalidRequest("page parameter is Required");
    }
    const MilkRunLogs = await getAllMilkRunAuditLogs(Number(page));

    return NextResponse.json(
      {
        message: "success",
        MilkRunLogs,
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
