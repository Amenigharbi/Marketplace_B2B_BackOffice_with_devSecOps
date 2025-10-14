import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 POST: Create a new related product
export async function POST(req: Request) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const body = await req.json();

    const newRelatedProduct = await prisma.relatedProduct.create({
      data: {
        productId: body.productId,
        relatedProductId: body.relatedProductId,
      },
    });

    return NextResponse.json(
      { message: "Related product created", relatedProduct: newRelatedProduct },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating related product:", error);
    return NextResponse.json(
      { error: "Failed to create related product" },
      { status: 500 },
    );
  }
}
