import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service
import { corsHeaders } from "@/utils/cors";

const prisma = new PrismaClient();
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// 🟢 GET: Retrieve all favorite partners with their related data
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    if (!customerId) {
      return new NextResponse(
        JSON.stringify({ error: "customerId query parameter is required" }),
        { status: 400, headers: corsHeaders },
      );
    }

    const favoritePartners = await prisma.favoritePartner.findMany({
      where: { customerId },
      include: {
        partner: {
          select: {
            id: true,
            username: true,
            logo: true,
            // include other partner fields you need
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        favoritePartners: favoritePartners.map((fp) => ({
          ...fp,
          id: fp.id,
          favoriteId: fp.id,
          logo: fp.partner?.logo,
          username: fp.partner?.username,
        })),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error) {
    console.error("Error fetching favorite partners:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Failed to retrieve favorite partners",
      }),
      { status: 500, headers: corsHeaders },
    );
  }
}
