// app/api/marketplace/favoris_product/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { corsHeaders } from "@/utils/cors";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    if (!customerId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "customerId is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    const favorites = await prisma.favoriteProduct.findMany({
      where: { customerId },
      include: {
        product: {
          include: {
            images: true,
            skuPartners: {
              include: {
                partner: true,
              },
            },
          },
        },
      },
    });

    const formattedFavorites = favorites.map((fav) => ({
      id: fav.id,
      customerId: fav.customerId,
      productId: fav.productId,
      product: {
        ...fav.product,
        images: fav.product.images.map((img) => ({ url: img.url })),
        partners: fav.product.skuPartners.map((sp) => sp.partner.username),
        mainImage: fav.product.images[0]?.url || null,
      },
      createdAt: fav.createdAt,
      updatedAt: fav.updatedAt,
    }));

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: formattedFavorites,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Internal Server Error",
      }),
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
