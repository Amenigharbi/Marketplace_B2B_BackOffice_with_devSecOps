import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { corsHeaders } from "@/utils/cors";
const prisma = new PrismaClient();
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// 🟢 POST: Create a new reservation item
export async function POST(req: Request) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const body = await req.json();

    if (!body.qteReserved || !body.productId || !body.customerId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields (qteReserved, productId or customerId)",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    const newReservationItem = await prisma.reservationItem.create({
      data: {
        qteReserved: body.qteReserved,
        price: body.price || null,
        discountedPrice: body.discountedPrice || null,
        weight: body.weight || 0,
        sku: body.sku || null,
        product: {
          connect: { id: body.productId },
        },
        source: body.sourceId
          ? {
              connect: { id: body.sourceId },
            }
          : undefined,
        Customer: {
          connect: { id: body.customerId },
        },
      },
      include: {
        product: true,
        source: true,
        Customer: true,
        partner: true,
      },
    });

    return NextResponse.json(
      {
        message: "Reservation item created",
        reservationItem: newReservationItem,
      },
      { status: 201, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error creating reservation item:", error);
    return NextResponse.json(
      { error: "Failed to create reservation item" },
      { status: 500, headers: corsHeaders },
    );
  }
}
