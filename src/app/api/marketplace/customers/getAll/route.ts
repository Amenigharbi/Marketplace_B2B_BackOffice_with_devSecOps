import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const customers = await prisma.customers.findMany({
      include: {
        favoriteProducts: true,
        favoritePartners: true,
        orders: true,
        reservations: true,
        notifications: true,
      },
    });

    if (customers.length === 0) {
      return NextResponse.json(
        { message: "No customers found", customers: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Customers retrieved successfully", customers },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to retrieve customers" },
      { status: 500 },
    );
  }
}
