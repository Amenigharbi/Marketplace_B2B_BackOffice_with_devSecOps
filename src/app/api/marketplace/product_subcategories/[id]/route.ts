// app/api/productCategories/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a product-category by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const productSubCategory = await prisma.productSubCategory.findUnique({
      where: { id },
      include: {
        product: true, // Include related product details
        subcategory: true, // Include related category details
      },
    });

    if (!productSubCategory) {
      return NextResponse.json(
        { message: "productSubCategory not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "productSubCategory retrieved successfully",
        productSubCategory,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching productSubCategory:", error);
    return NextResponse.json(
      { error: "Failed to retrieve productSubCategory" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a product-category by ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth(); // Get user session

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;
    const body = await req.json();

    const updatedProductSubCategory = await prisma.productSubCategory.update({
      where: { id },
      data: {
        productId: body.productId,
        subcategory: body.categoryId,
      },
    });

    return NextResponse.json(
      {
        message: "productSubCategory updated successfully",
        productSubCategory: updatedProductSubCategory,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating productSubCategory:", error);
    return NextResponse.json(
      { error: "Failed to update productSubCategory" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a product-category by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Delete the productSubCategory by ID
    await prisma.productSubCategory.delete({ where: { id } });

    return NextResponse.json(
      { message: "productSubCategory deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting productSubCategory:", error);
    return NextResponse.json(
      { error: "Failed to delete productSubCategory" },
      { status: 500 },
    );
  }
}
