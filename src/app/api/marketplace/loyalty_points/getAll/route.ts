import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all Loyalty Points
export async function GET() {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const loyaltyPoints = await prisma.loyaltyPoints.findMany({
      include: {
        order: true,
      },
    });

    if (loyaltyPoints.length === 0) {
      return NextResponse.json(
        { message: "No loyalty points found", loyaltyPoints: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Loyalty points retrieved successfully", loyaltyPoints },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching loyalty points:", error);
    return NextResponse.json(
      { error: "Failed to retrieve loyalty points" },
      { status: 500 },
    );
  }
}
