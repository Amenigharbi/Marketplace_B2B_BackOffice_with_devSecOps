// app/api/marketplace/brand/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { corsHeaders } from "@/utils/cors";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        products: {
          include: {
            skuPartners: {
              include: {
                partner: true,
              },
            },
          },
        },
      },
    });

    // Formater les données pour inclure le count de produits
    const formattedBrands = brands.map((brand) => ({
      ...brand,
      productsCount: brand.products.length,
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedBrands,
        message: "Brands retrieved successfully",
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve brands",
        data: [],
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
