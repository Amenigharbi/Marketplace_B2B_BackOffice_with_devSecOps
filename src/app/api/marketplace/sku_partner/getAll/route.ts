// app/api/skupartner/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // const session = await auth();

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const skuPartners = await prisma.skuPartner.findMany({
      include: {
        product: true,
        partner: true,
        stock: true,
      },
    });

    if (skuPartners.length === 0) {
      return NextResponse.json(
        { message: "No SkuPartners found", skuPartners: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "SkuPartners retrieved successfully", skuPartners },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching SkuPartners:", error);
    return NextResponse.json(
      { error: "Failed to retrieve SkuPartners" },
      { status: 500 },
    );
  }
}
