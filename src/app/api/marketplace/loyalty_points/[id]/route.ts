import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a single LoyaltyPoints entry by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const loyaltyPoint = await prisma.loyaltyPoints.findUnique({
      where: { id },
      include: {
        order: true,
      },
    });

    if (!loyaltyPoint) {
      return NextResponse.json(
        { message: "LoyaltyPoints not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "LoyaltyPoints retrieved successfully", loyaltyPoint },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching loyalty point:", error);
    return NextResponse.json(
      { error: "Failed to retrieve loyalty points" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update LoyaltyPoints details
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const updatedLoyaltyPoints = await prisma.loyaltyPoints.update({
      where: { id },
      data: {
        ptsNumber: body.ptsNumber,
        ptsValue: body.ptsValue,
        minAmount: body.minAmount,
        orderId: body.orderId,
      },
    });

    return NextResponse.json(
      {
        message: "LoyaltyPoints updated successfully",
        loyaltyPoints: updatedLoyaltyPoints,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating loyalty points:", error);
    return NextResponse.json(
      { error: "Failed to update loyalty points" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a LoyaltyPoints entry by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.loyaltyPoints.delete({ where: { id } });

    return NextResponse.json(
      { message: "LoyaltyPoints deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting loyalty points:", error);
    return NextResponse.json(
      { error: "Failed to delete loyalty points" },
      { status: 500 },
    );
  }
}
