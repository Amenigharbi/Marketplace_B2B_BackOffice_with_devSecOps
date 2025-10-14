import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 POST: Create a new LoyaltyPoints entry
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const newLoyaltyPoints = await prisma.loyaltyPoints.create({
      data: {
        ptsNumber: body.ptsNumber,
        ptsValue: body.ptsValue,
        minAmount: body.minAmount,
        orderId: body.orderId,
      },
    });

    return NextResponse.json(
      {
        message: "LoyaltyPoints created successfully",
        loyaltyPoints: newLoyaltyPoints,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating loyalty points:", error);
    return NextResponse.json(
      { error: "Failed to create loyalty points" },
      { status: 500 },
    );
  }
}
