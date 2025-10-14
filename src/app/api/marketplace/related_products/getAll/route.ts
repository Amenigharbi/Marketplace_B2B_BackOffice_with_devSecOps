import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all related products (with included product data)
export async function GET(req: Request) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const relatedProducts = await prisma.relatedProduct.findMany({
      include: {
        product: { include: { images: true } },
        relatedProduct: { include: { images: true } },
      },
    });
    return NextResponse.json(
      { message: "Related products retrieved", relatedProducts },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "Failed to retrieve related products" },
      { status: 500 },
    );
  }
}
