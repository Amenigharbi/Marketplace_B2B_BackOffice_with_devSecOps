export const revalidate = 0;

import { getAllLogs } from "@/services/logs/getAllLogs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const logs = await getAllLogs();

    return NextResponse.json(
      {
        message: "success",
        logs,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch logs" },
      { status: 500 },
    );
  }
};
