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

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const supplierExists = await prisma.manufacturer.findUnique({
      where: { id },
    });

    if (!supplierExists) {
      return NextResponse.json(
        { error: "Supplier not found" },
        {
          status: 404,
          headers: corsHeaders,
        },
      );
    }

    const products = await prisma.product.findMany({
      where: {
        supplierId: id,
      },
      include: {
        images: true,
        productType: true,
        productStatus: true,
        tax: true,
        promotion: true,
        skuPartners: {
          // Ajoutez cette inclusion
          include: {
            partner: true, // Incluez les données du partenaire
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const formattedProducts = products.map((product) => ({
      ...product,
      partners: product.skuPartners.map((sp) => sp.partner), // Crée un tableau direct de partenaires
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedProducts, // Utilisez formattedProducts si vous voulez la structure simplifiée
        // Ou utilisez simplement 'products' si vous préférez garder la structure originale
        meta: {
          count: products.length,
          supplierId: id,
          supplierName: supplierExists.companyName,
        },
      },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error("Error fetching supplier products:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch supplier products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}
