import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 POST: Create a new NotifyMe record
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Ensure the product and customer exist before creating the record
    const productExists = await prisma.product.findUnique({
      where: { sku: body.productSku },
    });
    const customerExists = await prisma.customers.findUnique({
      where: { id: body.customerId },
    });

    if (!productExists || !customerExists) {
      return NextResponse.json(
        { message: "Product or Customer not found" },
        { status: 404 },
      );
    }

    const newNotification = await prisma.notifyMe.create({
      data: {
        clientName: body.clientName,
        productSku: body.productSku,
        customerId: body.customerId,
      },
    });

    return NextResponse.json(
      {
        message: "Notification created successfully",
        notification: newNotification,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 },
    );
  }
}
