import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { corsHeaders } from "@/utils/cors";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "productId parameter is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Fetch product with skuPartners and their stocks/sources
    const productWithData = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        skuPartners: {
          include: {
            partner: {
              include: {
                sources: true,
              },
            },
            stock: {
              include: {
                source: true,
              },
              where: {
                sealable: {
                  // Changé de stockQuantity à sealable
                  gt: 0,
                },
              },
            },
          },
        },
        images: true, // Ajouté pour inclure les images du produit
      },
    });

    if (!productWithData) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    // Transform data to group by partner with their available sources
    const partnersData = productWithData.skuPartners
      .map((skuPartner) => {
        return {
          partner: {
            id: skuPartner.partner.id,
            username: skuPartner.partner.username,
            logo: skuPartner.partner.logo,
            minimumAmount: skuPartner.partner.minimumAmount,
          },
          sources: skuPartner.stock.map((stock) => ({
            ...stock.source,
            stock: {
              sealable: stock.sealable, // Changé de stockQuantity à sealable
              price: stock.price,
              special_price: stock.special_price,
              minQty: stock.minQty,
              maxQty: stock.maxQty,
            },
          })),
        };
      })
      .filter((partnerData) => partnerData.sources.length > 0);

    return NextResponse.json(
      {
        success: true,
        data: {
          product: {
            id: productWithData.id,
            name: productWithData.name,
            description: productWithData.description,
            weight: productWithData.weight,
            sku: productWithData.sku,
            images: productWithData.images, // Ajout des images
            brandId: productWithData.brandId, // Ajout de brandId si nécessaire
          },
          partnersData,
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: corsHeaders },
    );
  } finally {
    await prisma.$disconnect();
  }
}
