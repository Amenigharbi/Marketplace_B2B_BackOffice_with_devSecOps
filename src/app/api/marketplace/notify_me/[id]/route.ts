import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a NotifyMe record by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const notification = await prisma.notifyMe.findUnique({
      where: { id },
      include: {
        product: true,
        customer: true,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Notification retrieved successfully", notification },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching notification:", error);
    return NextResponse.json(
      { error: "Failed to retrieve notification" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a NotifyMe record by ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const updatedNotification = await prisma.notifyMe.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      {
        message: "Notification updated successfully",
        notification: updatedNotification,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a NotifyMe record by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.notifyMe.delete({ where: { id } });

    return NextResponse.json(
      { message: "Notification deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 },
    );
  }
}
