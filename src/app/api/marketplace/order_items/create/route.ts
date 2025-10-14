import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 POST: Create a new order item
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const newOrderItem = await prisma.orderItem.create({
      data: {
        qteOrdered: body.qteOrdered,
        qteRefunded: body.qteRefunded || 0,
        qteShipped: body.qteShipped || 0,
        qteCanceled: body.qteCanceled || 0,
        discountedPrice: body.discountedPrice,
        weight: body.weight,
        sku: body.sku,
        orderId: body.orderId,
        productId: body.productId,
      },
    });

    return NextResponse.json(
      { message: "Order item created", orderItem: newOrderItem },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating order item:", error);
    return NextResponse.json(
      { error: "Failed to create order item" },
      { status: 500 },
    );
  }
}
