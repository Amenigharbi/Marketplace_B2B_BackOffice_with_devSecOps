import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const products = await prisma.product.findMany({
      include: {
        productType: true,
        productStatus: true,
        supplier: true,
        tax: true,
        promotion: true,
      },
    });
    return NextResponse.json(
      { message: "Products retrieved", products },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to retrieve products" },
      { status: 500 },
    );
  }
}
