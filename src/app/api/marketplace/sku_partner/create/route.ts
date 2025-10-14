// app/api/marketplace/sku_partner/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    let user = session.user as {
      id: string;
      roleId: string;
      mRoleId: string;
      username: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
      userType?: string;
    };

    const body = await req.json();

    if (!body.productId || !body.skuPartner || !body.skuProduct) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    let partnerId;
    if (user.userType === "partner") {
      partnerId = user.id;
    } else {
      // For admin users, get the partnerId from the request body
      partnerId = body.partnerId;

      if (!partnerId) {
        return NextResponse.json(
          {
            message:
              "Invalid request: 'partnerId' is required for admin users.",
          },
          { status: 400 },
        );
      }
    }

    // No need to check for uniqueness of skuPartner since they don't have to be unique
    // However, we should check that the same partner isn't assigned to the same product multiple times
    const existingPartnerProduct = await prisma.skuPartner.findFirst({
      where: {
        productId: body.productId,
        partnerId: partnerId,
      },
    });

    if (existingPartnerProduct) {
      return NextResponse.json(
        { message: "This partner is already assigned to this product" },
        { status: 409 },
      );
    }

    const newSkuPartner = await prisma.skuPartner.create({
      data: {
        productId: body.productId,
        partnerId: partnerId,
        skuPartner: body.skuPartner,
        skuProduct: body.skuProduct,
      },
    });

    return NextResponse.json(
      { message: "SkuPartner created successfully", skuPartner: newSkuPartner },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating SkuPartner:", error);
    return NextResponse.json(
      { error: "Failed to create SkuPartner" },
      { status: 500 },
    );
  }
}
