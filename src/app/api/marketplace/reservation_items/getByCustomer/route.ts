import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { corsHeaders } from "@/utils/cors";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { error: "customerId query param is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const reservationItems = await prisma.reservationItem.findMany({
      where: {
        customerId: customerId,
      },
      include: {
        product: true,
        source: true,
        Customer: true,
      },
    });

    return NextResponse.json(
      { reservationItems },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error fetching reservation items:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservation items" },
      { status: 500, headers: corsHeaders },
    );
  }
}
