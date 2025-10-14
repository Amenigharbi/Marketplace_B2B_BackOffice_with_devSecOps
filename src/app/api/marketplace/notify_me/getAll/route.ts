import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notifyMe.findMany({
      include: {
        product: true,
        customer: true,
      },
    });

    if (notifications.length === 0) {
      return NextResponse.json(
        { message: "No notifications found", notifications: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Notifications retrieved successfully", notifications },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to retrieve notifications" },
      { status: 500 },
    );
  }
}
