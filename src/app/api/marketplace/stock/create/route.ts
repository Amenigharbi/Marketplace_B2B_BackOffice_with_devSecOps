// app/api/marketplace/stock/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // const session = await auth();

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const body = await req.json();

    if (
      !body.skuPartnerId ||
      !body.sourceId ||
      body.stockQuantity === undefined ||
      body.minQty === undefined ||
      body.maxQty === undefined ||
      !body.price
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if a stock entry with this skuPartnerId and sourceId combination already exists
    const existingStock = await prisma.stock.findUnique({
      where: {
        skuPartnerId_sourceId: {
          skuPartnerId: body.skuPartnerId,
          sourceId: body.sourceId,
        },
      },
    });

    if (existingStock) {
      return NextResponse.json(
        {
          message: "Stock entry already exists for this SKU partner and source",
        },
        { status: 409 },
      );
    }

    const newStock = await prisma.stock.create({
      data: {
        skuPartnerId: body.skuPartnerId,
        sourceId: body.sourceId,
        stockQuantity: body.stockQuantity,
        minQty: body.minQty,
        maxQty: body.maxQty,
        price: body.price,
        sealable: body.sealable,
        loyaltyPointsPerProduct: body.loyaltyPointsPerProduct || null,
        loyaltyPointsPerUnit: body.loyaltyPointsPerUnit || null,
        loyaltyPointsBonusQuantity: body.loyaltyPointsBonusQuantity || null,
        loyaltyPointsThresholdQty: body.loyaltyPointsThresholdQty || null,
      },
    });

    return NextResponse.json(
      { message: "Stock created successfully", stock: newStock },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating Stock:", error);
    return NextResponse.json(
      { error: "Failed to create Stock" },
      { status: 500 },
    );
  }
}
