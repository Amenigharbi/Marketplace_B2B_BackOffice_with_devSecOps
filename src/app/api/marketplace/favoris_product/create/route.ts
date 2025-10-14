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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.customerId || !body.productId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "customerId and productId are required",
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

    const product = await prisma.product.findUnique({
      where: { id: body.productId },
      include: {
        images: true,
        skuPartners: {
          include: {
            partner: true,
          },
        },
      },
    });

    if (!product) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Product not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    const existingFavorite = await prisma.favoriteProduct.findUnique({
      where: {
        customerId_productId: {
          customerId: body.customerId,
          productId: body.productId,
        },
      },
    });

    if (existingFavorite) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product already in favorites",
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    const favoriteProduct = await prisma.favoriteProduct.create({
      data: {
        customerId: body.customerId,
        productId: body.productId,
        productImage: product.images[0]?.url,
        partnerNames: product.skuPartners.map((sp) => sp.partner.username),
      },
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

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: {
          ...favoriteProduct,
          product: {
            ...favoriteProduct.product,
            partners: favoriteProduct.product.skuPartners.map(
              (sp) => sp.partner.username,
            ),
            mainImage: favoriteProduct.product.images[0]?.url,
          },
        },
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error("Detailed error:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
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
