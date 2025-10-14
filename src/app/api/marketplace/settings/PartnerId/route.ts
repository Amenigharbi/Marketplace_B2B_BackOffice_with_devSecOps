// app/api/settings/create/route.ts
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

export async function GET(
  req: Request,
  { params }: { params: { partnerId: string } },
) {
  const { partnerId } = params;

  try {
    const partnerSettings = await prisma.settings.findFirst({
      where: {
        partnerId: partnerId,
      },
      include: {
        schedules: true,
      },
    });

    if (!partnerSettings) {
      return NextResponse.json(
        {
          message: "No settings found for this partner",
          settings: null,
        },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      {
        message: "Partner settings retrieved successfully",
        settings: partnerSettings,
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error: any) {
    console.error("Error fetching partner settings:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve partner settings",
        message: error.message,
      },
      { status: 500, headers: corsHeaders },
    );
  } finally {
    await prisma.$disconnect();
  }
}
