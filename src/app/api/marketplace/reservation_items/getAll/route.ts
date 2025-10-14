import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all reservation items
export async function GET(req: Request) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const reservationItems = await prisma.reservationItem.findMany({
      include: {
        reservation: true,
        product: true,
        source: true,
        partner: true,
      },
    });

    return NextResponse.json(
      { message: "Reservation items retrieved", reservationItems },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching reservation items:", error);
    return NextResponse.json(
      { error: "Failed to retrieve reservation items" },
      { status: 500 },
    );
  }
}
