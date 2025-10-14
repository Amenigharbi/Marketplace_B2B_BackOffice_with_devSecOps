import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { corsHeaders } from "@/utils/cors";

const prisma = new PrismaClient();
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// 🟢 GET: Retrieve a favorite partner by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth(); // Get user session

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;

    const favoritePartner = await prisma.favoritePartner.findUnique({
      where: { id },
      include: {
        customer: true,
        partner: true,
      },
    });

    if (!favoritePartner) {
      return NextResponse.json(
        { message: "Favorite partner not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Favorite partner retrieved successfully", favoritePartner },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching favorite partner:", error);
    return NextResponse.json(
      { error: "Failed to retrieve favorite partner" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a favorite partner's details
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth(); // Get user session

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;
    const body = await req.json();

    const updatedFavoritePartner = await prisma.favoritePartner.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      {
        message: "Favorite partner updated successfully",
        favoritePartner: updatedFavoritePartner,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating favorite partner:", error);
    return NextResponse.json(
      { error: "Failed to update favorite partner" },
      { status: 500 },
    );
  }
}
// app/api/favoris_partner/[id]/route.ts
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const { customerId } = await req.json();

    if (!id || !customerId) {
      return NextResponse.json(
        { success: false, error: "ID and customerId are required" },
        { status: 400 },
      );
    }

    // Utilisez deleteMany pour plus de sécurité
    const result = await prisma.favoritePartner.deleteMany({
      where: {
        AND: [{ id }, { customerId }],
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, error: "Favorite not found or already deleted" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Favorite deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete favorite error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
