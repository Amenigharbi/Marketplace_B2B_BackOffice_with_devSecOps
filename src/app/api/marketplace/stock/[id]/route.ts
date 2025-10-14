// app/api/marketplace/stock/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve a specific stock by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;

    const stock = await prisma.stock.findUnique({
      where: { id },
      include: {
        skuPartner: {
          include: {
            product: true,
            partner: true,
          },
        },
        source: true,
      },
    });

    if (!stock) {
      return NextResponse.json({ message: "Stock not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Stock retrieved successfully", stock },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching stock:", error);
    return NextResponse.json(
      { error: "Failed to retrieve stock" },
      { status: 500 },
    );
  }
}

// PATCH: Update a stock by ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;
    const body = await req.json();

    // Check if stock exists
    const existingStock = await prisma.stock.findUnique({
      where: { id },
    });

    if (!existingStock) {
      return NextResponse.json({ message: "Stock not found" }, { status: 404 });
    }

    // If skuPartnerId or sourceId is being changed, check for uniqueness
    if (
      (body.skuPartnerId && body.skuPartnerId !== existingStock.skuPartnerId) ||
      (body.sourceId && body.sourceId !== existingStock.sourceId)
    ) {
      const skuPartnerIdToCheck =
        body.skuPartnerId || existingStock.skuPartnerId;
      const sourceIdToCheck = body.sourceId || existingStock.sourceId;

      const duplicateCheck = await prisma.stock.findUnique({
        where: {
          skuPartnerId_sourceId: {
            skuPartnerId: skuPartnerIdToCheck,
            sourceId: sourceIdToCheck,
          },
        },
      });

      if (duplicateCheck && duplicateCheck.id !== id) {
        return NextResponse.json(
          {
            message:
              "Stock entry already exists for this SKU partner and source",
          },
          { status: 409 },
        );
      }
    }

    const updatedStock = await prisma.stock.update({
      where: { id },
      data: {
        skuPartnerId: body.skuPartnerId,
        sourceId: body.sourceId,
        stockQuantity: body.stockQuantity,
        sealable: body.sealable,
        minQty: body.minQty,
        maxQty: body.maxQty,
        price: body.price,
        loyaltyPointsPerProduct: body.loyaltyPointsPerProduct,
        loyaltyPointsPerUnit: body.loyaltyPointsPerUnit,
        loyaltyPointsBonusQuantity: body.loyaltyPointsBonusQuantity,
        loyaltyPointsThresholdQty: body.loyaltyPointsThresholdQty,
      },
    });

    return NextResponse.json(
      { message: "Stock updated successfully", stock: updatedStock },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { error: "Failed to update stock" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a stock by ID
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

    // Check if stock exists
    const existingStock = await prisma.stock.findUnique({
      where: { id },
    });

    if (!existingStock) {
      return NextResponse.json({ message: "Stock not found" }, { status: 404 });
    }

    await prisma.stock.delete({ where: { id } });

    return NextResponse.json(
      { message: "Stock deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting stock:", error);
    return NextResponse.json(
      { error: "Failed to delete stock" },
      { status: 500 },
    );
  }
}
