import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { corsHeaders } from "@/utils/cors";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const skuPartnerId = searchParams.get("skuPartnerId");
    const sourceId = searchParams.get("sourceId");

    let whereClause = {};

    if (skuPartnerId && sourceId) {
      whereClause = {
        skuPartnerId: skuPartnerId,
        sourceId: sourceId,
      };
    } else if (skuPartnerId) {
      whereClause = { skuPartnerId: skuPartnerId };
    } else if (sourceId) {
      whereClause = { sourceId: sourceId };
    }

    const stocks = await prisma.stock.findMany({
      where: whereClause,
      include: {
        skuPartner: {
          include: {
            product: true,
            partner: true,
          },
        },
        source: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Stocks retrieved successfully",
        stocks,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Failed to retrieve stocks",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }
}
