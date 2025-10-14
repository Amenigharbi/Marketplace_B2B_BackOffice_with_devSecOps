import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all order items
export async function GET(req: Request) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const orderItems = await prisma.orderItem.findMany({
      include: {
        order: true,
        product: true,
      },
    });

    return NextResponse.json(
      { message: "Order items retrieved", orderItems },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching order items:", error);
    return NextResponse.json(
      { error: "Failed to retrieve order items" },
      { status: 500 },
    );
  }
}
