import { NextResponse } from "next/server";
import { getMetrics } from "@/libs/metrics";

export async function GET() {
  try {
    const metrics = await getMetrics();
    return new NextResponse(metrics, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    return new NextResponse("Error generating metrics", { status: 500 });
  }
}
