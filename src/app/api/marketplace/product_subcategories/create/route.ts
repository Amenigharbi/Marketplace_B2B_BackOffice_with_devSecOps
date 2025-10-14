import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 POST: Create a new product subcategory
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.productId || !body.subcategoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newProductSubCategory = await prisma.productSubCategory.create({
      data: {
        productId: body.productId,
        subcategoryId: body.subcategoryId,
      },
    });

    return NextResponse.json(
      {
        message: "ProductSubCategory created successfully",
        productSubCategory: newProductSubCategory,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating ProductSubCategory:", error);
    return NextResponse.json(
      { error: "Failed to create ProductSubCategory" },
      { status: 500 },
    );
  }
}
